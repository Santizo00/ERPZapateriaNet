namespace ERPZapateria.Application.DTOs.Pedido;

/// <summary>
/// Informacion completa de un pedido con cliente, usuario y detalle.
/// </summary>
public class PedidoDetalleResponseDto
{
    /// <summary>ID del pedido.</summary>
    public int IdPedido { get; set; }

    /// <summary>ID del cliente.</summary>
    public int IdCliente { get; set; }

    /// <summary>Nombre del cliente.</summary>
    public string ClienteNombre { get; set; } = string.Empty;

    /// <summary>NIT del cliente.</summary>
    public string? ClienteNIT { get; set; }

    /// <summary>ID del usuario (vendedor).</summary>
    public int IdUsuario { get; set; }

    /// <summary>Nombre del usuario.</summary>
    public string UsuarioNombre { get; set; } = string.Empty;

    /// <summary>Fecha del pedido.</summary>
    public DateTime Fecha { get; set; }

    /// <summary>Total del pedido.</summary>
    public decimal Total { get; set; }

    /// <summary>Estado del pedido (Pendiente, Completado).</summary>
    public string Estado { get; set; } = string.Empty;

    /// <summary>Items del pedido.</summary>
    public List<PedidoDetalleItemDto> Detalle { get; set; } = new();
}
