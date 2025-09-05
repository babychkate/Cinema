using Microsoft.AspNetCore.Mvc.ViewEngines;
using System.Text.Json.Serialization;

namespace Cinema.Models
{
    public class Film
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Release_year { get; set; }
        public string ImageUrl { get; set; }
        public string TrailerUrl { get; set; }
        public int Age_limit { get; set; }

        //M:N (F:G)
        [JsonIgnore]
        public List<Genre> Genres { get; set; } = new List<Genre>();

        //1:N (F:S)
        public List<Session> Sessions { get; set; } = new List<Session>();

        //1:N (F:R)
        public List<Review> Reviews { get; set; } = new List<Review>();

        //1:N (F:H)
        public List<History> Histories { get; set; } = new List<History>();
    }
}
