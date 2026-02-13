using ERPZapateria.Application.DTOs.Cliente;

namespace ERPZapateria.Application.Interfaces;

public interface IClienteService
{
    Task<IEnumerable<ClienteDto>> GetAllAsync();
    Task<ClienteDto?> GetByIdAsync(int id);
}
