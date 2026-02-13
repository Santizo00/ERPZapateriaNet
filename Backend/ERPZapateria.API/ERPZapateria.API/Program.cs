using ERPZapateria.API.Extensions;

// ========== CONFIGURACIÓN DE SERVICIOS ==========
var builder = WebApplication.CreateBuilder(args);

// Configurar base de datos
builder.Services.AddDatabase(builder.Configuration);

// Registrar servicios de aplicación (inyección de dependencias)
builder.Services.AddApplicationServices();

// Configurar JWT y autenticación
builder.Services.AddJwtConfiguration(builder.Configuration);

// Configurar CORS - permitir frontend en diferentes puertos para desarrollo
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
            .WithOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

// Agregar controladores y documentación API
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerWithJwt();

// ========== CONFIGURACIÓN DE MIDDLEWARE ==========
var app = builder.Build();

// Mostrar Swagger en desarrollo
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Agregar middleware de debug JWT (ejecución en cadena)
app.UseMiddleware<ERPZapateria.API.Middleware.JwtDebugMiddleware>();

// Aplicar CORS - DEBE estar antes de Authentication
app.UseCors("AllowFrontend");

// Configurar autenticación y autorización
app.UseAuthentication();
app.UseAuthorization();

// Agregar middleware global de manejo de errores
app.UseMiddleware<ERPZapateria.API.Middleware.ErrorHandlingMiddleware>();

// Mapear controladores
app.MapControllers();

app.Run();
