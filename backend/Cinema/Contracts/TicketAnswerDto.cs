namespace Cinema.Contracts
{
    public class TicketAnswerDto
    {
        public Guid Id { get; set; }
        public int Seat_number { get; set; }
        public string Status { get; set; }
        public int Price { get; set; }
        public DateTime Book_buy_data { get; set; }
        public string FilmName { get; set; }
    }
}
