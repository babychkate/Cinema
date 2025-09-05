namespace Cinema.Contracts
{
    public class HallDto
    {
        public int Number { get; set; }
        public int Count_of_seats { get; set; }
        //N:1 (H:L)
        public Guid LocationId { get; set; }

    }
}
