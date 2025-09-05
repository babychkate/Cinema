using Cinema.Enums;

namespace Cinema.Models
{
    public class Sale
    {
        public Guid Id { get; set; }
        public decimal Discount { get; set; }
        public bool Is_Active { get; set; }
        public string Description { get; set; }
        public string For_what { get; set; }
        public string Discount_type { get; set; }

        //1:N
        public List<Snack> Snacks { get; set; } = new List<Snack>();
        public List<Ticket> Tickets { get; set; } = new List<Ticket>();
    }
}
