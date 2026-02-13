namespace ERPZapateria.Application.DTOs.Pedido;

public class CreatePedidoDto
{
    public int IdCliente { get; set; }
    public int IdUsuario { get; set; }
    public List<PedidoDetalleDto> Detalle { get; set; } = new();
}
