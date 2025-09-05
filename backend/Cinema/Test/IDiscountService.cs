using Cinema.Models;
using Microsoft.AspNetCore.Mvc;

namespace Cinema.Test
{
    public interface IDiscountService
    {
        Task<IActionResult> ApplyDiscount<T>(T discountType, List<Guid>? eligibleTicketIds) where T : Enum;
        Task<IActionResult> VerifyUserTicket(VerifiedUserResult verifiedUserResult);
    }

}
