using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace Cinema.Models.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(x => x.Id);

            //1:N
            builder.HasMany(u => u.Tickets)
                   .WithOne(t => t.User)
                   .HasForeignKey(k => k.UserId)
                   .OnDelete(DeleteBehavior.Cascade);

            //1:N
            builder.HasMany(u => u.Reviews)
                    .WithOne(r => r.User)
                    .HasForeignKey(k => k.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

            // M:N
            builder.HasMany(u => u.Snacks)
                    .WithMany(s => s.Users);
            //1:N
            builder.HasMany(u => u.Histories)
                    .WithOne(h => h.User)
                    .HasForeignKey(k => k.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
