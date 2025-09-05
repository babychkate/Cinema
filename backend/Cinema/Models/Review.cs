namespace Cinema.Models
{
    public class Review
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public int Mark { get; set; }

        //N:1 (R:U)
        //не Guid Id, бо IdentityUser має свій Id типу string
        public string UserId { get; set; }
        public User? User { get; set; }

        //N:1(R:F)
        public Guid FilmId { get; set; }
        public Film? Film { get; set; }
    }
}
