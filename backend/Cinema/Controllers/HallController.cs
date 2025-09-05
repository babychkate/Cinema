using Cinema.Contracts;
using Cinema.Data;
using Cinema.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Cinema.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class HallController : ControllerBase
    {
        private readonly AppDbContext _context;

        public HallController(AppDbContext context)
        {
            _context = context;
        }

        //CREATE (Додати новий зал)
        [Authorize(Roles="Admin")]
        [HttpPost("create_hall")]
        public async Task<IActionResult> CreateHall([FromBody] HallDto hallDto)
        {
            if (hallDto == null)
            {
                return BadRequest("Hall data is not provided");
            }

            bool hallExists = await _context.Halls
                              .AnyAsync(h => h.Number == hallDto.Number && h.LocationId == hallDto.LocationId);

            if (hallExists)
            {
                return BadRequest("A hall with this number already exists in the specified location");
            }

            Hall hall = new Hall
            {
                Number = hallDto.Number,
                Count_of_seats = hallDto.Count_of_seats,
                //за замовчуванням зал доступний
                Is_available = true,
                LocationId = hallDto.LocationId
            };

            await _context.Halls.AddAsync(hall);
            await _context.SaveChangesAsync();

            HallAnswerDto hallAnswerDto = new HallAnswerDto
            {
                Id = hall.Id,
                Number = hall.Number,
                Count_of_seats = hall.Count_of_seats,
                Is_available = hall.Is_available,
                LocationId = hall.LocationId
            };

            return Ok(hallAnswerDto);
        }

        //READ (Отримати всі зали)
        [Authorize]
        [HttpGet("get_halls")]
        public async Task<IActionResult> GetHalls()
        {
            List<Hall> halls = await _context.Halls.ToListAsync();
            List<HallAnswerDto> hallAnswerDtos = new List<HallAnswerDto>();

            foreach (Hall hall in halls)
            {
                HallAnswerDto hallAnswerDto = new HallAnswerDto
                {
                    Id = hall.Id,
                    Number = hall.Number,
                    Count_of_seats = hall.Count_of_seats,
                    Is_available = hall.Is_available,
                    LocationId = hall.LocationId
                };

                hallAnswerDtos.Add(hallAnswerDto);
            }

            return Ok(hallAnswerDtos);
        }

        //READ (Отримати один зал за ID)
        [Authorize]
        [HttpGet("get_one_hall/{id}")]
        public async Task<ActionResult<Hall>> GetHallById(Guid id)
        {
            var hall = await _context.Halls.FindAsync(id);
            if (hall == null)
                return NotFound();

            return hall;
        }

        //UPDATE (Оновити інформацію про зал)
        [Authorize(Roles = "Admin")]
        [HttpPatch("update_hall_info/{id}")]
        public async Task<IActionResult> UpdateHall(Guid id, [FromBody] JsonPatchDocument<Hall> patchDoc)
        {
            if (patchDoc == null)
            {
                return BadRequest("Patch document is not provided");
            }

            var hall = await _context.Halls.FindAsync(id);
            if (hall == null)
            {
                return NotFound("Hall not found");
            }

            // Отримуємо номер залу, який буде після змін
            long updatedNumber = hall.Number;

            // Перевіряємо, чи існує інший зал з таким же номером в тій самій локації
            if (patchDoc.Operations.Any(op => op.path == "/Number" && op.op == "replace"))
            {
                var operation = patchDoc.Operations.First(op => op.path == "/Number" && op.op == "replace");
                updatedNumber = (Int64)operation.value;
            }

            // Перевірка на наявність залу з таким же номером в тій самій локації
            var existingHall = await _context.Halls
                .Where(h => h.LocationId == hall.LocationId && h.Number == updatedNumber)
                .FirstOrDefaultAsync();

            if (existingHall != null && existingHall.Id != hall.Id)
            {
                return BadRequest("A hall with the same number already exists in this location.");
            }

            patchDoc.ApplyTo(hall);
            await _context.SaveChangesAsync();

            HallAnswerDto hallAnswerDto = new HallAnswerDto
            {
                Id = hall.Id,
                Number = hall.Number,
                Count_of_seats = hall.Count_of_seats,
                Is_available = hall.Is_available,
                LocationId = hall.LocationId
            };

            return Ok(hallAnswerDto);
        }


        //DELETE (Видалити зал)
        [Authorize(Roles = "Admin")]
        [HttpDelete("delete_hall/{id}")]
        public async Task<IActionResult> DeleteHall(Guid id)
        {
            var hall = await _context.Halls.FindAsync(id);
            if (hall == null)
            {
                return NotFound("The hall not found");
            }

            _context.Halls.Remove(hall);
            await _context.SaveChangesAsync();
            return Ok("The hall was deleted");
        }

        //Open hall
        [HttpPost("open_hall/{id}")]
        public async Task<IActionResult> OpenHall(Guid id)
        {
            var hall = await _context.Halls.FindAsync(id);
            if (hall == null)
            {
                return NotFound("The hall not found");
            }

            if(hall.Is_available)
            {
                return BadRequest("The hall is already open");
            }

            hall.Is_available = true;
            await _context.SaveChangesAsync();
            return Ok("The hall is open");
        }

        //Close hall
        [HttpPost("close_hall/{id}")]
        public async Task<IActionResult> CloseHall(Guid id)
        {
            var hall = await _context.Halls.FindAsync(id);
            if(hall == null)
            {
                return NotFound("The hall not found");
            }

            if(hall.Is_available == false)
            {
                return BadRequest("The hall is already closed");
            }

            hall.Is_available = false;
            await _context.SaveChangesAsync();
            return Ok("The hall is closed");
        }
    }
}
