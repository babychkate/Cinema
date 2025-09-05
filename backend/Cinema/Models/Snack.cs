namespace Cinema.Models
{
    public class Snack
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int Price { get; set; }

        //N:1(S:U)
        public string UserId { get; set; }
        public User? User { get; set; }
    }
}
