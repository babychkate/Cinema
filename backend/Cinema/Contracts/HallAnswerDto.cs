namespace Cinema.Contracts
{
    public class HallAnswerDto
    {
        public Guid Id { get; set; }
        public int Number { get; set; }
        public int Count_of_seats { get; set; }
        public bool Is_available { get; set; }
        //N:1 (H:L)
        public Guid LocationId { get; set; }
    }
}
