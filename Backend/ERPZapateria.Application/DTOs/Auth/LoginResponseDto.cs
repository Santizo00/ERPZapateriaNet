namespace ERPZapateria.Application.DTOs.Auth;

public class LoginResponseDto
{
    public int IdUsuario { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Rol { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
}
