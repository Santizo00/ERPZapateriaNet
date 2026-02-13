namespace ERPZapateria.Application.DTOs.Pedido;

/// <summary>
/// Datos para crear un nuevo pedido.
/// </summary>
public class CreatePedidoDto
{
    /// <summary>ID del cliente.</summary>
    public int IdCliente { get; set; }

    /// <summary>ID del usuario (vendedor).</summary>
    public int IdUsuario { get; set; }

    /// <summary>Detalle de productos del pedido.</summary>
    public List<PedidoDetalleDto> Detalle { get; set; } = new();
}
