using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Activity> Activities { get; set; }
        public DbSet<ActivityAttendee> ActivityAttendees{ get; set; }
        public DbSet<Photo> Phtoes { get; set; }
        public DbSet<Comment> Comments { get; set; } 
        public DbSet<UserFollowing> UserFollowings { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ActivityAttendee>(x => x.HasKey(a => new{a.AppUserId , a.ActivityId}));

            builder.Entity<ActivityAttendee>()
                    .HasOne(a => a.Activity)
                    .WithMany(u => u.Attendees)
                    .HasForeignKey(aa => aa.ActivityId);

            builder.Entity<ActivityAttendee>()
                    .HasOne(a => a.AppUser)
                    .WithMany(u => u.Activities)
                    .HasForeignKey(aa => aa.AppUserId);

            builder.Entity<Comment>()
                .HasOne(a => a.Activity)
                .WithMany(c => c.Comments)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserFollowing>(b => {
                b.HasKey(k => new {k.ObserverId , k.TargetId});

                b.HasOne(b => b.Observer)
                    .WithMany(f => f.Followings)
                    .HasForeignKey(b => b.ObserverId)
                    .OnDelete(DeleteBehavior.Cascade);

                b.HasOne(b => b.Target)
                    .WithMany(f => f.Followers)
                    .HasForeignKey(b => b.TargetId)
                    .OnDelete(DeleteBehavior.Cascade);
                 });
        }
    }
}