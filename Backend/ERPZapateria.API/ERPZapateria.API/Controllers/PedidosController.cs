using ERPZapateria.Application.DTOs.Pedido;
using ERPZapateria.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERPZapateria.API.Controllers;

/// <summary>
/// API controller for managing orders (Pedidos).
/// Handles order creation, retrieval, and detailed order information with inventory management.
/// All endpoints require user authentication. Order creation requires Admin or Vendedor role.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PedidosController : ControllerBase
{
    private readonly IPedidoService _pedidoService;

    /// <summary>Initializes a new instance of the PedidosController class.</summary>
    /// <param name="pedidoService">The order service dependency.</param>
    public PedidosController(IPedidoService pedidoService)
    {
        _pedidoService = pedidoService;
    }

    /// <summary>
    /// Creates a new order with line items.
    /// Updates inventory based on order quantities via stored procedure.
    /// Only users with Admin or Vendedor role can create orders.
    /// </summary>
    /// <param name="dto">The order creation data containing client ID, user ID, and line items.</param>
    /// <returns>The ID of the newly created order.</returns>
    /// <response code="200">Order successfully created. Returns order ID.</response>
    /// <response code="400">Invalid order data (missing client, user, or items).</response>
    /// <response code="401">User not authenticated.</response>
    /// <response code="403">User does not have required role (Admin or Vendedor).</response>
    /// <response code="409">Insufficient inventory for one or more items.</response>
    [HttpPost]
    [Authorize(Roles = "Admin,Vendedor")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
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
    /// Retrieves all orders.
    /// </summary>
    /// <returns>A list of all orders with basic information.</returns>
    /// <response code="200">Returns the list of orders.</response>
    /// <response code="401">User not authenticated.</response>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetAll()
    {
        var pedidos = await _pedidoService.GetAllAsync();
        return Ok(pedidos);
    }

    /// <summary>
    /// Retrieves a specific order by ID with basic information.
    /// </summary>
    /// <param name="id">The order identifier.</param>
    /// <returns>The requested order if found.</returns>
    /// <response code="200">Returns the order.</response>
    /// <response code="401">User not authenticated.</response>
    /// <response code="404">Order not found.</response>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var pedido = await _pedidoService.GetByIdAsync(id);

        if (pedido == null)
            return NotFound();

        return Ok(pedido);
    }

    /// <summary>
    /// Retrieves complete order details including client, user, line items, and totals.
    /// This endpoint provides comprehensive order information for detailed views.
    /// </summary>
    /// <param name="id">The order identifier.</param>
    /// <returns>Complete order details with client, user, and item information.</returns>
    /// <response code="200">Returns the complete order details.</response>
    /// <response code="401">User not authenticated.</response>
    /// <response code="404">Order not found.</response>
    [HttpGet("{id}/detalle")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetDetalle(int id)
    {
        var pedido = await _pedidoService.GetDetalleByIdAsync(id);

        if (pedido == null)
            return NotFound();

        return Ok(pedido);
    }
}}
