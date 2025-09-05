namespace Cinema.Models
{
    public class Location
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string City { get; set; }

        //1:N (L:H)
        public List<Hall> Halls { get; set; } = new List<Hall>();
    }
}
