using System;
using Application.Core;

namespace Application.Activities
{
    public class ActivityParams : PagingParams
    {
        public bool IsGoing { get; set; }
        public bool IsHost { get; set; }
        public DateTime startDate { get; set; } = DateTime.UtcNow;
    }
}