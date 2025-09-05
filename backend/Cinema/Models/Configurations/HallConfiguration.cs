using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace Cinema.Models.Configurations
{
    public class HallConfiguration : IEntityTypeConfiguration<Hall>
    {
        public void Configure(EntityTypeBuilder<Hall> builder)
        {
            builder.HasKey(x => x.Id);

            //N:1
            builder.HasMany(h => h.Sessions)
            .WithOne(s => s.Hall)
            .HasForeignKey(k => k.HallId);

            //1:N
            builder.HasOne(h => h.Location)
            .WithMany(l => l.Halls)
            .HasForeignKey(k => k.LocationId);
        }
    }
}
