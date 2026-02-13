using ERPZapateria.Application.DTOs.Pedido;

namespace ERPZapateria.Application.Interfaces;

/// <summary>
/// Servicio CRUD de pedidos.
/// </summary>
public interface IPedidoService
{
    /// <summary>Crea un nuevo pedido.</summary>
    Task<int> CrearPedidoAsync(CreatePedidoDto dto);

    /// <summary>Obtiene todos los pedidos.</summary>
    Task<IEnumerable<object>> GetAllAsync();
    
    /// <summary>Obtiene un pedido por ID.</summary>
    Task<object?> GetByIdAsync(int id);

    /// <summary>Obtiene el detalle completo de un pedido.</summary>
    Task<PedidoDetalleResponseDto?> GetDetalleByIdAsync(int id);
}
