using System.ComponentModel.DataAnnotations;

namespace Cinema.Contracts
{
    public class UserLoginDto
    {
        //email для залогінення
        [Required(ErrorMessage = "Email is required")]
        //вбудована перевірка на формат email
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; }

        //пароль для залогінення
        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }
    }
}
