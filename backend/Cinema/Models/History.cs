namespace Cinema.Models
{
    public class History
    {
        public Guid Id { get; set; }
        public string UserId { get; set; }
        public User? User { get; set; }

        public Guid? TicketId { get; set; }  // Nullable, бо може бути запис про перегляд без покупки
        public Ticket? Ticket { get; set; }

        public int Seat_number { get; set; }
        public int Price { get; set; }

        public Guid? FilmId { get; set; }  // Nullable, бо може бути запис про покупку без перегляду
        public Film? Film { get; set; }
        public string? Url_of_page { get; set; }
        public string? FilmName { get; set; }

        public DateTime ActionDate { get; set; }
        public ActionType Type { get; set; }
    }
    public enum ActionType
    {
        Bought, // Покупка квитка
        Booked, // Бронювання квитка
        Watched,   // Перегляд фільму
        Canceled   // Скасування квитка
    }
}