using ERPZapateria.Application.DTOs.Pedido;
using ERPZapateria.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERPZapateria.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // requiere login
public class PedidosController : ControllerBase
{
    private readonly IPedidoService _pedidoService;

    public PedidosController(IPedidoService pedidoService)
    {
        _pedidoService = pedidoService;
    }

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


    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAll()
    {
        var pedidos = await _pedidoService.GetAllAsync();
        return Ok(pedidos);
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetById(int id)
    {
        var pedido = await _pedidoService.GetByIdAsync(id);

        if (pedido == null)
            return NotFound();

        return Ok(pedido);
    }

}
