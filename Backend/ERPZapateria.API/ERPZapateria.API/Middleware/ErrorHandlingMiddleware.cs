using System.Net;
using System.Text.Json;

namespace ERPZapateria.API.Middleware;

/// <summary>
/// Middleware global para manejo centralizado de errores no controlados.
/// Captura excepciones y retorna respuestas JSON estructuradas.
/// </summary>
public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ErrorHandlingMiddleware> _logger;

    /// <summary>
    /// Constructor del middleware de manejo de errores.
    /// </summary>
    /// <param name="next">Siguiente middleware en la cadena</param>
    /// <param name="logger">Logger para registrar errores</param>
    public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    /// <summary>
    /// Procesa la solicitud y captura cualquier excepción no controlada.
    /// </summary>
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            // Pasar la solicitud al siguiente middleware
            await _next(context);
        }
        catch (Exception ex)
        {
            // Registrar error en logs
            _logger.LogError(ex, "Ocurrio un error no controlado");

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            var response = new
            {
                Success = false,
                Message = "Ocurri� un error interno en el servidor.",
                Detail = ex.Message
            };

            var json = JsonSerializer.Serialize(response);

            await context.Response.WriteAsync(json);
        }
    }
}
