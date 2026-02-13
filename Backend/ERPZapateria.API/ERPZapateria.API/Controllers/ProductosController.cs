using ERPZapateria.API.Services;
using ERPZapateria.Application.DTOs.Producto;
using ERPZapateria.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERPZapateria.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // requiere login
public class ProductosController : ControllerBase
{
    private readonly IProductoService _productoService;

    public ProductosController(IProductoService productoService)
    {
        _productoService = productoService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var productos = await _productoService.GetAllAsync();
        return Ok(productos);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var producto = await _productoService.GetByIdAsync(id);

        if (producto == null)
            return NotFound();

        return Ok(producto);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")] // Solo admin crea productos
    public async Task<IActionResult> Create([FromBody] CreateProductoDto dto)
    {
        var id = await _productoService.CreateAsync(dto);
        return Ok(new { IdProducto = id });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateProductoDto dto)
    {
        var updated = await _productoService.UpdateAsync(id, dto);

        if (!updated)
            return NotFound();

        return Ok("Producto actualizado");
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _productoService.DeleteAsync(id);

        if (!deleted)
            return NotFound();

        return Ok("Producto eliminado");
    }
}
