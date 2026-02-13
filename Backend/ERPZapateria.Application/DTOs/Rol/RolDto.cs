namespace ERPZapateria.Application.DTOs.Rol;

/// <summary>
/// Informacion de un rol del sistema.
/// </summary>
public class RolDto
{
    /// <summary>ID del rol.</summary>
    public int IdRol { get; set; }

    /// <summary>Nombre del rol (Admin, Vendedor).</summary>
    public string Nombre { get; set; } = string.Empty;

    /// <summary>Indica si esta activo.</summary>
    public bool Activo { get; set; }
}
