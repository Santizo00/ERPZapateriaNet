using ERPZapateria.Application.DTOs.Pedido;
using ERPZapateria.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERPZapateria.API.Controllers;

/// <summary>
/// Controlador de pedidos.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PedidosController : ControllerBase
{
    private readonly IPedidoService _pedidoService;

    public PedidosController(IPedidoService pedidoService)
    {
        _pedidoService = pedidoService;
    }

    /// <summary>
    /// Crea un nuevo pedido (solo Admin o Vendedor).
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin,Vendedor")]
    public async Task<IActionResult> CrearPedido([FromBody] CreatePedidoDto dto)
    {
        var idPedido = await _pedidoService.CrearPedidoAsync(dto);

        return Ok(new
        {
            IdPedido = idPedido,
            Message = "Pedido creado correctamente"
        });
    }

    /// <summary>
    /// Obtiene todos los pedidos.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var pedidos = await _pedidoService.GetAllAsync();
        return Ok(pedidos);
    }

    /// <summary>
    /// Obtiene un pedido por ID.
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var pedido = await _pedidoService.GetByIdAsync(id);

        if (pedido == null)
            return NotFound();

        return Ok(pedido);
    }

    /// <summary>
    /// Obtiene el detalle completo de un pedido.
    /// </summary>
    [HttpGet("{id}/detalle")]
    public async Task<IActionResult> GetDetalle(int id)
    {
        var pedido = await _pedidoService.GetDetalleByIdAsync(id);

        if (pedido == null)
            return NotFound();

        return Ok(pedido);
    }
}
