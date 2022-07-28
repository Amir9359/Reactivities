using System;
using System.Threading.Tasks;
using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        public IMediator _Mediator { get; }
        public ChatHub(IMediator mediator)
        {
            _Mediator = mediator;
        }

        public async Task SendComment(Create.Command command)  
        {
           var comment = await _Mediator.Send(command);

           await Clients.Group(command.ActivityId.ToString())
                            .SendAsync("ReciveComment" , comment.Value);
        }

        public override async Task OnConnectedAsync()
        {
            var httpcontext = Context.GetHttpContext();
            var activityId = httpcontext.Request.Query["activityId"];
            await Groups.AddToGroupAsync(Context.ConnectionId , activityId);
            var result = await _Mediator.Send(new List.Query{ActivityId = Guid.Parse(activityId)});
            await Clients.Caller.SendAsync("LoadComments" , result.Value);
        }
    }
}