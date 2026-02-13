using ERPZapateria.Application.DTOs.Producto;

namespace ERPZapateria.Application.Interfaces;

public interface IProductoService
{
    Task<IEnumerable<ProductoDto>> GetAllAsync();
    Task<ProductoDto?> GetByIdAsync(int id);
    Task<int> CreateAsync(CreateProductoDto dto);
    Task<bool> UpdateAsync(int id, CreateProductoDto dto);
    Task<bool> DeleteAsync(int id);
}
