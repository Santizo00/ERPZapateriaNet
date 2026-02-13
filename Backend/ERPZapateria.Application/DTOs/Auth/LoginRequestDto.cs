namespace ERPZapateria.Application.DTOs.Auth;

/// <summary>
/// Credenciales de autenticacion del usuario.
/// </summary>
public class LoginRequestDto
{
    /// <summary>Nombre de usuario.</summary>
    public string Username { get; set; } = string.Empty;

    /// <summary>Contraseña.</summary>
    public string Password { get; set; } = string.Empty;
}
