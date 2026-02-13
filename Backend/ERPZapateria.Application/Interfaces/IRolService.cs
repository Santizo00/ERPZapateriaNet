using ERPZapateria.Application.DTOs.Rol;

namespace ERPZapateria.Application.Interfaces;

public interface IRolService
{
    Task<IEnumerable<RolDto>> GetAllAsync();
    Task<RolDto?> GetByIdAsync(int id);
}
