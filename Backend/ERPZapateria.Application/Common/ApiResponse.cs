namespace ERPZapateria.Application.Common;

/// <summary>
/// Respuesta generica de la API.
/// </summary>
public class ApiResponse<T>
{
    /// <summary>Indica si la operacion fue exitosa.</summary>
    public bool Success { get; set; }

    /// <summary>Mensaje de la respuesta.</summary>
    public string Message { get; set; } = string.Empty;

    /// <summary>Datos de la respuesta.</summary>
    public T? Data { get; set; }

    /// <summary>Crea una respuesta exitosa.</summary>
    public static ApiResponse<T> Ok(T data, string message = "")
        => new() { Success = true, Data = data, Message = message };

    /// <summary>Crea una respuesta de error.</summary>
    public static ApiResponse<T> Fail(string message)
        => new() { Success = false, Message = message };
}
