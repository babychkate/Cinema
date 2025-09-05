using Cinema.Contracts;
using Cinema.Data;
using Cinema.Enums;
using Cinema.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Cinema.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext __dbContext;
        private readonly UserManager<User> _userManager;

        public UserController(AppDbContext dbContext, UserManager<User> userManager)
        {
            __dbContext = dbContext;
            _userManager = userManager;
        }

        [HttpGet("Filters")]
        public async Task<IActionResult> Filters([FromQuery] FilterDto filter)
        {
            var query = __dbContext.Films.AsQueryable();

            if (!string.IsNullOrEmpty(filter.Genre))
            {
                query = query.Where(m => m.Genres.Any(g => g.Name == filter.Genre));
            }

            if (filter.Year.HasValue)
            {
                query = query.Where(m => m.Release_year == filter.Year.Value);
            }

            if (filter.Duration.HasValue)
            {
                TimeSpan minDuration = filter.Duration.Value - TimeSpan.FromMinutes(20);
                TimeSpan maxDuration = filter.Duration.Value + TimeSpan.FromMinutes(20);

                query = query.Where(m => m.Sessions.Any(s => s.Duration >= minDuration && s.Duration <= maxDuration));
            }

            if (filter.Rating.HasValue)
            {
                query = query.Where(m => m.Age_limit >= filter.Rating.Value);
            }

            if (!string.IsNullOrEmpty(filter.SortOrder) && filter.SortOrder.ToLower() == "desc")
            {
                query = query.OrderByDescending(m => m.Release_year);
            }
            else if (!string.IsNullOrEmpty(filter.SortOrder) && filter.SortOrder.ToLower() == "asc")
            {
                query = query.OrderBy(m => m.Release_year);
            }

            var films = await query
                .Select(m => new
                {
                    m.Id,
                    m.Name,
                    m.Description,
                    m.Release_year,
                    m.ImageUrl,
                    m.TrailerUrl,
                    m.Age_limit,
                    Genres = m.Genres.Select(g => new { g.Id, g.Name }).ToList()
                })
                .ToListAsync();

            return Ok(films);
        }


        [HttpGet("Search")]
        public async Task<IActionResult> SearchForFilmName(string? searchRequest)
        {
            var search = __dbContext.Films
                .Where(f => !string.IsNullOrEmpty(searchRequest) &&
                f.Name.ToLower().Contains(searchRequest.ToLower()));

            var films = await search.ToListAsync();
            return Ok(films);
        }

        [HttpGet("View")]
        public async Task<IActionResult> ViewFilms()
        {
            var filmInfo = await __dbContext.Films
                .Include(f => f.Reviews)
                .Select(f => new
                {
                    f.Name,
                    f.ImageUrl,
                    f.Description,
                    Review = f.Reviews.Select(r => new
                    {
                        r.Mark,
                        r.Content
                    }).ToList(),
                    f.TrailerUrl
                }).ToListAsync();

            return Ok(filmInfo);
        }

        [HttpGet("SummerSale")]
        public async Task<IActionResult> SummerSale()
        {
            var userIdFromClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
                                  User.FindFirst("sub")?.Value ??
                                  User.FindFirst(ClaimTypes.Name)?.Value;

            if (string.IsNullOrEmpty(userIdFromClaim))
            {
                return Unauthorized(new { error = "Cannot get UserId from token" });
            }

            var user = await _userManager.FindByNameAsync(userIdFromClaim);

            if (user == null)
            {
                return NotFound(new { error = "User not found" });
            }

            var userId = user.Id;

            if (user.Age < 1 || user.Age > 12)
            {
                return BadRequest(new { error = "User is not eligible for the SummerForKids discount. Age must be between 1 and 12." });
            }

            var bookedTickets = __dbContext.Tickets
                                        .Where(t => t.UserId == userId && t.Status == "Booked")
                                        .ToList();

            if (bookedTickets.Count == 0)
            {
                return BadRequest(new { error = "No booked tickets found for the user." });
            }

            var summerForKidsSales = __dbContext.Sales
                                               .Where(s => s.Discount_type == "SummerForKids" && s.Is_Active)
                                               .ToList();

            if (summerForKidsSales.Count == 0)
            {
                return BadRequest(new { error = "No active SummerForKids sales found." });
            }

            decimal ticketDiscountAmount = 0;
            decimal snackDiscountAmount = 0;
            bool hasTicketDiscount = false;
            bool hasSnackDiscount = false;

            foreach (var sale in summerForKidsSales)
            {
                if (sale.For_what == Cinema.Enums.ForWhatType.Both.ToString()) 
                {
                    ticketDiscountAmount = sale.Discount / 100m;
                    snackDiscountAmount = sale.Discount / 100m;
                    hasTicketDiscount = true;
                    hasSnackDiscount = true;
                    break; 
                }
                else if (sale.For_what == Cinema.Enums.ForWhatType.Ticket.ToString())
                {
                    ticketDiscountAmount = sale.Discount / 100m;
                    hasTicketDiscount = true;
                }
                else if (sale.For_what == Cinema.Enums.ForWhatType.Snack.ToString())
                {
                    snackDiscountAmount = sale.Discount / 100m;
                    hasSnackDiscount = true;
                }
            }

            string message = "Discount applied to: ";

            if (hasTicketDiscount)
            {
                foreach (var ticket in bookedTickets)
                {
                    decimal originalPrice = ticket.Price;
                    ticket.Price -= (int)(ticket.Price * ticketDiscountAmount);
                }
                message += "Tickets";
            }

            if (hasSnackDiscount)
            {
                var userSnacks = __dbContext.Snacks
                                            .Where(s => s.Users.Any(u => u.Id == userId))
                                            .ToList();

                foreach (var snack in userSnacks)
                {
                    snack.Price -= (int)(snack.Price * snackDiscountAmount);
                }

                if (hasTicketDiscount) message += " and ";
                message += "Snacks";
            }

            if (!hasTicketDiscount && !hasSnackDiscount)
            {
                return BadRequest(new { error = "No applicable discounts for Tickets or Snacks." });
            }

            await __dbContext.SaveChangesAsync();

            return Ok(new { message = message });
        }

        [HttpGet("DateSale")]
        public async Task<IActionResult> DateSale()
        {
            var userIdFromClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
                                  User.FindFirst("sub")?.Value ??
                                  User.FindFirst(ClaimTypes.Name)?.Value;

            if (string.IsNullOrEmpty(userIdFromClaim))
            {
                return Unauthorized(new { error = "Cannot get UserId from token" });
            }

            var user = await _userManager.FindByNameAsync(userIdFromClaim);

            if (user == null)
            {
                return NotFound(new { error = "User not found" });
            }

            var userId = user.Id;

            var date = await __dbContext.Sessions
                .Select(s => s.Date)
                .FirstOrDefaultAsync();

            if (date != null)
            {
                if (date.Day % 3 != 0)
                {
                    return BadRequest(new { error = "User is not eligible for the ShowDateDiscount discount. The date must be divisible by 3" });
                }
            }

            var bookedTickets = __dbContext.Tickets
                                        .Where(t => t.UserId == userId && t.Status == "Booked")
                                            .ToList();

            if (bookedTickets.Count == 0)
            {
                return BadRequest(new { error = "No booked tickets found for the user." });
            }

            var dateSale = __dbContext.Sales
                                        .FirstOrDefault(s => s.Discount_type == "ShowDateDiscount" && s.Is_Active);

            if (dateSale == null)
            {
                return BadRequest(new { error = "No active ShowDateDiscount sale found." });
            }

            decimal discountAmount = dateSale.Discount / 100m;

            foreach (var ticket in bookedTickets)
            {
                decimal originPrice = ticket.Price;
                ticket.Price -= (int)(ticket.Price * discountAmount);
            }

            await __dbContext.SaveChangesAsync();

            return Ok(new { message = "Discount applied successfully." });
        }

       

    }
}
