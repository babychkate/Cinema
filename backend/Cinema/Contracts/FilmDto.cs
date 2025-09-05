using Cinema.Enums;
using Cinema.Models;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace Cinema.Contracts
{
    public class FilmDto
    {
        [Required(ErrorMessage = "Name is required")]
        [StringLength(54, ErrorMessage = "Name can't be longer than 54 characters")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Description is required")]
        [StringLength(1000, ErrorMessage = "Description can't be longer than 1000 characters")]
        public string Description { get; set; }

        [Range(1930, int.MaxValue, ErrorMessage = "Release Year must be between 1900 and the current year")]
        public int ReleaseYear { get; set; }

        [Required(ErrorMessage = "Genres are required")]
        public List<GenreDto> Genres { get; set; }

        [AgeRating]
        public int AgeRatings { get; set; }

        [Url(ErrorMessage = "Invalid Image URL format.")]
        public string ImageUrl { get; set; } 

        [Url(ErrorMessage = "Invalid Trailer URL format.")]
        public string TrailerUrl { get; set; }

        public bool IsValidYear()
        {
            return ReleaseYear >= 1930 && ReleaseYear <= DateTime.Now.Year;
        }

        public bool ValidateGenres()
        {
            var allowedGenres = Enum.GetNames(typeof(GenreType)).ToList();
            return Genres.All(g => allowedGenres.Any(genre => genre.Equals(g.Name, StringComparison.OrdinalIgnoreCase)));
        }

    }

    public class GenreDto
    {
        public string Name { get; set; }
    }

    public class AgeRating : ValidationAttribute
    {
        private readonly int[] _validValues = { 0, 3, 6, 12, 16, 18 };

        public override bool IsValid(object value)
        {
            if (value == null) return false;

            int ageRating = (int)value;
            return Array.Exists(_validValues, validValue => validValue == ageRating);
        }

        public override string FormatErrorMessage(string name)
        {
            return $"{name} must be one of the following values: 0, 3, 6, 12, 16 or 18.";
        }
    }
}
