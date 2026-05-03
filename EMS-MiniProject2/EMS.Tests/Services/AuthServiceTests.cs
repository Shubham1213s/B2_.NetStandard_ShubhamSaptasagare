using NUnit.Framework;
using Moq;
using EMS.API.Services;
using EMS.API.Data;
using EMS.API.Models;
using EMS.API.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Reflection;

namespace EMS.Tests.Services;

[TestFixture]
public class AuthServiceTests
{
    private AppDbContext? _context;
    private Mock<IConfiguration>? _configMock;
    private AuthService? _authService;

    [SetUp]
    public void Setup()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        _context = new AppDbContext(options);

        _configMock = new Mock<IConfiguration>(MockBehavior.Strict);
        _configMock.Setup(c => c["Jwt:Key"]).Returns("super-secret-super-secret-super-secret-123!");
        _configMock.Setup(c => c["Jwt:Issuer"]).Returns("ems-api");
        _configMock.Setup(c => c["Jwt:Audience"]).Returns("ems-client");
        _configMock.Setup(c => c["Jwt:ExpiryHours"]).Returns("8");

        _authService = new AuthService(_context, _configMock.Object);
    }

    [TearDown]
    public void TearDown()
    {
        _context?.Dispose();
    }

    [Test]
    public async Task LoginAsync_ValidCredentials_ReturnsTokenString()
    {
        var user = new AppUser
        {
            Username = "john",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
            Role = "Viewer",
            CreatedAt = DateTime.UtcNow
        };

        _context!.Users.Add(user);
        await _context.SaveChangesAsync();

        var dto = new AuthRequestDto { Username = "john", Password = "password123" };

        var result = await _authService!.LoginAsync(dto);

        Assert.That(result.success, Is.True);
        Assert.That(result.token, Is.Not.Null.And.Not.Empty);

        _configMock!.Verify(c => c["Jwt:Key"], Times.AtLeastOnce);
        _configMock.Verify(c => c["Jwt:Issuer"], Times.AtLeastOnce);
        _configMock.Verify(c => c["Jwt:Audience"], Times.AtLeastOnce);
        _configMock.Verify(c => c["Jwt:ExpiryHours"], Times.AtLeastOnce);
    }

    [Test]
    public async Task LoginAsync_WrongPassword_ReturnsFailure()
    {
        var user = new AppUser
        {
            Username = "john",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
            Role = "Viewer",
            CreatedAt = DateTime.UtcNow
        };

        _context!.Users.Add(user);
        await _context.SaveChangesAsync();

        var dto = new AuthRequestDto { Username = "john", Password = "wrong-password" };

        var result = await _authService!.LoginAsync(dto);

        Assert.That(result.success, Is.False);
        Assert.That(result.token, Is.Null);
        Assert.That(result.message, Is.EqualTo("Invalid username or password"));
    }

    [Test]
    public async Task RegisterAsync_DuplicateUsername_ReturnsFailure()
    {
        _context!.Users.Add(new AppUser
        {
            Username = "existingUser",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
            Role = "Viewer",
            CreatedAt = DateTime.UtcNow
        });
        await _context.SaveChangesAsync();

        var dto = new AuthRequestDto { Username = "ExistingUser", Password = "newpass123" };

        var result = await _authService!.RegisterAsync(dto);

        Assert.That(result.success, Is.False);
        Assert.That(result.user, Is.Null);
        Assert.That(result.message, Is.EqualTo("Username already exists"));
    }

    [Test]
    public void GenerateToken_ReturnsNonEmptyString()
    {
        var user = new AppUser
        {
            Id = 123,
            Username = "tokenUser",
            Role = "Viewer"
        };

        var method = typeof(AuthService).GetMethod("GenerateToken", BindingFlags.NonPublic | BindingFlags.Instance);
        var token = method!.Invoke(_authService, new object[] { user }) as string;

        Assert.That(token, Is.Not.Null.And.Not.Empty);

        _configMock!.Verify(c => c["Jwt:Key"], Times.AtLeastOnce);
    }
}
