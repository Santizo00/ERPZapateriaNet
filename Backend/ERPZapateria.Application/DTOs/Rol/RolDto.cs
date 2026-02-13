namespace ERPZapateria.Application.DTOs.Rol;

/// <summary>
/// DTO para información de roles.
/// Representa un rol de usuario con permisos en el sistema.
/// </summary>
public class RolDto
{
    /// <summary>Identificador del rol.</summary>
    public int IdRol { get; set; }

    /// <summary>Nombre del rol (ej: Admin, Vendedor).</summary>
    public string Nombre { get; set; } = string.Empty;

    /// <summary>Indica si el rol está activo.</summary>
    public bool Activo { get; set; }
}
