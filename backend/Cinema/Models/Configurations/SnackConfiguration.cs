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
            builder.HasOne(s => s.User)
                .WithMany(u => u.Snacks)
                .HasForeignKey(k => k.UserId);
        }
    }
}
