using Cinema.Data;
using Cinema.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Cinema.Test
{
    public class ApplaySale : IDiscountService
    {
        private readonly AppDbContext _dbContext;
        private readonly UserManager<User> _userManager;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ApplaySale(UserManager<User> userManager, AppDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        {
            _userManager = userManager;
            _dbContext = dbContext;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<IActionResult> ApplyDiscount<T>(T discountType, List<Guid>? eligibleTicketIds) where T : Enum
        {
            string discountName = Enum.GetName(typeof(T), discountType);

            var sales = await _dbContext.Sales
                .AsNoTracking()
                .Where(s => s.Discount_type == discountName && s.Is_Active)
                .ToListAsync();

            if (!sales.Any())
            {
                return new BadRequestObjectResult(new { error = $"No active {discountName} sale found." });
            }

            decimal ticketDiscountAmount = 0;
            decimal snackDiscountAmount = 0;
            bool hasTicketDiscount = false;
            bool hasSnackDiscount = false;

            foreach (var sale in sales)
            {
                if (sale.For_what == Cinema.Enums.ForWhatType.Both.ToString())
                {
                    ticketDiscountAmount = (int)Math.Round(sale.Discount / 100m);
                    snackDiscountAmount = (int)Math.Round(sale.Discount / 100m);
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

            var verifyResult = await VerifyUserTicket(new VerifiedUserResult
            {
                BookedTickets = new List<Ticket>()
            });

            if (verifyResult is OkObjectResult okResult)
            {
                var resultValue = okResult.Value as dynamic;

                if (resultValue?.verifiedUserResult is VerifiedUserResult verifiedUserResult)
                {
                    List<Ticket> bookedTickets = verifiedUserResult.BookedTickets;

                    if (eligibleTicketIds is not null)
                    {
                        bookedTickets = bookedTickets.Where(t => eligibleTicketIds.Contains(t.Id)).ToList();

                        if (!bookedTickets.Any())
                        {
                            return new BadRequestObjectResult(new { error = "No applicable tickets for discount." });
                        }
                    }

                    int totalTicketAmount = bookedTickets.Sum(ticket => ticket.Price);
                    int totalSnackAmount = 0;
                    var userIdFromResult = verifiedUserResult.UserId;

                    var userSnacks = _dbContext.Snacks
                                         .Where(s => s.Users.Any(u => u.Id == userIdFromResult)) 
                                         .ToList();
                    totalSnackAmount = userSnacks.Sum(snack => snack.Price);
                        
                    

                    int finalTicketAmount = hasTicketDiscount
                        ? (int)(totalTicketAmount * (1 - ticketDiscountAmount))
                        : (int)totalTicketAmount;


                    int finalSnackAmount = hasSnackDiscount
                        ? (int)(totalSnackAmount * (1 - snackDiscountAmount))
                        : (int)totalSnackAmount;

                    if (hasTicketDiscount)
                    {
                        message += "tickets,";
                    }
                    if (hasSnackDiscount)
                    {
                        message += " snacks ";
                    }

                    return new OkObjectResult(new
                    {
                        message = message.Trim(),
                        finalTicketAmount,
                        finalSnackAmount
                    });
                }
            }

            return new BadRequestObjectResult(new { error = "Error verifying user tickets." });
        }

        public async Task<IActionResult> VerifyUserTicket(VerifiedUserResult verifiedUserResult)
        {
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext == null)
            {
                return await Task.FromResult(new UnauthorizedObjectResult(new { error = "No HttpContext available" }));
            }

            var userClaims = httpContext.User;
            if (userClaims == null || !userClaims.Identity.IsAuthenticated)
            {
                return await Task.FromResult(new UnauthorizedObjectResult(new { error = "User is not authenticated" }));
            }

            var userIdFromClaim = userClaims.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
                                  userClaims.FindFirst("sub")?.Value;

            var user = await _userManager.FindByNameAsync(userIdFromClaim);
            if (user == null)
            {
                return await Task.FromResult(new NotFoundObjectResult(new { error = $"User not found with ID: {userIdFromClaim}" }));
            }

            verifiedUserResult.UserId = user.Id;

            var userBookedTickets = await _dbContext.Tickets
                                      .Where(t => t.UserId == user.Id && t.Status == "Booked")
                                      .ToListAsync();

            if (!userBookedTickets.Any())
            {
                return new BadRequestObjectResult(new { error = "No booked tickets found for the user." });
            }

            verifiedUserResult.BookedTickets = userBookedTickets;

            return new OkObjectResult(new { message = "User verified successfully.", verifiedUserResult });
        }

    }
}

