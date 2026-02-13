using ERPZapateria.Application.DTOs.Usuario;

namespace ERPZapateria.Application.Interfaces;

/// <summary>
/// Servicio CRUD de usuarios.
/// </summary>
public interface IUsuarioService
{
    /// <summary>Obtiene todos los usuarios.</summary>
    Task<IEnumerable<UsuarioDto>> GetAllAsync();

    /// <summary>Obtiene un usuario por ID.</summary>
    Task<UsuarioDto?> GetByIdAsync(int id);

    /// <summary>Crea un nuevo usuario.</summary>
    Task<int> CreateAsync(CreateUsuarioDto dto);

    /// <summary>Actualiza un usuario existente.</summary>
    Task<bool> UpdateAsync(int id, UpdateUsuarioDto dto);

    /// <summary>Elimina (desactiva) un usuario.</summary>
    Task<bool> DeleteAsync(int id);
}
