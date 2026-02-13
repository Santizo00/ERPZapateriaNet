using System.Text;

namespace ERPZapateria.API.Middleware;

public class JwtDebugMiddleware
{
    private readonly RequestDelegate _next;

    public JwtDebugMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        await _next(context);
    }
}

