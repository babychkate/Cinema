using System.ComponentModel.DataAnnotations.Schema;

namespace Cinema.Models
{
    public class Snack
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int Price { get; set; }

        //N:M(S:U)
        public List<User> Users { get; set; } = new List<User>();
    }
}
