namespace ERPZapateria.Application.DTOs.Pedido;

/// <summary>
/// Representa un artículo individual del detalle de un pedido.
/// Contiene información del producto y subtotal calculado.
/// </summary>
public class PedidoDetalleItemDto
{
    /// <summary>Identificador del producto.</summary>
    public int IdProducto { get; set; }

    /// <summary>Nombre del producto.</summary>
    public string ProductoNombre { get; set; } = string.Empty;

    /// <summary>Cantidad solicitada.</summary>
    public int Cantidad { get; set; }

    /// <summary>Precio unitario en el momento del pedido.</summary>
    public decimal PrecioUnitario { get; set; }

    /// <summary>Subtotal calculado (Cantidad × PrecioUnitario).</summary>
    public decimal Subtotal { get; set; }
}
