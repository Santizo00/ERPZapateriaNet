using Dapper;
using ERPZapateria.Application.DTOs.Pedido;
using ERPZapateria.Application.Interfaces;
using System.Data;

namespace ERPZapateria.API.Services;

public class PedidoService : IPedidoService
{
    private readonly IDbConnection _connection;

    public PedidoService(IDbConnection connection)
    {
        _connection = connection;
    }

    public async Task<int> CrearPedidoAsync(CreatePedidoDto dto)
    {
        var table = new DataTable();
        table.Columns.Add("IdProducto", typeof(int));
        table.Columns.Add("Cantidad", typeof(int));
        table.Columns.Add("PrecioUnitario", typeof(decimal));

        foreach (var item in dto.Detalle)
        {
            table.Rows.Add(item.IdProducto, item.Cantidad, item.PrecioUnitario);
        }

        var parameters = new DynamicParameters();
        parameters.Add("@IdCliente", dto.IdCliente);
        parameters.Add("@IdUsuario", dto.IdUsuario);
        parameters.Add("@Detalle", table.AsTableValuedParameter("PedidoDetalleType"));

        return await _connection.ExecuteScalarAsync<int>(
            "sp_CrearPedido",
            parameters,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<IEnumerable<object>> GetAllAsync()
    {
        var query = @"
        SELECT IdPedido, IdCliente, IdUsuario, Fecha, Total, Estado
        FROM Pedidos";

        return await _connection.QueryAsync(query);
    }

    public async Task<object?> GetByIdAsync(int id)
    {
        var query = @"
        SELECT IdPedido, IdCliente, IdUsuario, Fecha, Total, Estado
        FROM Pedidos
        WHERE IdPedido = @Id";

        return await _connection.QueryFirstOrDefaultAsync(query, new { Id = id });
    }

}
