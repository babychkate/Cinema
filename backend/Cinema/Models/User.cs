using Microsoft.AspNetCore.Identity;

namespace Cinema.Models
{
    public class User : IdentityUser
    {
        public string Password { get; set; }
        public string Role { get; set; }
        public int Age { get; set; }

        //1:N(U:T)
        public List<Ticket> Tickets { get; set; } = new List<Ticket>();

        //1:N(U:R)
        public List<Review> Reviews { get; set; } = new List<Review>();

        //N:M(U:S)
        public List<Snack> Snacks { get; set; } = new List<Snack>();

        //1:N (U:H)
        public List<History> Histories { get; set; } = new List<History>();
    }
}
