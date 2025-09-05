using Cinema.Contracts;
using Cinema.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Cinema.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;

        public LoginController(UserManager<User> userManager,
                                 RoleManager<IdentityRole> roleManager,
                                 IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
        }


        //Логін користувача
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDto userDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid input data");
            }

            var user = await _userManager.FindByEmailAsync(userDto.Email);
            if (user == null)
            {
                return BadRequest("Invalid email");
            }

            var result = await _userManager.CheckPasswordAsync(user, userDto.Password);
            if (!result)
            {
                return Unauthorized("Invalid password");
            }

            //GenerateJwtToken - власний метод
            var token = GenerateJwtToken(user);
            return Ok(new { Token = token });

        }

        /*GenerateJwtToken
        приймає: об'єкт User - користувач для якого треба згенерувати токен
        повертає: string - токен
        */
        private string GenerateJwtToken(User user)
        {
            var userRoles = _userManager.GetRolesAsync(user).Result;
            if (user.Email is null || user.UserName is null || userRoles is null)
            {
                return "Invalid user data";
            }

            //формуємо корисну інформацію для токена - ім'я + guid + email + ролі + вік
            var authClaims = new List<Claim>
            {
                    new Claim(JwtRegisteredClaimNames.Sub, user.UserName!),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
            };

            authClaims.AddRange(userRoles.Select(role => new Claim(ClaimTypes.Role, role)));

            //формуємо токен

            //перевіряємо, чи поля не порожні
            var key = _configuration["Jwt:Key"] ?? throw new Exception("JWT Key is missing!");
            var issuer = _configuration["Jwt:Issuer"] ?? throw new Exception("JWT Issuer is missing!");
            var expiryMinutes = _configuration["Jwt:ExpiryMinutes"] ?? "3600";
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                //хто випустив токен
                issuer: issuer,
                //дата завершення токена
                expires: DateTime.UtcNow.AddMinutes(double.Parse(expiryMinutes)),
                //корисна інформація
                claims: authClaims,
               //підпис для токена
               signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        //Отримання інформації про користувача з токена
        [HttpPost("profile")]
        public IActionResult GetUserInfo()
        {
            var authHeader = Request.Headers["Authorization"].ToString();
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                return BadRequest("Invalid token");
            }

            string token = authHeader.Substring("Bearer ".Length);

            // Створюємо об'єкт для декодування токена
            var tokenHandler = new JwtSecurityTokenHandler();
            var jsonToken = tokenHandler.ReadToken(token) as JwtSecurityToken;

            if (jsonToken == null)
            {
                return BadRequest("Invalid token");
            }

            // Перевірка підпису токена за допомогою ключа та issuer
            var key = _configuration["Jwt:Key"];
            var issuer = _configuration["Jwt:Issuer"];

            if (key is null || issuer is null)
            {
                return BadRequest("Invalid key or issuer");
            }

            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = issuer,
                ValidateAudience = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(key)),
                ValidateLifetime = true
            };

            var principal = tokenHandler.ValidateToken(token, validationParameters, out _);
            if (principal is null)
            {
                return BadRequest("Invalid token");
            }

            // Отримуємо дані з токена
            var claims = jsonToken?.Claims.ToList();
            var username = claims?.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub)?.Value;
            var email = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var roles = claims?.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value).ToList();

            if (username is null || email is null || roles is null)
            {
                return BadRequest("Invalid token data");
            }

            //отримуємо пароль та вік із юзера
            var user = _userManager.FindByEmailAsync(email).Result;
            if (user is null)
            {
                return BadRequest("User not found");
            }

            return Ok(new { username, email, roles, user.Password, user.Age });
        }

    }
}
