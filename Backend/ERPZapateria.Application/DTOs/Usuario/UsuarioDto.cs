namespace ERPZapateria.Application.DTOs.Usuario;

/// <summary>
/// DTO para información del usuario.
/// Se utiliza para transferir datos del usuario sin incluir información sensible de contraseña.
/// </summary>
public class UsuarioDto
{
    /// <summary>Identificador del usuario.</summary>
    public int IdUsuario { get; set; }

    /// <summary>Nombre de usuario.</summary>
    public string Username { get; set; } = string.Empty;

    /// <summary>Identificador del rol.</summary>
    public int IdRol { get; set; }

    /// <summary>Nombre del rol.</summary>
    public string Rol { get; set; } = string.Empty;

    /// <summary>Indica si el usuario está activo.</summary>
    public bool Activo { get; set; }

    /// <summary>Fecha de creación del usuario.</summary>
    public DateTime FechaCreacion { get; set; }
}
