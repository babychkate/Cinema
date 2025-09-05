using Cinema.Models;

namespace Cinema.Test
{
    public class VerifiedUserResult
{
    public List<Ticket> BookedTickets { get; set; } = new List<Ticket>();  
    public string? UserId { get; set; }
}

}
