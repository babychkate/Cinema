using Cinema.Contracts;
using Cinema.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;

namespace Cinema.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegisterController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public RegisterController(UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        [HttpPost]
        public async Task<IActionResult> Register(UserRegisterDto userDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string emailLower = userDto.Email.ToLower();
            if (!(emailLower.EndsWith("@gmail.com") || emailLower.EndsWith("@lpnu.ua")))
            {
                return BadRequest("Wrong structure of email. Need have ends as @gmail.com or @lpnu.ua");
            }

            if (userDto.Username.ToLower().Contains("admin") ||
                userDto.Email.ToLower().Contains("admin") ||
                userDto.Password.ToLower().Contains("admin"))
            {
                return BadRequest("Cannot use 'admin' in your username, email, or password.");
            }

            var usercheck = await _userManager.FindByNameAsync(userDto.Username);
            if (usercheck != null)
            {
                return BadRequest("User with that name already exists");
            }

            var emailcheck = await _userManager.FindByEmailAsync(userDto.Email);
            if (emailcheck != null)
            {
                return BadRequest("User with that email already exists");
            }

            if (userDto.Age < 1 || userDto.Age > 100)
            {
                return BadRequest("Age must be between 1 and 100.");
            }

            var user = new User
            {
                UserName = userDto.Username,
                Email = userDto.Email,
                Password = userDto.Password,
                Role = "User",
                Age = userDto.Age
            };

            // Реєстрація користувача
            var result = await _userManager.CreateAsync(user, userDto.Password);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            // Призначаємо роль користувачеві
            string role = "User";

            // Перевірка на наявність ролі і створення її, якщо немає
            var roleExists = await _roleManager.RoleExistsAsync(role);
            if (!roleExists)
            {
                await _roleManager.CreateAsync(new IdentityRole(role));
            }

            // Призначаємо роль
            await _userManager.AddToRoleAsync(user, role);

            return Ok(new { message = "User registered successfully with role " + role });
        }

    }
}
