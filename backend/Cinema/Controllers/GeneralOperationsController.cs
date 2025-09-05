using Cinema.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Cinema.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GeneralOperationsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GeneralOperationsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("get_all_locations")]
        public async Task<IActionResult> GetAllLocations()
        {
            var locations = await _context.Locations.ToListAsync();
            return Ok(locations);
        }
    }
}
