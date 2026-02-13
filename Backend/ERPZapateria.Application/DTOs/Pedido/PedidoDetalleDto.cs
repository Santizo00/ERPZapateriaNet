namespace ERPZapateria.Application.DTOs.Pedido;

/// <summary>
/// Item individual de un pedido.
/// </summary>
public class PedidoDetalleDto
{
    /// <summary>ID del producto.</summary>
    public int IdProducto { get; set; }

    /// <summary>Cantidad solicitada.</summary>
    public int Cantidad { get; set; }

    /// <summary>Precio unitario del producto.</summary>
    public decimal PrecioUnitario { get; set; }
}
