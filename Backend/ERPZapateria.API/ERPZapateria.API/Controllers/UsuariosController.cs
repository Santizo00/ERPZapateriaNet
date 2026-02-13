using ERPZapateria.Application.DTOs.Usuario;
using ERPZapateria.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERPZapateria.API.Controllers;

/// <summary>
/// API controller for managing users (Usuarios).
/// Handles user CRUD operations including user creation with hashed passwords and role management.
/// All endpoints require Admin role for access.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UsuariosController : ControllerBase
{
    private readonly IUsuarioService _usuarioService;

    /// <summary>Initializes a new instance of the UsuariosController class.</summary>
    /// <param name="usuarioService">The user service dependency.</param>
    public UsuariosController(IUsuarioService usuarioService)
    {
        _usuarioService = usuarioService;
    }

    /// <summary>
    /// Retrieves all active users with their role information.
    /// Only accessible by users with Admin role.
    /// </summary>
    /// <returns>A list of all active users with role details.</returns>
    /// <response code="200">Returns the list of users.</response>
    /// <response code="401">User not authenticated.</response>
    /// <response code="403">User does not have Admin role.</response>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetAll()
    {
        var usuarios = await _usuarioService.GetAllAsync();
        return Ok(usuarios);
    }

    /// <summary>
    /// Retrieves a specific user by ID including role information.
    /// Only accessible by users with Admin role.
    /// </summary>
    /// <param name="id">The user identifier.</param>
    /// <returns>The requested user with role information.</returns>
    /// <response code="200">Returns the user.</response>
    /// <response code="401">User not authenticated.</response>
    /// <response code="403">User does not have Admin role.</response>
    /// <response code="404">User not found.</response>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var usuario = await _usuarioService.GetByIdAsync(id);

        if (usuario == null)
            return NotFound();

        return Ok(usuario);
    }

    /// <summary>
    /// Creates a new user with username, password, and role assignment.
    /// Password will be hashed using BCrypt before storage.
    /// Only accessible by users with Admin role.
    /// </summary>
    /// <param name="dto">The user creation data containing username, password (required), and role ID.</param>
    /// <returns>The ID of the newly created user.</returns>
    /// <response code="200">User successfully created. Returns user ID.</response>
    /// <response code="400">Invalid user data (empty username/password or invalid role ID).</response>
    /// <response code="401">User not authenticated.</response>
    /// <response code="403">User does not have Admin role.</response>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Create([FromBody] CreateUsuarioDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
            return BadRequest("Username y Password son obligatorios");

        if (dto.IdRol <= 0)
            return BadRequest("Rol inválido");

        var id = await _usuarioService.CreateAsync(dto);

        return Ok(new { IdUsuario = id, Message = "Usuario creado correctamente" });
    }

    /// <summary>
    /// Updates an existing user's information including optional password change.
    /// If password is not provided, the existing password remains unchanged.
    /// Only accessible by users with Admin role.
    /// </summary>
    /// <param name="id">The user identifier to update.</param>
    /// <param name="dto">The user update data containing username, optional new password, and role ID.</param>
    /// <returns>Success message if the user was updated.</returns>
    /// <response code="200">User successfully updated.</response>
    /// <response code="400">Invalid user data (empty username or invalid role ID).</response>
    /// <response code="401">User not authenticated.</response>
    /// <response code="403">User does not have Admin role.</response>
    /// <response code="404">User not found.</response>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateUsuarioDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Username))
            return BadRequest("Username es obligatorio");

        if (dto.IdRol <= 0)
            return BadRequest("Rol inválido");

        var updated = await _usuarioService.UpdateAsync(id, dto);

        if (!updated)
            return NotFound();

        return Ok(new { Message = "Usuario actualizado correctamente" });
    }

    /// <summary>
    /// Performs a soft delete on a user by marking them as inactive.
    /// The user record is retained in the database for audit purposes.
    /// Only accessible by users with Admin role.
    /// </summary>
    /// <param name="id">The user identifier to deactivate.</param>
    /// <returns>Success message if the user was deactivated.</returns>
    /// <response code="200">User successfully deactivated.</response>
    /// <response code="401">User not authenticated.</response>
    /// <response code="403">User does not have Admin role.</response>
    /// <response code="404">User not found.</response>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _usuarioService.DeleteAsync(id);

        if (!deleted)
            return NotFound();

        return Ok(new { Message = "Usuario desactivado correctamente" });
    }
}
