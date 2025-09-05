using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace Cinema.Models.Configurations
{
    public class FilmConfiguration : IEntityTypeConfiguration<Film>
    {
        public void Configure(EntityTypeBuilder<Film> builder)
        {
            builder.HasKey(x => x.Id);

            //M:N
            builder.HasMany(f => f.Genres)
                    .WithMany(g => g.Films);

            //1:N
            builder.HasMany(f => f.Histories)
               .WithOne(h => h.Film)
               .HasForeignKey(k => k.FilmId)
               .OnDelete(DeleteBehavior.SetNull); 


        }
    }
}
