using Dapper;
using ERPZapateria.Application.DTOs.Pedido;
using ERPZapateria.Application.Interfaces;
using System.Data;

namespace ERPZapateria.API.Services;

/// <summary>
/// Service for managing orders (Pedidos).
/// Handles order creation with inventory management through stored procedures and order retrieval.
/// </summary>
public class PedidoService : IPedidoService
{
    private readonly IDbConnection _connection;

    /// <summary>Initializes a new instance of the PedidoService class.</summary>
    /// <param name="connection">The database connection dependency.</param>
    public PedidoService(IDbConnection connection)
    {
        _connection = connection;
    }

    /// <summary>
    /// Creates a new order with line items and updates inventory.
    /// Converts order items to DataTable format for table-valued parameter in stored procedure.
    /// The sp_CrearPedido procedure handles inventory updates and transaction management.
    /// </summary>
    /// <param name="dto">The order creation data containing client ID, user ID, and order items.</param>
    /// <returns>The ID of the newly created order.</returns>
    /// <remarks>
    /// Important: The stored procedure sp_CrearPedido is responsible for:
    /// 1. Creating the Pedidos record
    /// 2. Creating PedidoDetalle records for each item
    /// 3. Updating inventory via sp_ActualizarInventario
    /// 4. Managing transaction rollback on any failure
    /// </remarks>
    public async Task<int> CrearPedidoAsync(CreatePedidoDto dto)
    {
        // Build DataTable for table-valued parameter (TVP)
        var table = new DataTable();
        table.Columns.Add("IdProducto", typeof(int));
        table.Columns.Add("Cantidad", typeof(int));
        table.Columns.Add("PrecioUnitario", typeof(decimal));

        foreach (var item in dto.Detalle)
        {
            table.Rows.Add(item.IdProducto, item.Cantidad, item.PrecioUnitario);
        }

        // Build stored procedure parameters
        var parameters = new DynamicParameters();
        parameters.Add("@IdCliente", dto.IdCliente);
        parameters.Add("@IdUsuario", dto.IdUsuario);
        parameters.Add("@Detalle", table.AsTableValuedParameter("PedidoDetalleType"));

        // Execute stored procedure which handles order creation and inventory updates
        return await _connection.ExecuteScalarAsync<int>(
            "sp_CrearPedido",
            parameters,
            commandType: CommandType.StoredProcedure
        );
    }

    /// <summary>
    /// Retrieves all orders with basic information.
    /// </summary>
    /// <returns>An enumerable collection of orders with ID, client, user, date, total, and status.</returns>
    public async Task<IEnumerable<object>> GetAllAsync()
    {
        var query = @"
        SELECT IdPedido, IdCliente, IdUsuario, Fecha, Total, Estado
        FROM Pedidos";

        return await _connection.QueryAsync(query);
    }

    /// <summary>
    /// Retrieves a specific order by ID with basic information.
    /// </summary>
    /// <param name="id">The order identifier.</param>
    /// <returns>The order if found; null otherwise.</returns>
    public async Task<object?> GetByIdAsync(int id)
    {
        var query = @"
        SELECT IdPedido, IdCliente, IdUsuario, Fecha, Total, Estado
        FROM Pedidos
        WHERE IdPedido = @Id";

        return await _connection.QueryFirstOrDefaultAsync(query, new { Id = id });
    }

    /// <summary>
    /// Retrieves complete order details including client, user, and line items.
    /// Uses QueryMultiple to execute two queries efficiently:
    /// 1. Main order header with client and user information
    /// 2. Order details (line items) with product information
    /// </summary>
    /// <param name="id">The order identifier.</param>
    /// <returns>
    /// PedidoDetalleResponseDto with complete order information including client, user, and items.
    /// Returns null if order not found.
    /// </returns>
    public async Task<PedidoDetalleResponseDto?> GetDetalleByIdAsync(int id)
    {
        var query = @"
            SELECT p.IdPedido, p.IdCliente, c.Nombre AS ClienteNombre, c.NIT AS ClienteNIT,
                   p.IdUsuario, u.Username AS UsuarioNombre, p.Fecha, p.Total, p.Estado
            FROM Pedidos p
            INNER JOIN Clientes c ON p.IdCliente = c.IdCliente
            INNER JOIN Usuarios u ON p.IdUsuario = u.IdUsuario
            WHERE p.IdPedido = @Id;

            SELECT d.IdProducto, pr.Nombre AS ProductoNombre, d.Cantidad, d.PrecioUnitario, d.Subtotal
            FROM PedidoDetalle d
            INNER JOIN Productos pr ON d.IdProducto = pr.IdProducto
            WHERE d.IdPedido = @Id;";

        // Execute both queries efficiently
        using var multi = await _connection.QueryMultipleAsync(query, new { Id = id });
        
        // Read order header with client and user information
        var header = await multi.ReadFirstOrDefaultAsync<PedidoDetalleResponseDto>();
        if (header == null)
            return null;

        // Read order line items
        var detalle = (await multi.ReadAsync<PedidoDetalleItemDto>()).ToList();
        header.Detalle = detalle;

        return header;
    }
}
