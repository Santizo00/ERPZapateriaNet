using Dapper;
using ERPZapateria.Application.DTOs.Usuario;
using ERPZapateria.Application.Interfaces;
using System.Data;
using BCrypt.Net;

namespace ERPZapateria.API.Services;

public class UsuarioService : IUsuarioService
{
    private readonly IDbConnection _connection;

    public UsuarioService(IDbConnection connection)
    {
        _connection = connection;
    }

    public async Task<IEnumerable<UsuarioDto>> GetAllAsync()
    {
        var query = @"
            SELECT u.IdUsuario, u.Username, u.IdRol, r.Nombre AS Rol, u.Activo, u.FechaCreacion
            FROM Usuarios u
            INNER JOIN Roles r ON u.IdRol = r.IdRol
            ORDER BY u.IdUsuario DESC";

        return await _connection.QueryAsync<UsuarioDto>(query);
    }

    public async Task<UsuarioDto?> GetByIdAsync(int id)
    {
        var query = @"
            SELECT u.IdUsuario, u.Username, u.IdRol, r.Nombre AS Rol, u.Activo, u.FechaCreacion
            FROM Usuarios u
            INNER JOIN Roles r ON u.IdRol = r.IdRol
            WHERE u.IdUsuario = @Id";

        return await _connection.QueryFirstOrDefaultAsync<UsuarioDto>(query, new { Id = id });
    }

    public async Task<int> CreateAsync(CreateUsuarioDto dto)
    {
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        var query = @"
            INSERT INTO Usuarios (Username, PasswordHash, IdRol, Activo, FechaCreacion)
            VALUES (@Username, @PasswordHash, @IdRol, @Activo, GETDATE());
            SELECT CAST(SCOPE_IDENTITY() as int);";

        return await _connection.ExecuteScalarAsync<int>(query, new
        {
            dto.Username,
            PasswordHash = passwordHash,
            dto.IdRol,
            dto.Activo
        });
    }

    public async Task<bool> UpdateAsync(int id, UpdateUsuarioDto dto)
    {
        var query = @"
            UPDATE Usuarios
            SET Username = @Username,
                IdRol = @IdRol,
                Activo = @Activo
            WHERE IdUsuario = @Id";

        var rows = await _connection.ExecuteAsync(query, new
        {
            Id = id,
            dto.Username,
            dto.IdRol,
            dto.Activo
        });

        if (!string.IsNullOrWhiteSpace(dto.Password))
        {
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            await _connection.ExecuteAsync(@"
                UPDATE Usuarios
                SET PasswordHash = @PasswordHash
                WHERE IdUsuario = @Id", new { Id = id, PasswordHash = passwordHash });
        }

        return rows > 0;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var query = @"
            UPDATE Usuarios
            SET Activo = 0
            WHERE IdUsuario = @Id";

        var rows = await _connection.ExecuteAsync(query, new { Id = id });

        return rows > 0;
    }
}
