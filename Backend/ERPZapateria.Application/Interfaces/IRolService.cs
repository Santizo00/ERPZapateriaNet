using ERPZapateria.Application.DTOs.Rol;

namespace ERPZapateria.Application.Interfaces;

/// <summary>
/// Servicio de consulta de roles.
/// </summary>
public interface IRolService
{
    /// <summary>Obtiene todos los roles.</summary>
    Task<IEnumerable<RolDto>> GetAllAsync();

    /// <summary>Obtiene un rol por ID.</summary>
    Task<RolDto?> GetByIdAsync(int id);
}
