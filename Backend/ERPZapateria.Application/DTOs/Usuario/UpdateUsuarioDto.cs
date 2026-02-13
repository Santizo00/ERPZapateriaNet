namespace ERPZapateria.Application.DTOs.Usuario;

/// <summary>
/// Datos para actualizar un usuario existente.
/// </summary>
public class UpdateUsuarioDto
{
    /// <summary>Nombre de usuario.</summary>
    public string Username { get; set; } = string.Empty;

    /// <summary>Nueva contraseña (opcional, si no se envia no cambia).</summary>
    public string? Password { get; set; }

    /// <summary>ID del rol.</summary>
    public int IdRol { get; set; }

    /// <summary>Indica si esta activo.</summary>
    public bool Activo { get; set; } = true;
}
