namespace ERPZapateria.Application.DTOs.Producto;

/// <summary>
/// DTO para crear o actualizar un producto.
/// Contiene toda la información necesaria para crear o modificar un producto en el sistema.
/// </summary>
public class CreateProductoDto
{
    /// <summary>Nombre del producto. Campo requerido.</summary>
    public string Nombre { get; set; } = string.Empty;

    /// <summary>Descripción del producto. Campo opcional.</summary>
    public string? Descripcion { get; set; }

    /// <summary>Precio del producto.</summary>
    public decimal Precio { get; set; }

    /// <summary>Cantidad inicial de stock.</summary>
    public int Stock { get; set; } = 0;

    /// <summary>Umbral mínimo de stock para alertas de inventario.</summary>
    public int StockMinimo { get; set; } = 0;
}
