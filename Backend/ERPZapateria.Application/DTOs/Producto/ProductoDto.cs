namespace ERPZapateria.Application.DTOs.Producto;

/// <summary>
/// Representa un producto en el sistema.
/// Se utiliza para transferir información del producto desde la API a los clientes.
/// </summary>
public class ProductoDto
{
    /// <summary>Identificador del producto.</summary>
    public int IdProducto { get; set; }

    /// <summary>Nombre del producto.</summary>
    public string Nombre { get; set; } = string.Empty;

    /// <summary>Descripción del producto.</summary>
    public string? Descripcion { get; set; }

    /// <summary>Precio del producto.</summary>
    public decimal Precio { get; set; }

    /// <summary>Cantidad de stock disponible.</summary>
    public int StockDisponible { get; set; }
}
