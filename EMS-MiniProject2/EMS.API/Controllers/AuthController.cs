using EMS.API.Services;
using EMS.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// Register a new user
        /// </summary>
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] AuthRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var (success, user, message) = await _authService.RegisterAsync(dto);

            if (!success)
            {
                if (message == "Username already exists")
                    return Conflict(new AuthResponseDto
                    {
                        Success = false,
                        Message = message
                    });

                return BadRequest(new AuthResponseDto
                {
                    Success = false,
                    Message = message
                });
            }

            var (loginSuccess, _, token, _) = await _authService.LoginAsync(dto);

            return Ok(new AuthResponseDto
            {
                Success = true,
                Message = message,
                Username = user.Username,
                Role = user.Role,
                Token = token
            });
        }

        /// <summary>
        /// Login user
        /// </summary>
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AuthRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var (success, user, token, message) = await _authService.LoginAsync(dto);

            if (!success)
                return Unauthorized(new AuthResponseDto
                {
                    Success = false,
                    Message = message
                });

            return Ok(new AuthResponseDto
            {
                Success = true,
                Message = message,
                Username = user.Username,
                Role = user.Role,
                Token = token
            });
        }
    }
}
