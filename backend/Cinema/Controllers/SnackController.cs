using Azure.Core;
using Cinema.Contracts;
using Cinema.Data;
using Cinema.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace Cinema.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SnackController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;

        public SnackController(AppDbContext context,
                               UserManager<User> userManager,
                               IConfiguration configuration)
        {
            _context = context;
            _userManager = userManager;
            _configuration = configuration;
        }

        // CREATE (Додати новий снек)
        [Authorize(Roles = "Admin")]
        [HttpPost("create_snack")]
        public async Task<IActionResult> CreateSnack([FromBody] SnackDto snackDto)
        {
            if (snackDto == null) return BadRequest("Snack data is not provided");

            if (_context.Snacks.Any(s => s.Name == snackDto.Name))
                return BadRequest("Snack with this name already exists");

            var snack = new Snack { Name = snackDto.Name, Price = snackDto.Price };

            await _context.Snacks.AddAsync(snack);
            await _context.SaveChangesAsync();

            return Ok(new SnackDto { Name = snack.Name, Price = snack.Price });
        }

        // READ (Отримати всі снеки)
        [Authorize(Roles = "Admin")]
        [HttpGet("get_all_snacks")]
        public async Task<IActionResult> GetAllSnacks()
        {
            var snacks = await _context.Snacks.ToListAsync();
            if (!snacks.Any()) return BadRequest("No snacks found");

            var snackDtos = snacks.Select(s => new SnackAnswerDto
            {
                Id = s.Id,
                Name = s.Name,
                Price = s.Price
            }).ToList();

            return Ok(snackDtos);
        }

        // READ (Отримати всі снеки користувача)
        [Authorize]
        [HttpGet("get_user_snacks")]
        public async Task<IActionResult> GetUserSnacks()
        {
            var username = GetUsernameFromToken();
            if (username == null) return BadRequest("Invalid token");

            var user = await _userManager.Users
                .Include(u => u.Snacks)
                .FirstOrDefaultAsync(u => u.UserName == username);

            if (user == null) return BadRequest("User not found");
            if (user.Snacks == null || !user.Snacks.Any()) return BadRequest("Snacks for this user not found");

            var snacks = user.Snacks.Select(s => new SnackAnswerDto
            {
                Id = s.Id,
                Name = s.Name,
                Price = s.Price
            }).ToList();

            return Ok(snacks);
        }

        // UPDATE (Змінити снек)
        [Authorize(Roles = "Admin")]
        [HttpPatch("update_snack/{id}")]
        public async Task<IActionResult> UpdateSnack(Guid id, [FromBody] JsonPatchDocument<Snack> patchDoc)
        {
            if (patchDoc == null) return BadRequest("Patch document is not provided");

            var snack = await _context.Snacks.FindAsync(id);
            if (snack == null) return NotFound("Snack not found");

            string updatedName = snack.Name;
            if (patchDoc.Operations.Any(op => op.path == "/Name" && op.op == "replace"))
            {
                var operation = patchDoc.Operations.First(op => op.path == "/Name" && op.op == "replace");
                updatedName = (string)operation.value;
            }

            var existingSnack = await _context.Snacks.FirstOrDefaultAsync(h => h.Name == updatedName);
            if (existingSnack != null && existingSnack.Id != snack.Id)
                return BadRequest("Such snack already exists in list");

            patchDoc.ApplyTo(snack, ModelState);
            if (!ModelState.IsValid) return BadRequest(ModelState);

            await _context.SaveChangesAsync();
            return Ok(new SnackDto { Name = snack.Name, Price = snack.Price });
        }

        // DELETE (Видалити снек)
        [Authorize(Roles = "Admin")]
        [HttpDelete("delete_snack/{id}")]
        public async Task<IActionResult> DeleteSnack(Guid id)
        {
            var snack = await _context.Snacks
                .Include(s => s.Users)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (snack == null) return NotFound("Snack not found");

            snack.Users.Clear();
            _context.Snacks.Remove(snack);
            await _context.SaveChangesAsync();

            return Ok("Snack deleted");
        }

        // Купити снеки
        [Authorize]
        [HttpPost("buy_snacks")]
        public async Task<IActionResult> BuySnacks([FromBody] List<Guid> snackIds)
        {
            var username = GetUsernameFromToken();
            if (username == null) return BadRequest("Invalid token");

            var user = await _userManager.Users
                .Include(u => u.Snacks)
                .FirstOrDefaultAsync(u => u.UserName == username);

            if (user == null) return BadRequest("User not found");

            var snacks = await _context.Snacks.Where(s => snackIds.Contains(s.Id)).ToListAsync();
            if (snacks.Count != snackIds.Count) return NotFound("Some snacks were not found");

            foreach (var snack in snacks)
            {
                if (!user.Snacks.Contains(snack)) user.Snacks.Add(snack);
                else return BadRequest($"Snack {snack.Id} is already bought by you");
            }

            await _context.SaveChangesAsync();
            return Ok("You have successfully bought the snacks");
        }

        // Скасувати покупку снеків
        [Authorize]
        [HttpDelete("cancel_snacks")]
        public async Task<IActionResult> CancelSnacks([FromBody] List<Guid> snackIds)
        {
            var username = GetUsernameFromToken();
            if (username == null) return BadRequest("Invalid token");

            var user = await _userManager.Users
                .Include(u => u.Snacks)
                .FirstOrDefaultAsync(u => u.UserName == username);

            if (user == null) return BadRequest("User not found");

            var snacksToRemove = user.Snacks.Where(s => snackIds.Contains(s.Id)).ToList();
            if (snacksToRemove.Count != snackIds.Count) return NotFound("Some snacks were not found in your purchases");

            foreach (var snack in snacksToRemove) user.Snacks.Remove(snack);

            await _context.SaveChangesAsync();
            return Ok("You have successfully canceled the purchases");
        }

        // ================= HELPER METHODS =================
        private string? GetUsernameFromToken()
        {
            var authHeader = Request.Headers["Authorization"].ToString();
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer ")) return null;

            string token = authHeader.Substring("Bearer ".Length);
            var tokenHandler = new JwtSecurityTokenHandler();
            var jsonToken = tokenHandler.ReadToken(token) as JwtSecurityToken;
            if (jsonToken == null) return null;

            var key = _configuration["Jwt:Key"];
            var issuer = _configuration["Jwt:Issuer"];
            if (key == null || issuer == null) return null;

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
            if (principal == null) return null;

            return jsonToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub)?.Value;
        }
    }
}
