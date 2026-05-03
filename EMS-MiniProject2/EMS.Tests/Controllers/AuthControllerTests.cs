using NUnit.Framework;
using Moq;
using EMS.API.Controllers;
using EMS.API.Services;
using EMS.API.Data;
using EMS.API.DTOs;
using EMS.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;

namespace EMS.Tests.Controllers;

[TestFixture]
public class AuthControllerTests
{
    private AppDbContext? _context;
    private Mock<IConfiguration>? _configMock;
    private AuthService? _authService;
    private AuthController? _controller;

    [SetUp]
    public void Setup()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        _context = new AppDbContext(options);

        _configMock = new Mock<IConfiguration>(MockBehavior.Strict);
        _configMock.Setup(c => c["Jwt:Key"]).Returns("test-secret-key-which-is-long-enough");
        _configMock.Setup(c => c["Jwt:Issuer"]).Returns("ems-api");
        _configMock.Setup(c => c["Jwt:Audience"]).Returns("ems-client");
        _configMock.Setup(c => c["Jwt:ExpiryHours"]).Returns("8");

        _authService = new AuthService(_context, _configMock.Object);
        _controller = new AuthController(_authService);
    }

    [TearDown]
    public void TearDown()
    {
        _context?.Dispose();
    }

    [Test]
    public async Task Register_NewUser_ReturnsOkWithToken()
    {
        var dto = new AuthRequestDto { Username = "newuser", Password = "password123" };

        var result = await _controller!.Register(dto);

        Assert.That(result, Is.TypeOf<OkObjectResult>());
        var ok = result as OkObjectResult;
        var resp = ok!.Value as AuthResponseDto;
        Assert.That(resp, Is.Not.Null);
        Assert.That(resp!.Success, Is.True);
        Assert.That(resp.Token, Is.Not.Null.And.Not.Empty);
    }

    [Test]
    public async Task Register_DuplicateUsername_ReturnsConflict()
    {
        // Arrange - seed existing user
        _context!.Users.Add(new AppUser
        {
            Username = "existing",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
            Role = "Viewer",
            CreatedAt = DateTime.UtcNow
        });
        await _context.SaveChangesAsync();

        var dto = new AuthRequestDto { Username = "Existing", Password = "newpass" };

        var result = await _controller!.Register(dto);

        Assert.That(result, Is.TypeOf<ConflictObjectResult>());
        var conflict = result as ConflictObjectResult;
        var resp = conflict!.Value as AuthResponseDto;
        Assert.That(resp, Is.Not.Null);
        Assert.That(resp!.Success, Is.False);
        Assert.That(resp.Message, Is.EqualTo("Username already exists"));
    }

    [Test]
    public async Task Login_ValidCredentials_ReturnsOkWithToken()
    {
        // Arrange
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

        var result = await _controller!.Login(dto);

        Assert.That(result, Is.TypeOf<OkObjectResult>());
        var ok = result as OkObjectResult;
        var resp = ok!.Value as AuthResponseDto;
        Assert.That(resp, Is.Not.Null);
        Assert.That(resp!.Success, Is.True);
        Assert.That(resp.Token, Is.Not.Null.And.Not.Empty);
    }

    [Test]
    public async Task Login_WrongPassword_ReturnsUnauthorized()
    {
        // Arrange
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

        var result = await _controller!.Login(dto);

        Assert.That(result, Is.TypeOf<UnauthorizedObjectResult>());
        var unauth = result as UnauthorizedObjectResult;
        var resp = unauth!.Value as AuthResponseDto;
        Assert.That(resp, Is.Not.Null);
        Assert.That(resp!.Success, Is.False);
        Assert.That(resp.Message, Is.EqualTo("Invalid username or password"));
    }
}
