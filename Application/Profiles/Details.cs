using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class Details
    {
        public class Query : IRequest<Result<profile>>
        {
            public string Username { get; set; }
        }
        public class Handler : IRequestHandler<Query, Result<profile>>
        {
            private readonly IMapper _mapper;
            private readonly DataContext _context;

            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<profile>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user =await _context.Users.ProjectTo<profile>(_mapper.ConfigurationProvider)
                            .SingleOrDefaultAsync(x => x.Username == request.Username);

                if(user ==null) return null;
                return Result<profile>.Success(user);
            }
        }
    }
}