using ERPZapateria.Application.DTOs.Pedido;

namespace ERPZapateria.Application.Interfaces;

public interface IPedidoService
{
    Task<int> CrearPedidoAsync(CreatePedidoDto dto);
}
