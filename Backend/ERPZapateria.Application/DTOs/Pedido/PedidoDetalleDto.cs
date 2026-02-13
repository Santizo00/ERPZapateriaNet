namespace ERPZapateria.Application.DTOs.Pedido;

/// <summary>
/// DTO para detalles de línea de pedido.
/// Representa un producto individual en un pedido.
/// </summary>
public class PedidoDetalleDto
{
    /// <summary>Identificador del producto. Campo requerido.</summary>
    public int IdProducto { get; set; }

    /// <summary>Cantidad solicitada. Debe ser mayor que cero.</summary>
    public int Cantidad { get; set; }

    /// <summary>Precio unitario en el momento del pedido.</summary>
    public decimal PrecioUnitario { get; set; }
}
