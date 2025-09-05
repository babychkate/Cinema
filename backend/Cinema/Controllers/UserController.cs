using Cinema.Contracts;
using Cinema.Data;
using Cinema.Enums;
using Cinema.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Cinema.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext __dbContext;
        private readonly UserManager<User> _userManager;

        public UserController(AppDbContext dbContext, UserManager<User> userManager)
        {
            __dbContext = dbContext;
            _userManager = userManager;
        }

        [HttpGet("Filters")]
        public async Task<IActionResult> Filters([FromQuery] FilterDto filter)
        {
            var query = __dbContext.Films.AsQueryable();

            if (!string.IsNullOrEmpty(filter.Genre))
            {
                query = query.Where(m => m.Genres.Any(g => g.Name == filter.Genre));
            }

            if (filter.Year.HasValue)
            {
                query = query.Where(m => m.Release_year == filter.Year.Value);
            }

            if (filter.Duration.HasValue)
            {
                TimeSpan minDuration = filter.Duration.Value - TimeSpan.FromMinutes(20);
                TimeSpan maxDuration = filter.Duration.Value + TimeSpan.FromMinutes(20);

                query = query.Where(m => m.Sessions.Any(s => s.Duration >= minDuration && s.Duration <= maxDuration));
            }

            if (filter.Rating.HasValue)
            {
                query = query.Where(m => m.Age_limit >= filter.Rating.Value);
            }

            if (!string.IsNullOrEmpty(filter.SortOrder) && filter.SortOrder.ToLower() == "desc")
            {
                query = query.OrderByDescending(m => m.Release_year);
            }
            else if (!string.IsNullOrEmpty(filter.SortOrder) && filter.SortOrder.ToLower() == "asc")
            {
                query = query.OrderBy(m => m.Release_year);
            }

            var films = await query
                .Select(m => new
                {
                    m.Id,
                    m.Name,
                    m.Description,
                    m.Release_year,
                    m.ImageUrl,
                    m.TrailerUrl,
                    m.Age_limit,
                    Genres = m.Genres.Select(g => new { g.Id, g.Name }).ToList()
                })
                .ToListAsync();

            return Ok(films);
        }


        [HttpGet("Search")]
        public async Task<IActionResult> SearchForFilmName(string? searchRequest)
        {
            var search = __dbContext.Films
                .Where(f => !string.IsNullOrEmpty(searchRequest) &&
                f.Name.ToLower().Contains(searchRequest.ToLower()));

            var films = await search.ToListAsync();
            return Ok(films);
        }

        [HttpGet("View")]
        public async Task<IActionResult> ViewFilms()
        {
            var filmInfo = await __dbContext.Films
                .Include(f => f.Reviews)
                .Select(f => new
                {
                    f.Name,
                    f.ImageUrl,
                    f.Description,
                    Review = f.Reviews.Select(r => new
                    {
                        r.Mark,
                        r.Content
                    }).ToList(),
                    f.TrailerUrl
                }).ToListAsync();

            return Ok(filmInfo);
        }

    }
}