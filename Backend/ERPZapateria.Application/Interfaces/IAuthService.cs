using ERPZapateria.Application.DTOs.Auth;

namespace ERPZapateria.Application.Interfaces;

/// <summary>
/// Servicio de autenticacion.
/// </summary>
public interface IAuthService
{
    /// <summary>Autentica un usuario.</summary>
    Task<LoginResponseDto?> LoginAsync(LoginRequestDto request);

    /// <summary>Registra un nuevo usuario.</summary>
    Task<bool> RegisterAsync(RegisterRequestDto request);
}
