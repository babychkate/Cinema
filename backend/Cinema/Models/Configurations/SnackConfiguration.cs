using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Cinema.Models.Configurations
{
    public class SnackConfiguration : IEntityTypeConfiguration<Snack>
    {
        public void Configure(EntityTypeBuilder<Snack> builder)
        {
            builder.HasKey(x => x.Id);

            //1:N(U:Sn)
            builder.HasMany(s => s.Users)
                    .WithMany(u => u.Snacks);

            //M:N
            builder.HasMany(s => s.Sales)
               .WithMany(s => s.Snacks);
        }
    }
}
