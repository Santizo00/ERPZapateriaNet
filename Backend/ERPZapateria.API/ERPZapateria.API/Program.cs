using ERPZapateria.API.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDatabase(builder.Configuration);
builder.Services.AddApplicationServices();
builder.Services.AddJwtConfiguration(builder.Configuration);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerWithJwt();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ERPZapateria.API.Middleware.JwtDebugMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<ERPZapateria.API.Middleware.ErrorHandlingMiddleware>();

app.MapControllers();

app.Run();
