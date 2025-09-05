using System.ComponentModel.DataAnnotations;

namespace Cinema.Contracts
{
    public class UserRegisterDto
    {
        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        [Required(ErrorMessage = "Age is required")]
        [Range(0, 100, ErrorMessage = "Age must be between 0 and 100")]
        public int Age { get; set; }
    }
}
