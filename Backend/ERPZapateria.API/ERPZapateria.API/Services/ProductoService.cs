using Dapper;
using ERPZapateria.Application.DTOs.Producto;
using ERPZapateria.Application.Interfaces;
using System.Data;

namespace ERPZapateria.API.Services;

/// <summary>
/// Service for managing products.
/// Implements business logic for product CRUD operations.
/// Uses Dapper ORM for database access.
/// </summary>
public class ProductoService : IProductoService
{
    private readonly IDbConnection _connection;

    /// <summary>Initializes a new instance of the ProductoService class.</summary>
    /// <param name="connection">The database connection dependency.</param>
    public ProductoService(IDbConnection connection)
    {
        _connection = connection;
    }

    /// <summary>
    /// Retrieves all active products with their available stock.
    /// </summary>
    /// <returns>An enumerable collection of active products.</returns>
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
    /// Retrieves a specific product by ID with its available stock.
    /// </summary>
    /// <param name="id">The product identifier.</param>
    /// <returns>The product if found; null otherwise.</returns>
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
    /// Creates a new product with initial inventory.
    /// Inserts product record and creates initial inventory entry.
    /// </summary>
    /// <param name="dto">The product creation data transfer object.</param>
    /// <returns>The ID of the newly created product.</returns>
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
    /// Performs a soft delete on a product by marking it as inactive.
    /// </summary>
    /// <param name="id">The product identifier to delete.</param>
    /// <returns>True if the product was deleted; false if the product was not found.</returns>
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
