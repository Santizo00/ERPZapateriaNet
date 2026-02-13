namespace ERPZapateria.Application.DTOs.Pedido;

/// <summary>
/// DTO para crear un nuevo pedido.
/// Contiene detalles del cliente, usuario y artículos del pedido.
/// </summary>
public class CreatePedidoDto
{
    /// <summary>Identificador del cliente. Campo requerido.</summary>
    public int IdCliente { get; set; }

    /// <summary>Identificador del usuario (vendedor). Campo requerido.</summary>
    public int IdUsuario { get; set; }

    /// <summary>Detalles de los artículos del pedido. Se requiere al menos un artículo.</summary>
    public List<PedidoDetalleDto> Detalle { get; set; } = new();
}
