using ERPZapateria.Application.DTOs.Usuario;

namespace ERPZapateria.Application.Interfaces;

public interface IUsuarioService
{
    Task<IEnumerable<UsuarioDto>> GetAllAsync();
    Task<UsuarioDto?> GetByIdAsync(int id);
    Task<int> CreateAsync(CreateUsuarioDto dto);
    Task<bool> UpdateAsync(int id, UpdateUsuarioDto dto);
    Task<bool> DeleteAsync(int id);
}
