using Cinema.Models;

namespace Cinema.Contracts
{
    public class ReviewAdminAnswerDto
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public int Mark { get; set; }
        public User? User { get; set; }
        public Film? Film { get; set; }
    }
}
