namespace ERPZapateria.Application.DTOs.Auth;

/// <summary>
/// Representa la respuesta devuelta después de la autenticación exitosa del usuario.
/// Contiene información del usuario y token JWT para acceso a la API.
/// </summary>
public class LoginResponseDto
{
    /// <summary>Identificador del usuario.</summary>
    public int IdUsuario { get; set; }

    /// <summary>Nombre de usuario utilizado para autenticación.</summary>
    public string Username { get; set; } = string.Empty;

    /// <summary>Rol del usuario (ej: Admin, Vendedor).</summary>
    public string Rol { get; set; } = string.Empty;

    /// <summary>Token JWT para autenticación en la API.</summary>
    public string Token { get; set; } = string.Empty;
}
