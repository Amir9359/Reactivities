using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
        }
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly DataContext _context;
            public Handler(DataContext context, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
            {
                _context = context;
                _photoAccessor = photoAccessor;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                 var user = await _context.Users.Include(p => p.Photos)
                                .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());
                if(user == null) return null;

                var Photo = user.Photos.FirstOrDefault(x => x.Id == request.Id);

                if(Photo == null ) return null;
                if(Photo.IsMain) return Result<Unit>.Failure("You Cann`t Delete your Main Photo!");

                 var result = await _photoAccessor.DeletePhoto(Photo.Id);
                   if(result == null) return Result<Unit>.Failure("Problem with Deleteing Photo from Cloudinary!");

                user.Photos.Remove(Photo);

                var Delresult = await _context.SaveChangesAsync() > 0 ;
                if(Delresult) return Result<Unit>.Success(Unit.Value);
                return Result<Unit>.Failure("Problem with Deleteing Photo!");
                
            }
        }
    }
}