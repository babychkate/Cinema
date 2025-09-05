using Cinema.Contracts;
using Cinema.Data;
using Cinema.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace Cinema.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;
        private readonly TimeZoneInfo kyivTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Europe/Kiev");

        public TicketController(AppDbContext context,
                                UserManager<User> userManager,
                                IConfiguration configuration)
        {
            _context = context;
            _userManager = userManager;
            _configuration = configuration;
        }

        // -------------------- BOOK TICKET --------------------
        [HttpPost("book_ticket")]
        public async Task<IActionResult> BookTicket(List<Guid> ticketIds)
        {
            var user = await GetCurrentUserWithTickets();
            if (user == null) return NotFound("User not found");

            var tickets = await _context.Tickets
                                        .Where(t => ticketIds.Contains(t.Id))
                                        .ToListAsync();
            if (!tickets.Any()) return NotFound("Tickets not found");

            var checks = await DoChecks(user, tickets);
            if (checks is ObjectResult { StatusCode: >= 400 }) return checks;

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                foreach (var ticket in tickets)
                {
                    _context.Entry(ticket).Reload();

                    if (ticket.Status.ToLower() == "bought")
                        return ticket.UserId == user.Id.ToString()
                            ? BadRequest($"You have already bought ticket {ticket.Seat_number} and cannot book it")
                            : BadRequest($"The ticket {ticket.Seat_number} is already bought by another user");

                    if (ticket.Status.ToLower() == "booked")
                        return ticket.UserId == user.Id.ToString()
                            ? BadRequest($"You have already booked ticket {ticket.Seat_number}")
                            : BadRequest($"The ticket {ticket.Seat_number} is already booked by another user");

                    ticket.UserId = user.Id.ToString();
                    ticket.Status = "Booked";
                    ticket.Book_buy_data = GetKyivNow();

                    var historyRecord = CreateHistory(user.Id, ticket, ActionType.Booked);
                    user.Tickets.Add(ticket);
                    user.Histories.Add(historyRecord);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok("Ticket/s successfully booked!");
            }
            catch
            {
                await transaction.RollbackAsync();
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        // -------------------- BUY TICKET --------------------
        [HttpPost("buy_ticket")]
        public async Task<IActionResult> BuyTicket(List<Guid> ticketIds)
        {
            var user = await GetCurrentUserWithTickets();
            if (user == null) return NotFound("User not found");

            var tickets = await _context.Tickets
                                        .Where(t => ticketIds.Contains(t.Id))
                                        .ToListAsync();
            if (!tickets.Any()) return NotFound("Tickets not found");

            var checks = await DoChecks(user, tickets);
            if (checks is ObjectResult { StatusCode: >= 400 }) return checks;

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                foreach (var ticket in tickets)
                {
                    _context.Entry(ticket).Reload();

                    if (ticket.Status.ToLower() == "available")
                        return BadRequest($"You have to book ticket {ticket.Seat_number} before buying it");

                    if (ticket.Status.ToLower() == "bought")
                        return ticket.UserId == user.Id.ToString()
                            ? BadRequest($"You have already bought ticket {ticket.Seat_number} and cannot buy it")
                            : BadRequest($"The ticket {ticket.Seat_number} is already bought by another user");

                    if (ticket.Status.ToLower() == "booked" && ticket.UserId != user.Id.ToString())
                        return BadRequest($"The ticket {ticket.Seat_number} is already booked by another user");

                    ticket.UserId = user.Id.ToString();
                    ticket.Status = "Bought";
                    ticket.Book_buy_data = GetKyivNow();

                    var historyRecord = CreateHistory(user.Id, ticket, ActionType.Bought);
                    user.Tickets.Add(ticket);
                    user.Histories.Add(historyRecord);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok("Ticket/s successfully bought!");
            }
            catch
            {
                await transaction.RollbackAsync();
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        // -------------------- CANCEL TICKET --------------------
        [HttpPost("cancel_ticket")]
        [Authorize]
        public async Task<IActionResult> CancelTicket(List<Guid> ticketIds)
        {
            var user = await GetCurrentUserWithTickets();
            if (user == null) return NotFound("User not found");

            var tickets = user.Tickets.Where(t => ticketIds.Contains(t.Id)).ToList();
            if (!tickets.Any()) return NotFound("Tickets not found");

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                foreach (var ticket in tickets)
                {
                    if (ticket.Status.ToLower() == "available")
                        return BadRequest("You have not booked/bought this ticket yet");

                    ticket.Status = "Available";
                    ticket.UserId = null;
                    ticket.Book_buy_data = DateTime.MinValue;

                    var historyRecord = CreateHistory(user.Id, ticket, ActionType.Canceled);
                    user.Histories.Add(historyRecord);
                    user.Tickets.Remove(ticket);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok("Ticket/s successfully canceled!");
            }
            catch
            {
                await transaction.RollbackAsync();
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        // -------------------- GET USER TICKETS --------------------
        [Authorize]
        [HttpGet("get_user_tickets")]
        public async Task<IActionResult> GetTickets()
        {
            var user = await GetCurrentUserWithTickets();
            if (user == null) return NotFound("User not found");

            var tickets = user.Tickets
                .Where(t => t.Status.ToLower() == "booked" || t.Status.ToLower() == "bought")
                .Select(t => new TicketAnswerDto
                {
                    Id = t.Id,
                    Seat_number = t.Seat_number,
                    Status = t.Status,
                    Price = t.Price,
                    Book_buy_data = t.Book_buy_data,
                    FilmName = t.Session!.Film!.Name
                })
                .ToList();

            return Ok(tickets);
        }

        // -------------------- GET HALL TICKETS --------------------
        [Authorize]
        [HttpGet("get_hall_tickets")]
        public async Task<IActionResult> GetHallTickets(Guid hallId)
        {
            var tickets = await _context.Tickets
                .Where(t => t.Session!.HallId == hallId)
                .Select(t => new TicketAnswerAdminDto
                {
                    Id = t.Id,
                    Seat_number = t.Seat_number,
                    Status = t.Status,
                    Price = t.Price,
                    Book_buy_data = t.Book_buy_data,
                    FilmName = t.Session!.Film!.Name,
                    UserId = t.UserId,
                    SessionId = t.SessionId
                })
                .ToListAsync();

            return Ok(tickets);
        }

        // -------------------- GET ALL USERS TICKETS --------------------
        [Authorize(Roles = "Admin")]
        [HttpGet("view_all_users_tickets")]
        public async Task<IActionResult> GetUsersTickets()
        {
            var tickets = await _userManager.Users
                .Include(u => u.Tickets)
                    .ThenInclude(t => t.Session)
                    .ThenInclude(s => s.Film)
                .SelectMany(u => u.Tickets
                    .Where(t => t.Status.ToLower() == "booked" || t.Status.ToLower() == "bought")
                    .Select(t => new TicketAnswerAdminDto
                    {
                        Id = t.Id,
                        Seat_number = t.Seat_number,
                        Status = t.Status,
                        Price = t.Price,
                        Book_buy_data = t.Book_buy_data,
                        FilmName = t.Session!.Film!.Name,
                        UserId = t.UserId,
                        SessionId = t.SessionId
                    }))
                .ToListAsync();

            return Ok(tickets);
        }

        // -------------------- HELPERS --------------------
        private async Task<User?> GetCurrentUserWithTickets()
        {
            var username = GetUsernameFromToken();
            if (username == null) return null;

            return await _userManager.Users
                .Include(u => u.Tickets)
                    .ThenInclude(t => t.Session)
                    .ThenInclude(s => s.Film)
                .Include(u => u.Histories)
                .FirstOrDefaultAsync(u => u.UserName == username);
        }

        private DateTime GetKyivNow() => TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, kyivTimeZone);

        private History CreateHistory(string userId, Ticket ticket, ActionType actionType)
        {
            return new History
            {
                UserId = userId,
                TicketId = ticket.Id,
                Seat_number = ticket.Seat_number,
                Price = ticket.Price,
                FilmId = ticket.Session?.FilmId,
                FilmName = ticket.Session?.Film?.Name ?? "Unknown",
                ActionDate = GetKyivNow(),
                Type = actionType
            };
        }

        private string? GetUsernameFromToken()
        {
            var authHeader = Request.Headers["Authorization"].ToString();
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer ")) return null;

            string token = authHeader.Substring("Bearer ".Length);
            var tokenHandler = new JwtSecurityTokenHandler();
            var jsonToken = tokenHandler.ReadToken(token) as JwtSecurityToken;
            if (jsonToken == null) return null;

            var key = _configuration["Jwt:Key"];
            var issuer = _configuration["Jwt:Issuer"];
            if (key is null || issuer is null) return null;

            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = issuer,
                ValidateAudience = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(key)),
                ValidateLifetime = true
            };

            var principal = tokenHandler.ValidateToken(token, validationParameters, out _);
            var username = jsonToken?.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub)?.Value;
            return username;
        }

        private async Task<IActionResult> DoChecks(User user, List<Ticket> tickets)
        {
            var sessionIds = tickets.Select(t => t.SessionId).ToList();
            var sessions = await _context.Sessions.Where(s => sessionIds.Contains(s.Id)).ToListAsync();
            if (!sessions.Any()) return NotFound("Some sessions not found");

            var filmIds = sessions.Select(s => s.FilmId).ToList();
            var films = await _context.Films.Where(f => filmIds.Contains(f.Id)).ToListAsync();
            if (!films.Any()) return NotFound("Some films are not available");

            var invalidFilm = films.FirstOrDefault(f => user.Age < f.Age_limit);
            if (invalidFilm != null)
                return BadRequest($"Sorry, you must be at least {invalidFilm.Age_limit} years old to watch '{invalidFilm.Name}'");

            var invalidSession = sessions.FirstOrDefault(s => s.Date < DateOnly.FromDateTime(GetKyivNow()));
            if (invalidSession != null)
                return NotFound($"Session with film '{invalidSession.Film!.Name}' has already started or ended");

            var halls = await _context.Halls.Where(h => sessions.Select(s => s.HallId).Contains(h.Id)).ToListAsync();
            foreach (var session in sessions)
            {
                var hall = halls.FirstOrDefault(h => h.Id == session.HallId);
                if (hall == null) return NotFound($"There is no hall for film '{session.Film!.Name}'");
                if (!hall.Is_available) return NotFound($"The hall for film '{session.Film!.Name}' is temporarily closed");
            }

            return Ok();
        }
    }
}
