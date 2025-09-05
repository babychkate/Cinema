using Cinema.Contracts;
using Cinema.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Cinema.Controllers
{
    public class EditProfileController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;

        public EditProfileController(UserManager<User> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        [HttpPatch("UpdateProfile")]
        public async Task<IActionResult> UpdateProfile([FromBody] List<PatchRequestDto> patches)
        {
            // Отримуємо токен з заголовка
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            if (string.IsNullOrEmpty(token))
            {
                return BadRequest("Token is required");
            }

            // Декодуємо токен
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(token) as JwtSecurityToken;
            if (jsonToken == null)
            {
                return BadRequest("Invalid token format");
            }

            // Отримуємо userName з токена
            var userName = jsonToken.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
            if (string.IsNullOrEmpty(userName))
            {
                return BadRequest("User name not found in token");
            }

            // Знаходимо користувача в базі за userName
            var user = await _userManager.FindByNameAsync(userName);
            if (user == null)
            {
                return NotFound("User not found");
            }

            // Оновлюємо дані користувача згідно з патч-запитом
            foreach (var patch in patches)
            {
                switch (patch.Path.ToLower())
                {
                    case "/name":
                        if (patch.Value.Contains("admin", StringComparison.OrdinalIgnoreCase)) // Change here
                        {
                            return BadRequest("Name cannot contain 'admin'");
                        }
                        user.UserName = patch.Value;
                        break;
                    case "/email":
                        if (patch.Value.Contains("admin", StringComparison.OrdinalIgnoreCase))
                        {
                            return BadRequest("Email cannot be 'admin'");
                        }

                        // Перевіряємо, чи email закінчується на @gmail.com або @lpnu.ua
                        if (!patch.Value.EndsWith("@gmail.com", StringComparison.OrdinalIgnoreCase) &&
                            !patch.Value.EndsWith("@lpnu.ua", StringComparison.OrdinalIgnoreCase))
                        {
                            return BadRequest("Email must end with '@gmail.com' or '@lpnu.ua'");
                        }
                        user.Email = patch.Value;
                        break;
                    case "/age":
                        if (int.TryParse(patch.Value, out int age))
                        {
                            if (age < 1 || age > 100)
                            {
                                return BadRequest("Age must be between 1 and 100");
                            }
                            user.Age = age;
                        }
                        else
                        {
                            return BadRequest("Invalid age format");
                        }
                        break;
                    default:
                        return BadRequest($"Invalid patch path: {patch.Path}");
                }
            }

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok("Profile updated successfully");
        }

        
    }
}
