namespace ERPZapateria.Application.DTOs.Usuario;

/// <summary>
/// Informacion de un usuario del sistema.
/// </summary>
public class UsuarioDto
{
    /// <summary>ID del usuario.</summary>
    public int IdUsuario { get; set; }

    /// <summary>Nombre de usuario.</summary>
    public string Username { get; set; } = string.Empty;

    /// <summary>ID del rol.</summary>
    public int IdRol { get; set; }

    /// <summary>Nombre del rol.</summary>
    public string Rol { get; set; } = string.Empty;

    /// <summary>Indica si esta activo.</summary>
    public bool Activo { get; set; }

    /// <summary>Fecha de creacion.</summary>
    public DateTime FechaCreacion { get; set; }
}
