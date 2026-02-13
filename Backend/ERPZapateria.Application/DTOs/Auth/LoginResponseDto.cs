namespace ERPZapateria.Application.DTOs.Auth;

/// <summary>
/// Respuesta de autenticacion exitosa con token JWT.
/// </summary>
public class LoginResponseDto
{
    /// <summary>ID del usuario.</summary>
    public int IdUsuario { get; set; }

    /// <summary>Nombre de usuario.</summary>
    public string Username { get; set; } = string.Empty;

    /// <summary>Rol asignado (Admin, Vendedor).</summary>
    public string Rol { get; set; } = string.Empty;

    /// <summary>Token JWT.</summary>
    public string Token { get; set; } = string.Empty;
}
