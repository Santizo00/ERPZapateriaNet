/// <summary>
/// Datos para registrar un nuevo usuario.
/// </summary>
public class RegisterRequestDto
{
    /// <summary>Nombre de usuario.</summary>
    public string Username { get; set; } = string.Empty;

    /// <summary>Contraseña.</summary>
    public string Password { get; set; } = string.Empty;

    /// <summary>ID del rol a asignar.</summary>
    public int IdRol { get; set; }
}
