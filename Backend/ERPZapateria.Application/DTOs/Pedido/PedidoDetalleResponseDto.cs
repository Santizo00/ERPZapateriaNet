namespace ERPZapateria.Application.DTOs.Pedido;

/// <summary>
/// DTO para información detallada del pedido.
/// Contiene información completa del pedido incluyendo cliente, usuario, artículos y totales.
/// </summary>
public class PedidoDetalleResponseDto
{
    /// <summary>Identificador del pedido.</summary>
    public int IdPedido { get; set; }

    /// <summary>Identificador del cliente.</summary>
    public int IdCliente { get; set; }

    /// <summary>Nombre del cliente.</summary>
    public string ClienteNombre { get; set; } = string.Empty;

    /// <summary>NIT del cliente (identificación tributaria).</summary>
    public string? ClienteNIT { get; set; }

    /// <summary>Identificador del usuario (vendedor).</summary>
    public int IdUsuario { get; set; }

    /// <summary>Nombre del usuario (vendedor).</summary>
    public string UsuarioNombre { get; set; } = string.Empty;

    /// <summary>Fecha del pedido.</summary>
    public DateTime Fecha { get; set; }

    /// <summary>Monto total del pedido.</summary>
    public decimal Total { get; set; }

    /// <summary>Estado del pedido (ej: Pendiente, Entregado).</summary>
    public string Estado { get; set; } = string.Empty;

    /// <summary>Colección de artículos del pedido.</summary>
    public List<PedidoDetalleItemDto> Detalle { get; set; } = new();
}
