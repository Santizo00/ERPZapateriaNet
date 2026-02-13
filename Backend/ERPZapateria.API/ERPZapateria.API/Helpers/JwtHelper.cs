using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ERPZapateria.API.Helpers;

/// <summary>
/// Helper para generación y manejo de tokens JWT.
/// </summary>
public static class JwtHelper
{
    /// <summary>
    /// Genera un token JWT con las credenciales del usuario.
    /// </summary>
    /// <param name="idUsuario">ID del usuario autenticado</param>
    /// <param name="username">Nombre de usuario</param>
    /// <param name="rol">Rol del usuario (Admin, Vendedor)</param>
    /// <param name="configuration">Configuración de la aplicación para obtener claves JWT</param>
    /// <returns>Token JWT firmado</returns>
    public static string GenerateToken(
        int idUsuario,
        string username,
        string rol,
        IConfiguration configuration)
    {
        // Obtener configuración JWT desde appsettings
        var jwtSettings = configuration.GetSection("Jwt");

        // Crear clave simétrica para firmar token
        var keyBytes = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);
        var key = new SymmetricSecurityKey(keyBytes);

        // Crear credenciales de firma
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        // Agregar claims (datos) al token
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, idUsuario.ToString()),
            new Claim(ClaimTypes.Name, username),
            new Claim(ClaimTypes.Role, rol)
        };

        // Crear token JWT con configuración
        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(
                Convert.ToDouble(jwtSettings["ExpireMinutes"])
            ),
            signingCredentials: credentials
        );

        // Convertir token a string
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

