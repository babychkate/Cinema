namespace Cinema.Models
{
    public class Genre
    {
        public Guid Id { get; set; }
        public string Name { get; set; }

        //M:N (G:F)
        public List<Film> Films { get; set; } = new List<Film>();
    }
}
