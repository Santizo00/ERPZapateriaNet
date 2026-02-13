namespace ERPZapateria.Application.DTOs.Producto;

/// <summary>
/// Informacion de un producto.
/// </summary>
public class ProductoDto
{
    /// <summary>ID del producto.</summary>
    public int IdProducto { get; set; }

    /// <summary>Nombre del producto.</summary>
    public string Nombre { get; set; } = string.Empty;

    /// <summary>Descripcion del producto.</summary>
    public string? Descripcion { get; set; }

    /// <summary>Precio del producto.</summary>
    public decimal Precio { get; set; }

    /// <summary>Stock disponible.</summary>
    public int StockDisponible { get; set; }
}
