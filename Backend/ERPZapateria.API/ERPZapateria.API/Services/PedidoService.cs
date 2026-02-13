using Dapper;
using ERPZapateria.Application.DTOs.Pedido;
using ERPZapateria.Application.Interfaces;
using System.Data;

namespace ERPZapateria.API.Services;

/// <summary>
/// Servicio de gestion de pedidos.
/// </summary>
public class PedidoService : IPedidoService
{
    private readonly IDbConnection _connection;

    public PedidoService(IDbConnection connection)
    {
        _connection = connection;
    }

    /// <summary>
    /// Crea un pedido y actualiza inventario mediante sp_CrearPedido.
    /// </summary>
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
    /// Obtiene todos los pedidos.
    /// </summary>
    public async Task<IEnumerable<object>> GetAllAsync()
    {
        var query = @"
        SELECT IdPedido, IdCliente, IdUsuario, Fecha, Total, Estado
        FROM Pedidos";

        return await _connection.QueryAsync(query);
    }

    /// <summary>
    /// Obtiene un pedido por ID.
    /// </summary>
    public async Task<object?> GetByIdAsync(int id)
    {
        var query = @"
        SELECT IdPedido, IdCliente, IdUsuario, Fecha, Total, Estado
        FROM Pedidos
        WHERE IdPedido = @Id";

        return await _connection.QueryFirstOrDefaultAsync(query, new { Id = id });
    }

    /// <summary>
    /// Obtiene el detalle completo de un pedido con cliente, usuario y productos.
    /// </summary>
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
