namespace ERPZapateria.Application.DTOs.Usuario;

/// <summary>
/// DTO para actualizar un usuario existente.
/// La contraseña es opcional para permitir actualizaciones sin cambiarla.
/// </summary>
public class UpdateUsuarioDto
{
    /// <summary>Nombre de usuario. Campo requerido.</summary>
    public string Username { get; set; } = string.Empty;

    /// <summary>Nueva contraseña. Opcional - si no se proporciona, la contraseña no cambia.</summary>
    public string? Password { get; set; }

    /// <summary>Identificador del rol. Campo requerido.</summary>
    public int IdRol { get; set; }

    /// <summary>Indica si el usuario está activo.</summary>
    public bool Activo { get; set; } = true;
}
