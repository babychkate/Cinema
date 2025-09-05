using Cinema.Contracts;
using Cinema.Data;
using Cinema.Enums;
using Cinema.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Cinema.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly DbContext _dbContext;
        private readonly AppDbContext __dbContext;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;

        public AdminController(UserManager<User> userManager,
                       RoleManager<IdentityRole> roleManager,
                       AppDbContext dbContext,
                       IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _dbContext = dbContext;
            _configuration = configuration;
            __dbContext = dbContext;
        }


        //USERS***********************************************************************************************
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetRegisteredUser()
        {
            var emailClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(emailClaim))
            {
                return BadRequest("User email not found in claims.");
            }

            var user = await _userManager.FindByEmailAsync(emailClaim);
            if (user == null)
            {
                return BadRequest("User not found");
            }

            var roles = await _userManager.GetRolesAsync(user);
            if (roles == null || !roles.Contains("Admin"))
            {
                return Forbid();
            }

            var listOfRegisteredUsers = await _dbContext.Set<User>()
                .FromSqlRaw("SELECT * FROM AspNetUsers")
                .ToListAsync();

            if (!listOfRegisteredUsers.Any())
            {
                return NotFound("No registered users found");
            }

            var onlyUsers = new List<User>();

            foreach (var userr in listOfRegisteredUsers)
            {
                var userRole = await _userManager.GetRolesAsync(userr);
                if (userRole != null && !userRole.Contains("Admin"))
                {
                    onlyUsers.Add(userr);
                }
            }

            if (!onlyUsers.Any())
            {
                return NotFound("No non-admin users found");
            }

            return Ok(onlyUsers);
        }

        [HttpDelete("DeleteUser/{userNameToDelete}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(string userNameToDelete)
        {
            var userToDelete = await _userManager.FindByNameAsync(userNameToDelete.ToString());
            if (userToDelete == null)
            {
                return NotFound("User to delete not found");
            }

            var result = await _userManager.DeleteAsync(userToDelete);
            if (!result.Succeeded)
            {
                return StatusCode(500, "Error occurred while deleting the user");
            }

            return Ok("User deleted successfully");
        }


        //FILMS************************************************************************************************************

        [HttpGet("ReadFilms")]
        public async Task<IActionResult> ReadFilms()
        {
            var films = await __dbContext.Films
                                 .Include(f => f.Genres)
                                 .Select(f => new
                                 {
                                     f.Id,
                                     f.ImageUrl,
                                     f.Name,
                                     f.Description,
                                     f.Release_year,
                                     f.Age_limit,
                                     Genres = f.Genres.Select(g => g.Name)
                                 })
                                 .ToListAsync();

            if (films == null || !films.Any())
            {
                return NotFound("No films found.");
            }

            return Ok(films);
        }

        [HttpPost("CreateFilm")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> CreateFilm([FromBody] FilmDto filmDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (!filmDto.IsValidYear())
            {
                return BadRequest("Wrong year");
            }

            if (!filmDto.ValidateGenres())
            {
                return BadRequest("One or more genres are invalid.");
            }

            // Перевірка, чи фільм з таким ім'ям та роком випуску вже існує
            var existingFilm = await __dbContext.Films
                .FirstOrDefaultAsync(f => f.Name == filmDto.Name && f.Release_year == filmDto.ReleaseYear);

            if (existingFilm != null)
            {
                return BadRequest("Film with the same name and release year already exists.");
            }

            var film = new Film
            {
                Name = filmDto.Name,
                Description = filmDto.Description,
                Release_year = filmDto.ReleaseYear,
                Age_limit = filmDto.AgeRatings,
                ImageUrl = filmDto.ImageUrl,
                TrailerUrl = filmDto.TrailerUrl
            };

            foreach (var genreDto in filmDto.Genres)
            {
                var existingGenre = await __dbContext.Genres
                    .FirstOrDefaultAsync(g => g.Name == genreDto.Name);

                if (existingGenre == null)
                {
                    // Якщо жанру ще немає в базі, створюємо його
                    var newGenre = new Genre
                    {
                        Id = Guid.NewGuid(),
                        Name = genreDto.Name
                    };

                    __dbContext.Genres.Add(newGenre);
                    film.Genres.Add(newGenre);
                }
                else
                {
                    film.Genres.Add(existingGenre);
                }
            }

            __dbContext.Films.Add(film);

            try
            {
                await __dbContext.SaveChangesAsync();
                return CreatedAtAction(nameof(CreateFilm), new { id = film.Id }, film);
            }
            catch (Exception ex)
            {
                var innerException = ex.InnerException?.Message ?? "No inner exception";
                return StatusCode(500, $"Internal server error: {ex.Message}. Inner Exception: {innerException}");
            }
        }

        [HttpPatch("UpdateFilm/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateFilm(Guid id, [FromBody] List<PatchRequestDto> patches)
        {
            if (patches == null || !patches.Any())
                return BadRequest("Patch request is empty");

            var film = await __dbContext.Films
                .Include(f => f.Genres)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (film == null)
                return NotFound("Film not found");

            foreach (var patch in patches)
            {
                switch (patch.Path.ToLower())
                {
                    case "/name":
                        if (patch.Value.Length >= 3 && patch.Value.Length <= 50)
                        {
                            film.Name = patch.Value;
                        }
                        else
                        {
                            return BadRequest("Name must be between 3 and 50 characters.");
                        }
                        break;

                    case "/description":
                        if (patch.Value.Length >= 3 && patch.Value.Length <= 1000)
                        {
                            film.Description = patch.Value;
                        }
                        else
                        {
                            return BadRequest("Description must be between 3 and 1000 characters.");
                        }
                        break;


                    case "/releaseyear":
                        if (int.TryParse(patch.Value, out int releaseYear) && releaseYear >= 1930 && releaseYear <= DateTime.Now.Year)
                        {
                            film.Release_year = releaseYear;
                        }
                        else
                        {
                            return BadRequest($"Release year must be between 1930 and {DateTime.Now.Year}.");
                        }
                        break;

                    case "/genres":
                        foreach (var patchh in patches)
                        {
                            var genreName = patchh.Value.Trim();

                            if (!Enum.IsDefined(typeof(GenreType), genreName))
                            {
                                return BadRequest($"Invalid genre '{genreName}'.");
                            }

                            var existingGenre = await __dbContext.Genres
                                .ToListAsync()
                                .ContinueWith(task => task.Result
                                    .FirstOrDefault(g => g.Name.Equals(genreName, StringComparison.OrdinalIgnoreCase)));

                            if (existingGenre == null)
                            {
                                var newGenre = new Genre
                                {
                                    Id = Guid.NewGuid(),
                                    Name = genreName
                                };

                                __dbContext.Genres.Add(newGenre);
                                film.Genres.Add(newGenre);
                            }
                            else
                            {
                                film.Genres.Add(existingGenre);
                            }
                        }
                        break;
                    default:
                        return BadRequest($"Invalid patch path: {patch.Path}");
                }
            }

            await __dbContext.SaveChangesAsync();

            return Ok("Film updated successfully");
        }

        [HttpDelete("DeleteFilm/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteFilm(Guid id)
        {
            var filmToDelete = await __dbContext.Films
                .Include(f => f.Genres)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (filmToDelete == null)
            {
                return NotFound("Film not found");
            }

            __dbContext.Films.Remove(filmToDelete);

            var result = await __dbContext.SaveChangesAsync();

            return Ok("Film deleted successfully");
        }




        //SESSIONS*********************************************************************************************
        [HttpGet("ReadSessions")]
        public async Task<IActionResult> ReadSessions()
        {
            var sessions = __dbContext.Sessions
                                .Include(s => s.Hall)
                                .Include(s => s.Film)
                                .Select(s => new
                                {
                                    s.Id,
                                    Hall = s.Hall.Number,
                                    HallId = s.Hall.Id,
                                    Film = s.Film.Name,
                                    FilmId = s.Film.Id,
                                    s.Start_time,
                                    s.End_time,
                                    s.Date
                                });

            if (sessions == null || !sessions.Any())
            {
                return NotFound("No sessions found");
            }

            return Ok(sessions);
        }

        [HttpPost("CreateSession")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> CreateSession([FromBody] SessionDto sessionDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var hall = __dbContext.Halls.FirstOrDefault(h => h.Id == sessionDto.HallId);
            if (hall == null)
            {
                return BadRequest("Hall not found.");
            }

            var film = __dbContext.Films.FirstOrDefault(f => f.Id == sessionDto.FilmId);
            if (hall == null)
            {
                return BadRequest("Film not found.");
            }

            var duration = sessionDto.EndTime - sessionDto.StartTime;

            var session = new Session
            {
                Hall = hall,
                Film = film,
                Start_time = sessionDto.StartTime,
                End_time = sessionDto.EndTime,
                Date = sessionDto.Date,
                Duration = duration
            };

            __dbContext.Sessions.Add(session);

            try
            {
                await __dbContext.SaveChangesAsync();
                var random = new Random();
                var tickets = new List<Ticket>();
                for (int i = 1; i <= 213; i++)
                {
                    tickets.Add(new Ticket
                    {
                        Id = Guid.NewGuid(),
                        Seat_number = i,
                        Status = "available",
                        Price = random.Next(100, 431),
                        Book_buy_data = DateTime.UtcNow,
                        SessionId = session.Id
                    });
                }

                __dbContext.Tickets.AddRange(tickets);
                await __dbContext.SaveChangesAsync();
                return CreatedAtAction(nameof(CreateFilm), new { id = session.Id }, session);
            }
            catch (Exception ex)
            {
                var innerException = ex.InnerException?.Message ?? "No inner exception";
                return StatusCode(500, $"Internal server error: {ex.Message}. Inner Exception: {innerException}");
            }
        }

        [HttpPatch("UpdateSession/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateSession(Guid id, [FromBody] List<PatchRequestDto> patches)
        {
            if (patches == null || !patches.Any())
            {
                return BadRequest("Patchers request is empty");
            }

            var session = await __dbContext.Sessions
                .Include(s => s.Hall)
                .Include(s => s.Film)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (session == null)
            {
                return NotFound("Session not found");
            }

            foreach (var patch in patches)
            {
                switch (patch.Path.ToLower())
                {
                    case "/hall":
                        if (!Guid.TryParse(patch.Value.ToString(), out Guid hallId))
                        {
                            return BadRequest("Invalid hall ID");
                        }

                        var hall = __dbContext.Halls.FirstOrDefault(h => h.Id == hallId);
                        if (hall == null)
                        {
                            return BadRequest("Hall not found");
                        }

                        if (session.Hall?.Id == hall.Id)
                        {
                            return BadRequest("The new hall is the same as the current one.");
                        }

                        session.Hall = hall;

                        break;
                    case "/film":
                        if (!Guid.TryParse(patch.Value.ToString(), out Guid filmId))
                        {
                            return BadRequest("Invalid film ID");
                        }

                        var film = __dbContext.Films.FirstOrDefault(f => f.Id == filmId);
                        if (film == null)
                        {
                            return BadRequest("Film not found.");
                        }
                        if (session.Film?.Id == film.Id)
                        {
                            return BadRequest("The new film is the same as the current one.");
                        }
                        session.Film = film;
                        break;
                    case "/starttime":
                        if (TimeOnly.TryParse(patch.Value.ToString(), out var startTime))
                        {
                            session.Start_time = startTime;
                            session.Duration = session.End_time - session.Start_time;
                        }
                        break;
                    case "/endtime":
                        if (TimeOnly.TryParse(patch.Value.ToString(), out var endTime))
                        {
                            session.End_time = endTime;
                            session.Duration = session.End_time - session.Start_time;
                        }
                        break;
                    case "/date":
                        if (DateOnly.TryParse(patch.Value.ToString(), out var date))
                        {
                            var today = DateOnly.FromDateTime(DateTime.Today);
                            var maxDate = new DateOnly(2050, 12, 31);

                            if (date < today)
                            {
                                return BadRequest("The date cannot be in the past.");
                            }
                            if (date > maxDate)
                            {
                                return BadRequest("The date cannot be later than 2050.");
                            }

                            // Перевірка на правильність місяця
                            if (date.Month < 1 || date.Month > 12)
                            {
                                return BadRequest("Invalid month. The month should be between 1 and 12.");
                            }

                            // Перевірка на правильність дня місяця
                            var daysInMonth = DateTime.DaysInMonth(date.Year, date.Month);
                            if (date.Day < 1 || date.Day > daysInMonth)
                            {
                                return BadRequest($"Invalid day for the given month. The month {date.Month} only has {daysInMonth} days.");
                            }

                            session.Date = date;
                        }
                        else
                        {
                            return BadRequest("Invalid date format.");
                        }
                        break;


                    default:
                        return BadRequest($"Invalid patch path: {patch.Path}");
                }
            }

            await __dbContext.SaveChangesAsync();
            return Ok("Session updated successfully");
        }

        [HttpDelete("DeleteSession/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteSession(Guid id)
        {
            var sessionToDelete = await __dbContext.Sessions
                .Include(s => s.Hall)
                .Include(s => s.Film)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (sessionToDelete == null)
            {
                return NotFound("Session not found");
            }

            __dbContext.Sessions.Remove(sessionToDelete);
            var result = await __dbContext.SaveChangesAsync();
            return Ok(result);
        }
    }
}
