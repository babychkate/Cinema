using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace Cinema.Models.Configurations
{
    public class ReviewConfiguration : IEntityTypeConfiguration<Review>
    {
        public void Configure(EntityTypeBuilder<Review> builder)
        {
            builder.HasKey(x => x.Id);

            //1:N
            builder.HasOne(r => r.User)
                    .WithMany(u => u.Reviews)
                    .HasForeignKey(k => k.UserId);

            //1:N
            builder.HasOne(r => r.Film)
                    .WithMany(f => f.Reviews)
                    .HasForeignKey(k => k.FilmId);
        }
    }
}
