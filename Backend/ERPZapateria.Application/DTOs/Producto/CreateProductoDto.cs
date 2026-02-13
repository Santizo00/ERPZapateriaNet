namespace ERPZapateria.Application.DTOs.Producto;

/// <summary>
/// Datos para crear o actualizar un producto.
/// </summary>
public class CreateProductoDto
{
    /// <summary>Nombre del producto.</summary>
    public string Nombre { get; set; } = string.Empty;

    /// <summary>Descripcion opcional.</summary>
    public string? Descripcion { get; set; }

    /// <summary>Precio del producto.</summary>
    public decimal Precio { get; set; }

    /// <summary>Cantidad de stock inicial.</summary>
    public int Stock { get; set; } = 0;

    /// <summary>Stock minimo para alertas.</summary>
    public int StockMinimo { get; set; } = 0;
}
