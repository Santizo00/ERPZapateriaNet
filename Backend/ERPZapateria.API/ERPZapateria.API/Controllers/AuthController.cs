using ERPZapateria.Application.DTOs.Auth;
using ERPZapateria.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERPZapateria.API.Controllers;

/// <summary>
/// API controller for user authentication.
/// Handles user login and admin-only user registration with JWT token generation.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    /// <summary>Initializes a new instance of the AuthController class.</summary>
    /// <param name="authService">The authentication service dependency.</param>
    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    /// <summary>
    /// Authenticates a user with provided credentials and generates JWT token.
    /// </summary>
    /// <param name="request">The login credentials containing username and password.</param>
    /// <returns>JWT token and user information if authentication succeeds.</returns>
    /// <response code="200">Successfully authenticated. Returns token and user info.</response>
    /// <response code="400">Invalid request data (missing or empty credentials).</response>
    /// <response code="401">Invalid username or password.</response>
    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _authService.LoginAsync(request);

        if (result == null)
            return Unauthorized("Credenciales inválidas");

        return Ok(result);
    }

    /// <summary>
    /// Registers a new user with credentials and role assignment.
    /// Only users with Admin role can register new users.
    /// </summary>
    /// <param name="request">The registration details containing username, password, and role.</param>
    /// <returns>Success message if registration completed.</returns>
    /// <response code="200">User successfully registered.</response>
    /// <response code="400">Invalid registration data or user already exists.</response>
    /// <response code="401">User not authenticated.</response>
    /// <response code="403">User does not have Admin role.</response>
    [HttpPost("register")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Register(RegisterRequestDto request)
    {
        var result = await _authService.RegisterAsync(request);

        if (!result)
            return BadRequest("No se pudo registrar el usuario");

        return Ok("Usuario registrado correctamente");
    }
}}


