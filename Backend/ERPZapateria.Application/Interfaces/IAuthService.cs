using ERPZapateria.Application.DTOs.Auth;

namespace ERPZapateria.Application.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(LoginRequestDto request);
}
