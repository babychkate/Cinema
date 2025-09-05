using System.Text.Json.Serialization;

namespace Cinema.Models
{
    public class Genre
    {
        public Guid Id { get; set; }

        [JsonIgnore]
        public string Name { get; set; }

        //M:N (G:F)
        public List<Film> Films { get; set; } = new List<Film>();
    }
}
