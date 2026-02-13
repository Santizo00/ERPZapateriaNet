using Dapper;
using ERPZapateria.Application.DTOs.Producto;
using ERPZapateria.Application.Interfaces;
using System.Data;

namespace ERPZapateria.API.Services;

/// <summary>
/// Servicio de gestion de productos.
/// </summary>
public class ProductoService : IProductoService
{
    private readonly IDbConnection _connection;

    public ProductoService(IDbConnection connection)
    {
        _connection = connection;
    }

    /// <summary>
    /// Obtiene todos los productos activos con stock.
    /// </summary>
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

    /// <summary>
    /// Obtiene un producto por ID con stock.
    /// </summary>
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

    /// <summary>
    /// Crea un nuevo producto con inventario inicial.
    /// </summary>
    public async Task<int> CreateAsync(CreateProductoDto dto)
    {
        var query = @"
            INSERT INTO Productos (Nombre, Descripcion, Precio, IdCategoria, StockMinimo)
            VALUES (@Nombre, @Descripcion, @Precio, 1, @StockMinimo);
            SELECT CAST(SCOPE_IDENTITY() as int);";

        var id = await _connection.ExecuteScalarAsync<int>(query, dto);

        // Create initial inventory entry after product creation
        await _connection.ExecuteAsync(@"
            INSERT INTO Inventario (IdProducto, CantidadDisponible)
            VALUES (@IdProducto, @Stock)", new { IdProducto = id, dto.Stock });

        return id;
    }

    /// <summary>
    /// Updates an existing product and its inventory level.
    /// </summary>
    /// <param name="id">The product identifier to update.</param>
    /// <param name="dto">The updated product data transfer object.</param>
    /// <returns>True if the product was updated; false if the product was not found.</returns>
    public async Task<bool> UpdateAsync(int id, CreateProductoDto dto)
    {
        var query = @"
            UPDATE Productos
            SET Nombre = @Nombre,
                Descripcion = @Descripcion,
                Precio = @Precio,
                StockMinimo = @StockMinimo
            WHERE IdProducto = @Id";

        var rows = await _connection.ExecuteAsync(query, new
        {
            Id = id,
            dto.Nombre,
            dto.Descripcion,
            dto.Precio,
            dto.StockMinimo
        });

        // Update inventory if product was found
        if (rows > 0)
        {
            await _connection.ExecuteAsync(@"
                UPDATE Inventario
                SET CantidadDisponible = @Stock
                WHERE IdProducto = @Id", new { Id = id, dto.Stock });
        }

        return rows > 0;
    }

    /// <summary>
    /// Elimina un producto (marca como inactivo).
    /// </summary>
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
