using Cinema.Data;
using Cinema.Enums;
using Cinema.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Cinema.Test
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public TestController(UserManager<User> userManager,
                       RoleManager<IdentityRole> roleManager,
                       AppDbContext dbContext)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _dbContext = dbContext;
        }

        [HttpGet("SummerSale")]
        public async Task<IActionResult> SummerSale([FromServices] IDiscountService discountService)
        {
            var userName = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userName))
            {
                return Unauthorized(new { error = "UserName not found in claims." });
            }

            var user = await _userManager.FindByNameAsync(userName);

            if (user == null)
            {
                return NotFound(new { error = $"User not found in database. UserName: {userName}" });
            }

            if (user.Age < 1 || user.Age > 12)
            {
                return BadRequest(new { error = "User is not eligible for the SummerForKids discount. Age must be between 1 and 12." });
            }

            var discountResult = await discountService.ApplyDiscount(DiscountType.SummerForKids, null);

            if (discountResult is OkObjectResult okResult)
            {
                var resultValue = okResult.Value as dynamic;

                return new OkObjectResult(new
                {
                    message = resultValue.message,
                    finalTicketAmount = resultValue.finalTicketAmount,
                    finalSnackAmount = resultValue.finalSnackAmount
                });
            }
            else if (discountResult is BadRequestObjectResult badRequest)
            {
                var errorResult = badRequest.Value as dynamic;
                return new BadRequestObjectResult(new { error = errorResult.error });
            }

            return new BadRequestObjectResult(new { error = "Error applying discount." });
        }

        [HttpGet("DateSale")]
        public async Task<IActionResult> DateSale([FromServices] IDiscountService discountService)
        {
            var userName = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userName))
            {
                return Unauthorized(new { error = "UserName not found in claims." });
            }

            var user = await _userManager.FindByNameAsync(userName);

            if (user == null)
            {
                return NotFound(new { error = $"User not found in database. UserName: {userName}" });
            }

            var bookedTickets = await _dbContext.Tickets
                .Where(t => t.UserId == user.Id && t.Status == "Booked")
                .ToListAsync();

            if (!bookedTickets.Any())
            {
                return BadRequest(new { error = "User does not have any booked tickets." });
            }

            var sessionId = bookedTickets.First().SessionId;

            var sessionDate = await _dbContext.Sessions
                .Where(s => s.Id == sessionId)
                .Select(s => s.Date)
                .FirstOrDefaultAsync();

            if (sessionDate == null)
            {
                return BadRequest(new { error = "Session not found for the user's ticket." });
            }

            if (sessionDate.Day % 3 != 0)
            {
                return BadRequest(new { error = "User is not eligible for the ShowDateDiscount discount. The session date must be divisible by 3." });
            }

            var eligibleTicketIds = bookedTickets
                .Where(t => t.SessionId == sessionId)
                .Select(t => t.Id) 
                .ToList();

            if (!eligibleTicketIds.Any())
            {
                return BadRequest(new { error = "No eligible tickets found for this session." });
            }

            var discountResult = await discountService.ApplyDiscount(DiscountType.ShowDateDiscount, eligibleTicketIds);

            if (discountResult is OkObjectResult okResult)
            {
                var resultValue = okResult.Value as dynamic;

                return new OkObjectResult(new
                {
                    message = resultValue.message,
                    finalTicketAmount = resultValue.finalTicketAmount,
                    finalSnackAmount = resultValue.finalSnackAmount,
                    eligibleTicketIds = eligibleTicketIds 
                });
            }
            else if (discountResult is BadRequestObjectResult badRequest)
            {
                var errorResult = badRequest.Value as dynamic;
                return new BadRequestObjectResult(new { error = errorResult.error });
            }

            return new BadRequestObjectResult(new { error = "Error applying discount." });

        }

        [HttpGet("FourSale")]
        public async Task<IActionResult> FourSale()
        {
            var userName = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userName))
            {
                return Unauthorized(new { error = "UserName not found in claims." });
            }

            var user = await _userManager.FindByNameAsync(userName);

            if (user == null)
            {
                return NotFound(new { error = $"User not found in database. UserName: {userName}" });
            }

            var userTickets = await _dbContext.Tickets
                .Where(t => t.UserId == user.Id && t.Status == "Booked")
                .OrderByDescending(t => t.Book_buy_data)
                .ToListAsync();

            if (userTickets.Count < 4)
            {
                return BadRequest(new { error = "User does not have 4 or more booked tickets." });
            }

            var lastBookedTicket = userTickets.FirstOrDefault();
            if (lastBookedTicket != null)
            {
                lastBookedTicket.Price = 0;
            }

            decimal totalAmount = userTickets.Sum(t => t.Price);

            await _dbContext.SaveChangesAsync();

            return Ok(new
            {
                message = "The last selected ticket is free!",
                freeTicketId = lastBookedTicket?.Id,
                updatedTickets = userTickets.Select(t => new { t.Id, t.Price }),
                totalAmount
            });
        }

        [HttpGet("Reviews100Sale")]
        public async Task<IActionResult> Reviews100Sale([FromServices] IDiscountService discountService)
        {
            var userName = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userName))
            {
                return Unauthorized(new { error = "UserName not found in claims." });
            }

            var user = await _userManager.FindByNameAsync(userName);

            if (user == null)
            {
                return NotFound(new { error = $"User not found in database. UserName: {userName}" });
            }

            var userReviews = await _dbContext.Reviews
                .Where(r => r.UserId == user.Id)
                .ToListAsync();

            if (userReviews.Count >= 100)
            {
                var discountResult = await discountService.ApplyDiscount(DiscountType.Reviews100Plus, null);

                if (discountResult is OkObjectResult okResult)
                {
                    var resultValue = okResult.Value as dynamic;

                    return new OkObjectResult(new
                    {
                        message = resultValue.message,
                        finalTicketAmount = resultValue.finalTicketAmount,
                        finalSnackAmount = resultValue.finalSnackAmount
                    });
                }
                else if (discountResult is BadRequestObjectResult badRequest)
                {
                    var errorResult = badRequest.Value as dynamic;
                    return new BadRequestObjectResult(new { error = errorResult.error });
                }
            }
                return BadRequest(new { error = "User does not have 100 or more reviews.", });
            
        }

        [HttpGet("StudentSale")]
        public async Task<IActionResult> StudentSale([FromServices] IDiscountService discountService)
        {
            var userName = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userName))
            {
                return Unauthorized(new { error = "UserName not found in claims." });
            }

            var user = await _userManager.FindByNameAsync(userName);

            if (user == null)
            {
                return NotFound(new { error = $"User not found in database. UserName: {userName}" });
            }

            if (user.Age < 17 || user.Age > 21)
            {
                return BadRequest(new { error = "User is not eligible for the 'Student' discount. Age must be between 17 and 21." });
            }

            var discountResult = await discountService.ApplyDiscount(DiscountType.Student, null);

            if (discountResult is OkObjectResult okResult)
            {
                var resultValue = okResult.Value as dynamic;

                return new OkObjectResult(new
                {
                    message = resultValue.message,
                    finalTicketAmount = resultValue.finalTicketAmount,
                    finalSnackAmount = resultValue.finalSnackAmount
                });
            }
            else if (discountResult is BadRequestObjectResult badRequest)
            {
                var errorResult = badRequest.Value as dynamic;
                return new BadRequestObjectResult(new { error = errorResult.error });
            }

            return new BadRequestObjectResult(new { error = "Error applying discount." });
        }


    }
}
