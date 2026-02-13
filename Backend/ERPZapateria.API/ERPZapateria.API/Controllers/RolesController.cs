using ERPZapateria.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERPZapateria.API.Controllers;

/// <summary>
/// API controller for managing system roles.
/// Provides endpoints to retrieve role information.
/// All endpoints require Admin role for access.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class RolesController : ControllerBase
{
    private readonly IRolService _rolService;

    /// <summary>Initializes a new instance of the RolesController class.</summary>
    /// <param name="rolService">The role service dependency.</param>
    public RolesController(IRolService rolService)
    {
        _rolService = rolService;
    }

    /// <summary>
    /// Retrieves all active system roles.
    /// Only accessible by users with Admin role.
    /// </summary>
    /// <returns>A list of all active roles.</returns>
    /// <response code="200">Returns the list of roles.</response>
    /// <response code="401">User not authenticated.</response>
    /// <response code="403">User does not have Admin role.</response>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetAll()
    {
        var roles = await _rolService.GetAllAsync();
        return Ok(roles);
    }

    /// <summary>
    /// Retrieves a specific role by ID.
    /// Only accessible by users with Admin role.
    /// </summary>
    /// <param name="id">The role identifier.</param>
    /// <returns>The requested role if found.</returns>
    /// <response code="200">Returns the role.</response>
    /// <response code="401">User not authenticated.</response>
    /// <response code="403">User does not have Admin role.</response>
    /// <response code="404">Role not found.</response>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var rol = await _rolService.GetByIdAsync(id);

        if (rol == null)
            return NotFound();

        return Ok(rol);
    }
}
