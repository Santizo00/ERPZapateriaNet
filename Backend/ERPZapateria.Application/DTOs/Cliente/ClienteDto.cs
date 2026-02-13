namespace ERPZapateria.Application.DTOs.Cliente;

/// <summary>
/// Informacion de un cliente.
/// </summary>
public class ClienteDto
{
    /// <summary>ID del cliente.</summary>
    public int IdCliente { get; set; }

    /// <summary>Nombre del cliente.</summary>
    public string Nombre { get; set; } = string.Empty;

    /// <summary>NIT del cliente.</summary>
    public string? NIT { get; set; }

    /// <summary>Correo electronico.</summary>
    public string? Email { get; set; }

    /// <summary>Numero de telefono.</summary>
    public string? Telefono { get; set; }

    /// <summary>Dirección.</summary>
    public string? Direccion { get; set; }

    /// <summary>Indica si esta activo.</summary>
    public bool Activo { get; set; }
}
