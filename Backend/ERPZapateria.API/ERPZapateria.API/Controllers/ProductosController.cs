using ERPZapateria.API.Services;
using ERPZapateria.Application.DTOs.Producto;
using ERPZapateria.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERPZapateria.API.Controllers;

/// <summary>
/// Controlador CRUD de productos.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProductosController : ControllerBase
{
    private readonly IProductoService _productoService;

    public ProductosController(IProductoService productoService)
    {
        _productoService = productoService;
    }

    /// <summary>
    /// Obtiene todos los productos activos.
    /// </summary>
    /// <returns>Lista de todos los productos activos.</returns>
    /// <response code="200">Retorna la lista de productos.</response>
    /// <response code="401">Si el usuario no está autenticado.</response>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetAll()
    {
        var productos = await _productoService.GetAllAsync();
        return Ok(productos);
    }

    /// <summary>
    /// Obtiene un producto específico por su ID.
    /// </summary>
    /// <param name="id">Identificador del producto.</param>
    /// <returns>El producto solicitado si existe.</returns>
    /// <response code="200">Retorna el producto.</response>
    /// <response code="401">Si el usuario no está autenticado.</response>
    /// <response code="404">Si el producto no existe.</response>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var producto = await _productoService.GetByIdAsync(id);

        if (producto == null)
            return NotFound();

        return Ok(producto);
    }

    /// <summary>
    /// Crea un nuevo producto en el sistema.
    /// Solo usuarios con rol Admin pueden crear productos.
    /// </summary>
    /// <param name="dto">DTO con los datos del producto a crear.</param>
    /// <returns>El ID del producto creado.</returns>
    /// <response code="200">Retorna el ID del nuevo producto.</response>
    /// <response code="400">Si los datos de la solicitud son inválidos.</response>
    /// <response code="401">Si el usuario no está autenticado.</response>
    /// <response code="403">Si el usuario no tiene rol Admin.</response>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Create([FromBody] CreateProductoDto dto)
    {
        var id = await _productoService.CreateAsync(dto);
        return Ok(new { IdProducto = id });
    }

    /// <summary>
    /// Actualiza un producto existente.
    /// Solo usuarios con rol Admin pueden actualizar productos.
    /// </summary>
    /// <param name="id">Identificador del producto.</param>
    /// <param name="dto">DTO con los datos actualizados del producto.</param>
    /// <returns>Mensaje de éxito si el producto fue actualizado.</returns>
    /// <response code="200">Si el producto fue actualizado correctamente.</response>
    /// <response code="400">Si los datos de la solicitud son inválidos.</response>
    /// <response code="401">Si el usuario no está autenticado.</response>
    /// <response code="403">Si el usuario no tiene rol Admin.</response>
    /// <response code="404">Si el producto no existe.</response>
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromBody] CreateProductoDto dto)
    {
        var updated = await _productoService.UpdateAsync(id, dto);

        if (!updated)
            return NotFound();

        return Ok("Producto actualizado");
    }

    /// <summary>
    /// Elimina un producto (eliminación suave - marca como inactivo).
    /// Solo usuarios con rol Admin pueden eliminar productos.
    /// </summary>
    /// <param name="id">Identificador del producto.</param>
    /// <returns>Mensaje de éxito si el producto fue eliminado.</returns>
    /// <response code="200">Si el producto fue eliminado correctamente.</response>
    /// <response code="401">Si el usuario no está autenticado.</response>
    /// <response code="403">Si el usuario no tiene rol Admin.</response>
    /// <response code="404">Si el producto no existe.</response>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _productoService.DeleteAsync(id);

        if (!deleted)
            return NotFound();

        return Ok("Producto eliminado");
    }
}
