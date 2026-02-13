using Dapper;
using ERPZapateria.Application.DTOs.Auth;
using ERPZapateria.Application.Interfaces;
using ERPZapateria.API.Helpers;
using Microsoft.Extensions.Configuration;
using System.Data;
using BCrypt.Net;

namespace ERPZapateria.API.Services;

/// <summary>
/// Servicio de autenticacion de usuarios.
/// </summary>
public class AuthService : IAuthService
{
    private readonly IDbConnection _connection;
    private readonly IConfiguration _configuration;

    public AuthService(IDbConnection connection, IConfiguration configuration)
    {
        _connection = connection;
        _configuration = configuration;
    }

    /// <summary>
    /// Valida credenciales y genera token JWT.
    /// </summary>
    public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto request)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@Username", request.Username);

        // Retrieve user from database via stored procedure
        var user = await _connection.QueryFirstOrDefaultAsync<AuthUser>(
            "sp_LoginUsuario",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        // User not found
        if (user == null)
            return null;

        // Validate password using BCrypt comparison
        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return null;

        // Generate JWT token with user claims
        var token = JwtHelper.GenerateToken(user.IdUsuario, user.Username, user.Rol, _configuration);

        return new LoginResponseDto
        {
            IdUsuario = user.IdUsuario,
            Username = user.Username,
            Rol = user.Rol,
            Token = token
        };
    }

    /// <summary>
    /// Registers a new user with username, hashed password, and role assignment.
    /// Passwords are hashed using BCrypt before storage.
    /// </summary>
    /// <param name="request">The registration request containing username, password, and role ID.</param>
    /// <returns>True if registration was successful; false otherwise.</returns>
    public async Task<bool> RegisterAsync(RegisterRequestDto request)
    {
        // Hash password using BCrypt
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

    /// <summary>
    /// Internal model for mapping stored procedure results.
    /// Used internally only for AuthService operations.
    /// </summary>
    private class AuthUser
    {
        public int IdUsuario { get; set; }
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Rol { get; set; } = string.Empty;
    }
}
