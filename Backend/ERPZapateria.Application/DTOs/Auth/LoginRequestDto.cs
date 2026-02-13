namespace ERPZapateria.Application.DTOs.Auth;

/// <summary>
/// DTO para solicitud de login de usuario.
/// Contiene las credenciales requeridas para autenticar un usuario.
/// </summary>
public class LoginRequestDto
{
    /// <summary>Nombre de usuario. Campo requerido.</summary>
    public string Username { get; set; } = string.Empty;

    /// <summary>Contraseña del usuario. Campo requerido.</summary>
    public string Password { get; set; } = string.Empty;
}
