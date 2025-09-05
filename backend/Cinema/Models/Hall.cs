namespace Cinema.Models
{
    public class Hall
    {
        public Guid Id { get; set; }
        public int Number { get; set; }
        public int Count_of_seats { get; set; }
        public bool Is_available { get; set; }

        //N:1 (H:L)
        public Guid LocationId { get; set; }
        public Location? Location { get; set; }

        //N:1(H:S)
        public List<Session> Sessions { get; set; } = new List<Session>();
    }
}
