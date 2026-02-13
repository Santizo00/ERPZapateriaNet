using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ERPZapateria.API.Helpers;

public static class JwtHelper
{
    public static string GenerateToken(
        int idUsuario,
        string username,
        string rol,
        IConfiguration configuration)
    {
        var jwtSettings = configuration.GetSection("Jwt");

        var keyBytes = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);
        var key = new SymmetricSecurityKey(keyBytes);

        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, idUsuario.ToString()),
            new Claim(ClaimTypes.Name, username),
            new Claim(ClaimTypes.Role, rol)
        };

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(
                Convert.ToDouble(jwtSettings["ExpireMinutes"])
            ),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

