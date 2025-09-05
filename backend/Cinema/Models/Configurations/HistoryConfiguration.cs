using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace Cinema.Models.Configurations
{
    public class HistoryConfiguration : IEntityTypeConfiguration<History>
    {
        public void Configure(EntityTypeBuilder<History> builder)
        {
            builder.HasKey(x => x.Id);

            //1:N
            builder.HasOne(h => h.User)
                    .WithMany(u => u.Histories)
                    .HasForeignKey(k => k.UserId);

            builder.HasOne(h => h.Ticket)
                    .WithMany(t => t.Histories)
                    .HasForeignKey(k => k.TicketId);

            builder.HasOne(h => h.Film)
        .WithMany(f => f.Histories)
        .HasForeignKey(k => k.FilmId)
        .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
