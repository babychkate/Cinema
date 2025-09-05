using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace Cinema.Models.Configurations
{
    public class SessionConfiguration : IEntityTypeConfiguration<Session>
    {
        public void Configure(EntityTypeBuilder<Session> builder)
        {
            builder.HasKey(x => x.Id);

            //N:1
            builder.HasMany(s => s.Tickets)
                    .WithOne(t => t.Session)
                    .HasForeignKey(k => k.SessionId);

            //1:N
            builder.HasOne(s => s.Hall)
                    .WithMany(h => h.Sessions)
                    .HasForeignKey(k => k.HallId);

            //1:N
            builder.HasOne(s => s.Film)
                    .WithMany(f => f.Sessions)
                    .HasForeignKey(k => k.FilmId);
        }
    }
}
