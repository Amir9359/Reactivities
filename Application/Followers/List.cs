using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Application.Profiles;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class List
    {
        public class Query : IRequest<Result<List<Profiles.profile>>>
        {
            public string Predicate { get; set; }
            public string Username { get; set; }
        }
        public class Handler : IRequestHandler<Query, Result<List<Profiles.profile>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<List<Profiles.profile>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var profiles = new List<Profiles.profile>();
                switch (request.Predicate)
                {
                    case "followers":
                        profiles = await _context.UserFollowings.Where(s => s.Target.UserName == request.Username)
                            .Select(s => s.Observer)
                            .ProjectTo<Profiles.profile>(_mapper.ConfigurationProvider,
                             new { currentUsername = _userAccessor.GetUsername() })
                            .ToListAsync();
                        break;
                    case "following":
                        profiles = await _context.UserFollowings.Where(s => s.Observer.UserName == request.Username)
                            .Select(s => s.Target)
                            .ProjectTo<Profiles.profile>(_mapper.ConfigurationProvider,
                             new { currentUsername = _userAccessor.GetUsername() })
                            .ToListAsync();
                        break;
                }
                return Result<List<Profiles.profile>>.Success(profiles);
            }
        }
    }
}