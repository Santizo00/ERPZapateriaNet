using Dapper;
using ERPZapateria.Application.DTOs.Rol;
using ERPZapateria.Application.Interfaces;
using System.Data;

namespace ERPZapateria.API.Services;

public class RolService : IRolService
{
    private readonly IDbConnection _connection;

    public RolService(IDbConnection connection)
    {
        _connection = connection;
    }

    public async Task<IEnumerable<RolDto>> GetAllAsync()
    {
        var query = @"
            SELECT IdRol, Nombre, Activo
            FROM Roles
            WHERE Activo = 1
            ORDER BY Nombre";

        return await _connection.QueryAsync<RolDto>(query);
    }

    public async Task<RolDto?> GetByIdAsync(int id)
    {
        var query = @"
            SELECT IdRol, Nombre, Activo
            FROM Roles
            WHERE IdRol = @Id";

        return await _connection.QueryFirstOrDefaultAsync<RolDto>(query, new { Id = id });
    }
}
