using ERPZapateria.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERPZapateria.API.Controllers;

/// <summary>
/// Controlador de roles del sistema (solo Admin).
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class RolesController : ControllerBase
{
    private readonly IRolService _rolService;

    public RolesController(IRolService rolService)
    {
        _rolService = rolService;
    }

    /// <summary>
    /// Obtiene todos los roles activos.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var roles = await _rolService.GetAllAsync();
        return Ok(roles);
    }

    /// <summary>
    /// Obtiene un rol por ID.
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var rol = await _rolService.GetByIdAsync(id);

        if (rol == null)
            return NotFound();

        return Ok(rol);
    }
}
