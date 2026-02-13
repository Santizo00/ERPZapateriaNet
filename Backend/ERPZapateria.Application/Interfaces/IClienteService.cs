using ERPZapateria.Application.DTOs.Cliente;

namespace ERPZapateria.Application.Interfaces;

/// <summary>
/// Servicio de consulta de clientes.
/// </summary>
public interface IClienteService
{
    /// <summary>Obtiene todos los clientes.</summary>
    Task<IEnumerable<ClienteDto>> GetAllAsync();

    /// <summary>Obtiene un cliente por ID.</summary>
    Task<ClienteDto?> GetByIdAsync(int id);
}
