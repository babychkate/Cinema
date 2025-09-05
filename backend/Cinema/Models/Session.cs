using System.Net.Sockets;

namespace Cinema.Models
{
    public class Session
    {
        public Guid Id { get; set; }
        public TimeOnly Start_time { get; set; }
        public TimeOnly End_time { get; set; }
        public DateOnly Data { get; set; }
        public TimeSpan Duration { get; set; }

        //1:N
        public List<Ticket> Tickets { get; set; } = new List<Ticket>();

        //N:1 (S:H)
        public Guid HallId { get; set; }
        public Hall? Hall { get; set; }

        //N:1 (S:F)
        public Guid FilmId { get; set; }
        public Film? Film { get; set; }
    }
}
