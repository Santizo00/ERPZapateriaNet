using ERPZapateria.Application.DTOs.Producto;

namespace ERPZapateria.Application.Interfaces;

/// <summary>
/// Servicio CRUD de productos.
/// </summary>
public interface IProductoService
{
    /// <summary>Obtiene todos los productos.</summary>
    Task<IEnumerable<ProductoDto>> GetAllAsync();

    /// <summary>Obtiene un producto por ID.</summary>
    Task<ProductoDto?> GetByIdAsync(int id);

    /// <summary>Crea un nuevo producto.</summary>
    Task<int> CreateAsync(CreateProductoDto dto);

    /// <summary>Actualiza un producto existente.</summary>
    Task<bool> UpdateAsync(int id, CreateProductoDto dto);
    
    /// <summary>Elimina (desactiva) un producto.</summary>
    Task<bool> DeleteAsync(int id);
}
