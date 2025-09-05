using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Cinema.Models.Configurations
{
    public class SaleConfiguration : IEntityTypeConfiguration<Sale>
    {
        public void Configure(EntityTypeBuilder<Sale> builder)
        {
            builder.HasKey(x => x.Id);

            //M:N
            builder.HasMany(s => s.Snacks)
               .WithMany(s => s.Sales);

            builder.HasMany(s => s.Tickets)
               .WithMany(t => t.Sales);
        }
    }
}
