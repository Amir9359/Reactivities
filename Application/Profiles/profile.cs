using System.Collections.Generic;
using Domain;

namespace Application.Profiles
{
    public class profile
    {
        public string Username { get; set; }
        public string displayname { get; set; }
        public string Bio { get; set; }
        public string Image { get; set; }
        public ICollection<Photo> Photos { get; set; }
    }

}