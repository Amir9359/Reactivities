using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security
{
    public class IsHostRequirement : IAuthorizationRequirement
    {
    }
    public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
    {
        private readonly DataContext _dbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public IsHostRequirementHandler(DataContext dbContext, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _dbContext = dbContext;

        }

        protected override  Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
        {
            var userid = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if(userid == null) return Task.CompletedTask;

            var activityId = Guid.Parse(_httpContextAccessor.HttpContext?.Request
              .RouteValues.SingleOrDefault(x => x.Key == "id").Value?.ToString());
            
            var attendees = _dbContext.ActivityAttendees
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.AppUserId == userid && x.ActivityId == activityId)
            .Result;

            if(attendees == null) return Task.CompletedTask;

            if(attendees.IsHost) context.Succeed(requirement);
            return Task.CompletedTask;

        }
    }
}