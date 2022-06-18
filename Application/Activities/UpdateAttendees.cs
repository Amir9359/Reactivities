using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class UpdateAttendees
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly DataContext _context;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                 var activity = await _context.Activities
                   .Include(x => x.Attendees).ThenInclude(x => x.AppUser)
                   .FirstOrDefaultAsync(s => s.Id == request.Id);

                   if(activity == null) return null;

                   var user =await _context.Users.FirstOrDefaultAsync(x =>
                   x.UserName == _userAccessor.GetUsername());

                   if(user == null) return null;

                   var hostUsername = activity.Attendees.FirstOrDefault(x => x.IsHost)?.AppUser?.UserName;
                   var attendens = activity.Attendees.FirstOrDefault(x=> x.AppUser.UserName == user.UserName);

                   if(attendens != null && hostUsername == user.UserName)
                     activity.IsCancelled = !activity.IsCancelled;

                    if(attendens != null && hostUsername != user.UserName)
                        activity.Attendees.Remove(attendens);
                    if(attendens == null)
                    {
                        attendens = new Domain.ActivityAttendee
                        {
                            Activity = activity, 
                            AppUser = user,
                            IsHost = false 
                        };
                        activity.Attendees.Add(attendens);
                    }

                    var result = await _context.SaveChangesAsync() > 0;

                    return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem with Updatting Attendence"); 

            }
        }
    }
}