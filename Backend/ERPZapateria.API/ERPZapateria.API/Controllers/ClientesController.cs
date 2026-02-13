using ERPZapateria.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERPZapateria.API.Controllers;

/// <summary>
/// API controller for managing clients (customers).
/// Provides endpoints to retrieve client information.
/// All endpoints require user authentication.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ClientesController : ControllerBase
{
    private readonly IClienteService _clienteService;

    /// <summary>Initializes a new instance of the ClientesController class.</summary>
    /// <param name="clienteService">The client service dependency.</param>
    public ClientesController(IClienteService clienteService)
    {
        _clienteService = clienteService;
    }

    /// <summary>
    /// Retrieves all active clients.
    /// </summary>
    /// <returns>A list of all active clients with contact information.</returns>
    /// <response code="200">Returns the list of clients.</response>
    /// <response code="401">If the user is not authenticated.</response>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetAll()
    {
        var clientes = await _clienteService.GetAllAsync();
        return Ok(clientes);
    }

    /// <summary>
    /// Retrieves a specific client by ID.
    /// </summary>
    /// <param name="id">The client identifier.</param>
    /// <returns>The requested client if found.</returns>
    /// <response code="200">Returns the client.</response>
    /// <response code="401">If the user is not authenticated.</response>
    /// <response code="404">If the client is not found.</response>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var cliente = await _clienteService.GetByIdAsync(id);

        if (cliente == null)
            return NotFound();

        return Ok(cliente);
    }
}
