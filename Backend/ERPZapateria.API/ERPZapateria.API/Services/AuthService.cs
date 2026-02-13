using Dapper;
using ERPZapateria.Application.DTOs.Auth;
using ERPZapateria.Application.Interfaces;
using ERPZapateria.API.Helpers;
using Microsoft.Extensions.Configuration;
using System.Data;
using BCrypt.Net;

namespace ERPZapateria.API.Services;

public class AuthService : IAuthService
{
    private readonly IDbConnection _connection;
    private readonly IConfiguration _configuration;

    public AuthService(IDbConnection connection, IConfiguration configuration)
    {
        _connection = connection;
        _configuration = configuration;
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto request)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@Username", request.Username);

        var user = await _connection.QueryFirstOrDefaultAsync<AuthUser>(
            "sp_LoginUsuario",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        if (user == null)
            return null;

        // Validar contraseña con BCrypt
        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return null;

        // Generar JWT
        var token = JwtHelper.GenerateToken(user.IdUsuario, user.Username, user.Rol, _configuration);

        return new LoginResponseDto
        {
            IdUsuario = user.IdUsuario,
            Username = user.Username,
            Rol = user.Rol,
            Token = token
        };
    }

    public async Task<bool> RegisterAsync(RegisterRequestDto request)
    {
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        var query = @"
        INSERT INTO Usuarios (Username, PasswordHash, IdRol, Activo, FechaCreacion)
        VALUES (@Username, @PasswordHash, @IdRol, 1, GETDATE())";

        var rows = await _connection.ExecuteAsync(query, new
        {
            request.Username,
            PasswordHash = passwordHash,
            request.IdRol
        });

        return rows > 0;
    }


    // Modelo interno solo para mapear SP
    private class AuthUser
    {
        public int IdUsuario { get; set; }
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Rol { get; set; } = string.Empty;
    }
}
