namespace Cinema.Contracts
{
    public class FilterDto
    {
        public string? Genre { get; set; }
        public int? Rating { get; set; }
        public int? Year { get; set; }
        public string? SortOrder { get; set; }
        public TimeSpan? Duration { get; set; }
    }
}
