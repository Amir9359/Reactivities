namespace Application.Activities
{
    public class AttendeeDto
    {
        public string Username { get; set; }
        public string displayname { get; set; }
        public string Bio { get; set; }
        public string Image { get; set; }
        public bool Following { get; set; }
        public int FollowingCount { get; set; }
        public int FollowerCount { get; set; }

    }
}