namespace ERPZapateria.Application.DTOs.Cliente;

/// <summary>
/// DTO para información de clientes.
/// Contiene todos los detalles del cliente para visualización y gestión.
/// </summary>
public class ClienteDto
{
    /// <summary>Identificador del cliente.</summary>
    public int IdCliente { get; set; }

    /// <summary>Nombre del cliente.</summary>
    public string Nombre { get; set; } = string.Empty;

    /// <summary>NIT del cliente (identificación tributaria).</summary>
    public string? NIT { get; set; }

    /// <summary>Correo electrónico del cliente.</summary>
    public string? Email { get; set; }

    /// <summary>Número de teléfono del cliente.</summary>
    public string? Telefono { get; set; }

    /// <summary>Dirección del cliente.</summary>
    public string? Direccion { get; set; }

    /// <summary>Indica si el cliente está activo.</summary>
    public bool Activo { get; set; }
}
