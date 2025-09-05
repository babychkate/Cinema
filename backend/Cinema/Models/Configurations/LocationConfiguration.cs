using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace Cinema.Models.Configurations
{
    public class LocationConfiguration : IEntityTypeConfiguration<Location>
    {
        void IEntityTypeConfiguration<Location>.Configure(EntityTypeBuilder<Location> builder)
        {
            builder.HasKey(x => x.Id);

            //1:N
            builder.HasMany(l => l.Halls)
            .WithOne(h => h.Location)
            .HasForeignKey(k => k.LocationId);
        }
    }
}
