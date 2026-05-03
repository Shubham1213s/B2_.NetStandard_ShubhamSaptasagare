namespace EMS.API.Models
{
    public class AppUser
    {
        public int Id { get; set; }

        public string Username { get; set; }
        public string PasswordHash { get; set; }

        public string Role { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}