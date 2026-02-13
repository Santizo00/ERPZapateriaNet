using ERPZapateria.Application.DTOs.Usuario;
using ERPZapateria.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERPZapateria.API.Controllers;

/// <summary>
/// Controlador CRUD de usuarios (solo Admin).
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UsuariosController : ControllerBase
{
    private readonly IUsuarioService _usuarioService;

    public UsuariosController(IUsuarioService usuarioService)
    {
        _usuarioService = usuarioService;
    }

    /// <summary>
    /// Obtiene todos los usuarios activos.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var usuarios = await _usuarioService.GetAllAsync();
        return Ok(usuarios);
    }

    /// <summary>
    /// Obtiene un usuario por ID.
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var usuario = await _usuarioService.GetByIdAsync(id);

        if (usuario == null)
            return NotFound();

        return Ok(usuario);
    }

    /// <summary>
    /// Crea un nuevo usuario con password hasheado.
    /// </summary>
    [HttpPost]
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
    /// Actualiza un usuario existente.
    /// </summary>
    [HttpPut("{id}")]
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
    /// Elimina un usuario (marca como inactivo).
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _usuarioService.DeleteAsync(id);

        if (!deleted)
            return NotFound();

        return Ok(new { Message = "Usuario desactivado correctamente" });
    }
}
