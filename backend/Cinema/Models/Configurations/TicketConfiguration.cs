using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace Cinema.Models.Configurations
{
    public class TicketConfiguration : IEntityTypeConfiguration<Ticket>
    {
        public void Configure(EntityTypeBuilder<Ticket> builder)
        {
            builder.HasKey(x => x.Id);

            //1:N
            builder.HasOne(t => t.User)
                    .WithMany(u => u.Tickets)
                    .HasForeignKey(k => k.UserId);

            //1:N
            builder.HasOne(t => t.Session)
                    .WithMany(s => s.Tickets)
                    .HasForeignKey(k => k.SessionId);
        }
    }
}
