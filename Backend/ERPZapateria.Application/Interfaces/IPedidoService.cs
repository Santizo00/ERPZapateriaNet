using ERPZapateria.Application.DTOs.Pedido;

namespace ERPZapateria.Application.Interfaces;

public interface IPedidoService
{
    Task<int> CrearPedidoAsync(CreatePedidoDto dto);

    Task<IEnumerable<object>> GetAllAsync();
    
    Task<object?> GetByIdAsync(int id);

    Task<PedidoDetalleResponseDto?> GetDetalleByIdAsync(int id);

}
