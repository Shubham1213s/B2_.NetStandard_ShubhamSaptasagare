using EMS.API.Data;
using EMS.API.Models;
using EMS.API.DTOs;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

namespace EMS.API.Services
{
    /// <summary>
    /// Handles user registration, login, and JWT generation.
    /// </summary>
    public class AuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthService(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        /// <summary>
        /// Registers a new application user.
        /// </summary>
        public async Task<(bool success, AppUser user, string message)> RegisterAsync(AuthRequestDto dto)
        {


            // Validate input
            if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
                return (false, null, "Username and password are required");

            if (dto.Password.Length < 6)
                return (false, null, "Password must be at least 6 characters");

            // Check if username already exists (case-insensitive)
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Username.ToLower() == dto.Username.ToLower());

            if (existingUser != null)
                return (false, null, "Username already exists");

            // Create new user with hashed password
            var user = new AppUser
            {
                Username = dto.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "Viewer", // Default role - per task specification
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return (true, user, "Registration successful");
        }

        /// <summary>
        /// Authenticates a user and returns JWT token when valid.
        /// </summary>
        public async Task<(bool success, AppUser user, string token, string message)> LoginAsync(AuthRequestDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
                return (false, null, null, "Username and password are required");

            // Find user (case-insensitive)
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username.ToLower() == dto.Username.ToLower());

            if (user == null)
                return (false, null, null, "Invalid username or password");

            // Verify password
            bool isValidPassword = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
            if (!isValidPassword)
                return (false, null, null, "Invalid username or password");

            // Generate JWT token
            var token = GenerateToken(user);

            return (true, user, token, "Login successful");
        }

        /// <summary>
        /// Generates signed JWT token with identity and role claims.
        /// </summary>
        private string GenerateToken(AppUser user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(double.Parse(_config["Jwt:ExpiryHours"] ?? "8")),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
