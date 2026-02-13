namespace ERPZapateria.Application.DTOs.Pedido;

public class PedidoDetalleDto
{
    public int IdProducto { get; set; }
    public int Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
}
