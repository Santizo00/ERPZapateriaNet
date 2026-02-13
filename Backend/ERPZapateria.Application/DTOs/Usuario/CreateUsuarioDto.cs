namespace ERPZapateria.Application.DTOs.Usuario;

/// <summary>
/// DTO para crear un nuevo usuario.
/// Contiene credenciales y asignación de rol para la creación de nueva cuenta.
/// </summary>
public class CreateUsuarioDto
{
    /// <summary>Nombre de usuario. Debe ser único. Campo requerido.</summary>
    public string Username { get; set; } = string.Empty;

    /// <summary>Contraseña del usuario. Será hasheada con BCrypt. Campo requerido.</summary>
    public string Password { get; set; } = string.Empty;

    /// <summary>Identificador del rol. Campo requerido.</summary>
    public int IdRol { get; set; }

    /// <summary>Indica si el usuario está inicialmente activo. Por defecto es verdadero.</summary>
    public bool Activo { get; set; } = true;
}
