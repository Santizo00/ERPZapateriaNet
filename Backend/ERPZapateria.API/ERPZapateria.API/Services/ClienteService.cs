using Dapper;
using ERPZapateria.Application.DTOs.Cliente;
using ERPZapateria.Application.Interfaces;
using System.Data;

namespace ERPZapateria.API.Services;

public class ClienteService : IClienteService
{
    private readonly IDbConnection _connection;

    public ClienteService(IDbConnection connection)
    {
        _connection = connection;
    }

    public async Task<IEnumerable<ClienteDto>> GetAllAsync()
    {
        var query = @"
            SELECT IdCliente, Nombre, NIT, Email, Telefono, Direccion, Activo
            FROM Clientes
            WHERE Activo = 1
            ORDER BY Nombre";

        return await _connection.QueryAsync<ClienteDto>(query);
    }

    public async Task<ClienteDto?> GetByIdAsync(int id)
    {
        var query = @"
            SELECT IdCliente, Nombre, NIT, Email, Telefono, Direccion, Activo
            FROM Clientes
            WHERE IdCliente = @Id AND Activo = 1";

        return await _connection.QueryFirstOrDefaultAsync<ClienteDto>(query, new { Id = id });
    }
}
