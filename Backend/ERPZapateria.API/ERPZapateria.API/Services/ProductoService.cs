using Dapper;
using ERPZapateria.Application.DTOs.Producto;
using ERPZapateria.Application.Interfaces;
using System.Data;

namespace ERPZapateria.API.Services;

public class ProductoService : IProductoService
{
    private readonly IDbConnection _connection;

    public ProductoService(IDbConnection connection)
    {
        _connection = connection;
    }

    public async Task<IEnumerable<ProductoDto>> GetAllAsync()
    {
        var query = @"
            SELECT p.IdProducto, p.Nombre, p.Descripcion, p.Precio,
                   i.CantidadDisponible AS StockDisponible
            FROM Productos p
            INNER JOIN Inventario i ON p.IdProducto = i.IdProducto
            WHERE p.Activo = 1";

        return await _connection.QueryAsync<ProductoDto>(query);
    }

    public async Task<ProductoDto?> GetByIdAsync(int id)
    {
        var query = @"
            SELECT p.IdProducto, p.Nombre, p.Descripcion, p.Precio,
                   i.CantidadDisponible AS StockDisponible
            FROM Productos p
            INNER JOIN Inventario i ON p.IdProducto = i.IdProducto
            WHERE p.IdProducto = @Id";

        return await _connection.QueryFirstOrDefaultAsync<ProductoDto>(query, new { Id = id });
    }

    public async Task<int> CreateAsync(CreateProductoDto dto)
    {
        var query = @"
            INSERT INTO Productos (Nombre, Descripcion, Precio, IdCategoria)
            VALUES (@Nombre, @Descripcion, @Precio, 1);
            SELECT CAST(SCOPE_IDENTITY() as int);";

        var id = await _connection.ExecuteScalarAsync<int>(query, dto);

        await _connection.ExecuteAsync(@"
            INSERT INTO Inventario (IdProducto, CantidadDisponible)
            VALUES (@IdProducto, 0)", new { IdProducto = id });

        return id;
    }

    public async Task<bool> UpdateAsync(int id, CreateProductoDto dto)
    {
        var query = @"
            UPDATE Productos
            SET Nombre = @Nombre,
                Descripcion = @Descripcion,
                Precio = @Precio
            WHERE IdProducto = @Id";

        var rows = await _connection.ExecuteAsync(query, new
        {
            Id = id,
            dto.Nombre,
            dto.Descripcion,
            dto.Precio
        });

        return rows > 0;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var query = @"
            UPDATE Productos
            SET Activo = 0
            WHERE IdProducto = @Id";

        var rows = await _connection.ExecuteAsync(query, new { Id = id });
        return rows > 0;
    }
}
