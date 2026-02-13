using System.Text;

namespace ERPZapateria.API.Middleware;

/// <summary>
/// Middleware para procesamiento de solicitudes en la cadena de middleware.
/// Utilizado para debug y logging de tokens JWT.
/// </summary>
public class JwtDebugMiddleware
{
    private readonly RequestDelegate _next;

    /// <summary>
    /// Constructor del middleware de debug JWT.
    /// </summary>
    /// <param name="next">Siguiente middleware en la cadena</param>
    public JwtDebugMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    /// <summary>
    /// Procesa la solicitud HTTP en la cadena de middleware.
    /// </summary>
    public async Task InvokeAsync(HttpContext context)
    {
        // Pasar la solicitud al siguiente middleware
        await _next(context);
    }
}

