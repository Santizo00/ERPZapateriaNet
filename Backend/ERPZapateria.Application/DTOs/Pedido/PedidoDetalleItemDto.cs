namespace ERPZapateria.Application.DTOs.Pedido;

/// <summary>
/// Item individual del detalle de un pedido con informacion de producto.
/// </summary>
public class PedidoDetalleItemDto
{
    /// <summary>ID del producto.</summary>
    public int IdProducto { get; set; }

    /// <summary>Nombre del producto.</summary>
    public string ProductoNombre { get; set; } = string.Empty;

    /// <summary>Cantidad solicitada.</summary>
    public int Cantidad { get; set; }

    /// <summary>Precio unitario.</summary>
    public decimal PrecioUnitario { get; set; }

    /// <summary>Subtotal (Cantidad × PrecioUnitario).</summary>
    public decimal Subtotal { get; set; }
}
