namespace Cinema.Contracts
{
    public class SessionDto
    {
        public Guid HallId { get; set; }
        public Guid FilmId { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public DateOnly Date { get; set; }
    }
}
