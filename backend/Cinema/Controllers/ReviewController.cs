using Cinema.Contracts;
using Cinema.Data;
using Cinema.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace Cinema.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;

        public ReviewController(AppDbContext context,
                                UserManager<User> userManager,
                                IConfiguration configuration)
        {
            _context = context;
            _userManager = userManager;
            _configuration = configuration;
        }

        //CREATE (Додати новий відгук)
        [Authorize]
        [HttpPost("create_review")]
        public async Task<IActionResult> CreateReview(Guid Filmid, [FromBody] ReviewDto reviewDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //Робота із токеном
            var username = GetUsernameFromToken();
            if (username is null)
            {
                return NotFound("Username not found");
            }

            //шукаємо користувача
            var user = await _userManager.FindByNameAsync(username);

            if (user is null)
            {
                return NotFound("User not found");
            }

            //шукаємо фільм
            var film = await _context.Films
                        .FirstOrDefaultAsync(f => f.Id == Filmid);
            if (film == null)
            {
                return BadRequest("There is no such film");
            }

            var mark = reviewDto.Mark;

            if (mark < 1 || mark > 10)
            {
                return BadRequest("Mark must be between 1 and 10");
            }

            Review review = new Review
            {
                Content = reviewDto.Content,
                Mark = reviewDto.Mark,
                UserId = user.Id,
                FilmId = Filmid
            };

            await _context.Reviews.AddAsync(review);
            user.Reviews.Add(review);
            await _context.SaveChangesAsync();

            ReviewDto reviewAnswerDto = new ReviewDto
            {
                Content = reviewDto.Content,
                Mark = reviewDto.Mark
            };

            return Ok(reviewAnswerDto);
        }

        //READ (Отримати всі відгуки)
        [Authorize(Roles = "Admin")]
        [HttpGet("get_all_reviews")]
        public async Task<IActionResult> GetAllReviews()
        {
            //Робота із токеном
            var username = GetUsernameFromToken();
            if (username is null)
            {
                return NotFound("Username not found");
            }

            List<ReviewAdminAnswerDto> reviews = await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Film)
                .Select(r => new ReviewAdminAnswerDto
                {
                    Id = r.Id,
                    Content = r.Content,
                    Mark = r.Mark,
                    User = r.User,
                    Film = r.Film
                })
                .ToListAsync();

            return Ok(reviews);
        }

        //READ (Отримати відгуки конктретного користувача)
        [Authorize]
        [HttpGet("get_user_reviews")]
        public async Task<IActionResult> GetUserReviews()
        {
            //Робота із токеном
            var username = GetUsernameFromToken();
            if (username is null)
            {
                return NotFound("Username not found");
            }

            var user = await _userManager.FindByNameAsync(username);
            if (user is null)
            {
                return NotFound("User not found");
            }
            var userReviews = _context.Reviews.Where(r => r.UserId == user.Id);

            if (!userReviews.Any())
            {
                return NotFound("You have no reviews");
            }

            List<ReviewUserAnswerDto> reviews = await _context.Reviews
            .Where(r => r.UserId == user.Id) // Фільтруємо за конкретним користувачем
            .Include(r => r.Film)
            .Select(r => new ReviewUserAnswerDto
            {
                Content = r.Content,
                Mark = r.Mark,
                FilmName = r.Film!.Name
            })
            .ToListAsync();

            return Ok(reviews);
        }

        //DELETE (Видалити відгук)
        [Authorize]
        [HttpDelete("delete_review/{id}")]
        public async Task<IActionResult> DeleteReview(Guid id)
        {
            //Робота із токеном
            var username = GetUsernameFromToken();
            if (username is null)
            {
                return NotFound("Username not found");
            }

            var user = await _userManager.FindByNameAsync(username);
            if (user is null)
            {
                return NotFound("User not found");
            }

            var reviewToDelete = await _context.Reviews.FindAsync(id);
            if (reviewToDelete is null)
            {
                return NotFound("Review not found");
            }

            if (!user.Reviews.Contains(reviewToDelete))
            {
                return BadRequest("You can not delete this review as it is written by another user");
            }

            user.Reviews.Remove(reviewToDelete);
            _context.Reviews.Remove(reviewToDelete);
            _context.SaveChanges();
            return Ok("Review deleted successfully");
        }

        //DELETE (Видалити відгук користувача адміном)
        [Authorize(Roles = "Admin")]
        [HttpDelete("delete_review_by_admin/{id}")]
        public async Task<IActionResult> DeleteReviewByAdmin(Guid id)
        {
            //Робота із токеном
            var username = GetUsernameFromToken();
            if (username is null)
            {
                return NotFound("Username not found");
            }

            var reviewToDelete = await _context.Reviews.FindAsync(id);
            if (reviewToDelete is null)
            {
                return NotFound("Review not found");
            }

            _context.Reviews.Remove(reviewToDelete);
            _context.SaveChanges();
            return Ok("Review deleted successfully");
        }

        [Authorize]
        [HttpGet("get_reviews_by_film_id/{id}")]
        public async Task<IActionResult> GetFilmReviews(Guid id)
        {
            var film = await _context.Films.FindAsync(id);

            if (film is null)
            {
                return NotFound("Film not found");
            }

            var allReviews = await _context.Reviews
            .Where(r=> r.FilmId == film.Id)
            .Include(r => r.User) // Додаємо User
            .Select(r => new AllReviewsAnswerDto
            {
                Id = r.Id,
                UserName = r.User.UserName ?? "Unknown",
                Content = r.Content,
                Mark = r.Mark
            })
        .ToListAsync(); // Виконуємо запит асинхронно



            return Ok(allReviews);
        }



        //Допоміжні методи
        //Метод для отримання імені користувача з токена
        private string? GetUsernameFromToken()
        {
            var authHeader = Request.Headers["Authorization"].ToString();
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                return null;
            }

            string token = authHeader.Substring("Bearer ".Length);

            var tokenHandler = new JwtSecurityTokenHandler();
            var jsonToken = tokenHandler.ReadToken(token) as JwtSecurityToken;

            if (jsonToken == null)
            {
                return null;
            }

            var key = _configuration["Jwt:Key"];
            var issuer = _configuration["Jwt:Issuer"];

            if (key is null || issuer is null)
            {
                return null;
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
                return null;
            }

            var claims = jsonToken?.Claims.ToList();
            var username = claims?.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub)?.Value;

            return username;
        }
    }
}
