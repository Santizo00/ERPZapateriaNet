using System.Text;
using ERPZapateria.Application.Interfaces;
using ERPZapateria.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Data.SqlClient;
using Microsoft.OpenApi.Models;
using System.Data;

namespace ERPZapateria.API.Extensions;

/// <summary>
/// Extensiones para configurar servicios en la cadena de inyección de dependencias.
/// </summary>
public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Configura la conexión a la base de datos SQL Server.
    /// </summary>
    /// <param name="services">Colección de servicios</param>
    /// <param name="configuration">Configuración de la aplicación</param>
    /// <returns>Servicios configurados</returns>
    public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        // Registrar conexión SQL como servicio singleton por solicitud
        services.AddScoped<IDbConnection>(sp =>
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            return new SqlConnection(connectionString);
        });

        return services;
    }

    /// <summary>
    /// Registra los servicios de aplicación en la cadena de inyección de dependencias.
    /// </summary>
    /// <param name="services">Colección de servicios</param>
    /// <returns>Servicios configurados</returns>
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Registrar servicios con su interfaz
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IProductoService, ProductoService>();
        services.AddScoped<IPedidoService, PedidoService>();
        services.AddScoped<IClienteService, ClienteService>();
        services.AddScoped<IUsuarioService, UsuarioService>();
        services.AddScoped<IRolService, RolService>();

        return services;
    }

    /// <summary>
    /// Configura autenticación JWT y autorización.
    /// </summary>
    /// <param name="services">Colección de servicios</param>
    /// <param name="configuration">Configuración de la aplicación</param>
    /// <returns>Servicios configurados</returns>
    public static IServiceCollection AddJwtConfiguration(this IServiceCollection services, IConfiguration configuration)
    {
        // Obtener configuración JWT desde appsettings
        var jwtSettings = configuration.GetSection("Jwt");
        var keyString = jwtSettings["Key"];
        
        if (string.IsNullOrEmpty(keyString))
            throw new InvalidOperationException("JWT Key no configurada en appsettings");
        
        // Convertir clave a bytes
        var key = Encoding.UTF8.GetBytes(keyString);

        // Configurar autenticación Bearer
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                // Validar token JWT
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSettings["Issuer"] ?? throw new InvalidOperationException("JWT Issuer no configurado"),
                    ValidAudience = jwtSettings["Audience"] ?? throw new InvalidOperationException("JWT Audience no configurado"),
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ClockSkew = TimeSpan.Zero
                };
            });

        // Registrar autorización
        services.AddAuthorization();

        return services;
    }

    /// <summary>
    /// Configura Swagger/OpenAPI con soporte para autenticación JWT.
    /// </summary>
    /// <param name="services">Colección de servicios</param>
    /// <returns>Servicios configurados</returns>
    public static IServiceCollection AddSwaggerWithJwt(this IServiceCollection services)
    {
        // Agregar generador de Swagger
        services.AddSwaggerGen(options =>
        {
            // Definir esquema de seguridad Bearer
            options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                Scheme = "bearer",
                BearerFormat = "JWT",
                In = ParameterLocation.Header,
                Description = "Ingrese el token JWT asi: Bearer {su token}"
            });

            // Agregar requisito de seguridad
            options.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    Array.Empty<string>()
                }
            });
        });

        return services;
    }
}
