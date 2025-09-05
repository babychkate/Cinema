using Cinema.Data;
using Cinema.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using Cinema.Contracts;

namespace Cinema.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HistoryController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public HistoryController(UserManager<User> userManager,
                                 AppDbContext context,
                                 IConfiguration configuration)
        {
            _userManager = userManager;
            _context = context;
            _configuration = configuration;
        }

        // ================= USER METHODS =================

        [Authorize(Roles = "User")]
        [HttpGet("get_user_histories")]
        public async Task<IActionResult> GetAllHistories()
        {
            var username = GetUsernameFromToken();
            if (username is null) return NotFound("Username not found");

            var user = await _userManager.FindByNameAsync(username);
            if (user is null) return NotFound("User not found");

            var histories = await _context.Histories
                .Where(h => h.UserId == user.Id.ToString())
                .OrderByDescending(h => h.ActionDate)
                .Select(h => new HistoryAnswerDto
                {
                    Seat_number = h.Seat_number,
                    Price = h.Price,
                    FilmName = h.FilmName!,
                    ActionDate = h.ActionDate,
                    Type = h.Type.ToString()
                })
                .ToListAsync();

            if (!histories.Any()) return NotFound("No history records found.");
            return Ok(histories);
        }

        [Authorize(Roles = "User")]
        [HttpPost("history_of_film/{filmId}")]
        public async Task<IActionResult> HistoryOfFilm(Guid filmId)
        {
            var username = GetUsernameFromToken();
            if (username is null) return NotFound("Username not found");

            var user = await _userManager.FindByNameAsync(username);
            if (user is null) return NotFound("User not found");

            var film = await _context.Films.FirstOrDefaultAsync(f => f.Id == filmId);
            if (film is null) return NotFound("Film not found");

            DateTime kyivTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow,
                TimeZoneInfo.FindSystemTimeZoneById("Europe/Kiev"));

            var history = new History
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                TicketId = null,
                FilmId = filmId,
                ActionDate = kyivTime,
                Type = ActionType.Watched,
                Url_of_page = $"/api/History/history_of_film/{filmId}",
                FilmName = film.Name
            };

            _context.Histories.Add(history);
            await _context.SaveChangesAsync();

            return Ok("History successfully saved");
        }

        [Authorize]
        [HttpDelete("clear_user_history")]
        public async Task<IActionResult> ClearUserHistory()
        {
            var username = GetUsernameFromToken();
            if (username is null) return NotFound("Username not found");

            var user = await _userManager.Users
                             .Include(u => u.Histories)
                             .FirstOrDefaultAsync(u => u.UserName == username);
            if (user is null) return NotFound("User not found");

            _context.Histories.RemoveRange(user.Histories);
            await _context.SaveChangesAsync();

            return Ok("User history cleared successfully");
        }

        // ================= ADMIN METHODS =================

        [Authorize(Roles = "Admin")]
        [HttpDelete("delete_ticket_and_set_null")]
        public IActionResult DeleteTicketAndSetNull(Guid ticketId)
        {
            var ticket = _context.Tickets.FirstOrDefault(t => t.Id == ticketId);
            var histories = _context.Histories.Where(h => h.TicketId == ticketId).ToList();

            if (ticket == null) return NotFound("Ticket not found");

            foreach (var history in histories) history.TicketId = null;
            _context.Tickets.Remove(ticket);
            _context.SaveChanges();

            return Ok("Ticket deleted successfully");
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("delete_film_and_set_null")]
        public IActionResult DeleteFilmAndSetNull(Guid filmId)
        {
            var film = _context.Films.FirstOrDefault(f => f.Id == filmId);
            var histories = _context.Histories.Where(h => h.FilmId == filmId).ToList();

            if (film == null) return NotFound("Film not found");

            foreach (var history in histories) history.FilmId = null;
            _context.Films.Remove(film);
            _context.SaveChanges();

            return Ok("Film deleted successfully");
        }

        // ================= HELPER METHODS =================

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
            if (principal == null) return null;

            return jsonToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub)?.Value;
        }
    }
}
