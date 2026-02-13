namespace ERPZapateria.Application.DTOs.Usuario;

/// <summary>
/// Datos para crear un nuevo usuario.
/// </summary>
public class CreateUsuarioDto
{
    /// <summary>Nombre de usuario (unico).</summary>
    public string Username { get; set; } = string.Empty;

    /// <summary>Contraseña (se hashea con BCrypt).</summary>
    public string Password { get; set; } = string.Empty;

    /// <summary>ID del rol a asignar.</summary>
    public int IdRol { get; set; }

    /// <summary>Indica si esta activo al crear.</summary>
    public bool Activo { get; set; } = true;
}
