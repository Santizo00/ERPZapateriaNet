# Backend API - ERPZapatería

API REST en C# .NET Core con autenticación JWT, gestión de usuarios, productos y pedidos.

---

## ⚙️ Requisitos

- .NET Core SDK 6.0+
- SQL Server 2019+

---

## 🚀 Instalación

### 1. Restaurar dependencias
```bash
cd Backend/ERPZapateria.API
dotnet restore
```

### 2. Configurar connection string

Editar `ERPZapateria.API/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=ERPZapateria;User Id=sa;Password=TuPassword;"
  },
  "Jwt": {
    "SecretKey": "TuClaveSecraMayorA32Caracteres",
    "ExpirationMinutes": 60
  }
}
```

### 3. Crear base de datos

Ejecutar en SQL Server:
- `DataBase/01_Schema.sql`
- `DataBase/02_StoredProcedures.sql`

### 4. Ejecutar API
```bash
dotnet run
# API disponible en http://localhost:5000
# Swagger UI en http://localhost:5000/swagger
```

---

## 📡 Endpoints Principales

### Auth
- `POST /api/auth/login` - Autentica usuario (retorna JWT)
- `POST /api/auth/register` - Registra usuario (solo Admin)

### Productos
- `GET /api/productos` - Listar productos
- `GET /api/productos/{id}` - Obtener producto
- `POST /api/productos` - Crear (Admin)
- `PUT /api/productos/{id}` - Actualizar (Admin)
- `DELETE /api/productos/{id}` - Eliminar (Admin)

### Pedidos
- `GET /api/pedidos` - Listar pedidos
- `GET /api/pedidos/{id}` - Obtener pedido
- `GET /api/pedidos/{id}/detalle` - Pedido con detalles completos
- `POST /api/pedidos` - Crear (Admin, Vendedor)

### Usuarios
- `GET /api/usuarios` - Listar usuarios (Admin)
- `GET /api/usuarios/{id}` - Obtener usuario (Admin)
- `POST /api/usuarios` - Crear (Admin)
- `PUT /api/usuarios/{id}` - Actualizar (Admin)
- `DELETE /api/usuarios/{id}` - Eliminar (Admin)

### Clientes
- `GET /api/clientes` - Listar clientes
- `GET /api/clientes/{id}` - Obtener cliente

### Roles
- `GET /api/roles` - Listar roles (Admin)
- `GET /api/roles/{id}` - Obtener rol (Admin)

---

## 🔐 Autenticación

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin", "password":"admin123"}'
```

### Usar token
```bash
curl -X GET http://localhost:5000/api/productos \
  -H "Authorization: Bearer {token}"
```

---

## 📁 Estructura

- **Controllers/** - Endpoints HTTP
- **Services/** - Lógica de negocio
- **Middleware/** - JWT y manejo de errores
- **Helpers/** - Utilidades (JWT, Auth)
- **Extensions/** - Inyección de dependencias

---

## 🛠️ Tecnologías

- C# .NET Core 6.0
- Dapper (ORM)
- SQL Server
- JWT (Autenticación)
- BCrypt (Hashing de passwords)
- Swagger/OpenAPI (Documentación)

---

## 📚 Documentación Adicional

- [README General](../../README.md)
- [Application Layer](../ERPZapateria.Application/README.md)
- [Base de Datos](../../DataBase/README.md)
- [Frontend](../../Frontend/README.md)

---

## Requisitos

- **.NET Core SDK**: 6.0 o superior
- **SQL Server**: 2019 o superior
- **Visual Studio** o **VS Code** con C# extension

---

## Configuración Inicial

### 1. Restaurar Dependencias

```bash
cd Backend/ERPZapateria.API
dotnet restore
```

### 2. Configurar Connection String

Editar `ERPZapateria.API/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=ERPZapateria;User Id=sa;Password=YourPassword;"
  },
  "Jwt": {
    "SecretKey": "YourSuperSecretKeyThatIsAtLeast32CharactersLong",
    "Issuer": "ERPZapateria",
    "Audience": "ERPZapateriaUsers",
    "ExpirationMinutes": 60
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning"
    }
  }
}
```

### 3. Crear Base de Datos

```bash
# Desde SQL Server Management Studio:
1. Crear DB: CREATE DATABASE ERPZapateria
2. Ejecutar: DataBase/01_Schema.sql
3. Ejecutar: DataBase/02_StoredProcedures.sql
```

### 4. Ejecutar la API

```bash
dotnet run
```

La API estará disponible en: `http://localhost:5000`

Swagger UI: `http://localhost:5000/swagger`

---

## Estructura del Proyecto

```
Backend/ERPZapateria.API/
├── ERPZapateria.API/
│   ├── Controllers/
│   │   ├── AuthController.cs
│   │   ├── ProductosController.cs
│   │   ├── PedidosController.cs
│   │   ├── UsuariosController.cs
│   │   ├── ClientesController.cs
│   │   └── RolesController.cs
│   ├── Services/
│   │   ├── AuthService.cs
│   │   ├── ProductoService.cs
│   │   ├── PedidoService.cs
│   │   ├── UsuarioService.cs
│   │   ├── ClienteService.cs
│   │   └── RolService.cs
│   ├── Middleware/
│   │   ├── ErrorHandlingMiddleware.cs
│   │   └── JwtDebugMiddleware.cs
│   ├── Helpers/
│   │   └── JwtHelper.cs
│   ├── Extensions/
│   │   ├── ServiceCollectionExtensions.cs
│   │   └── DatabaseExtensions.cs
│   ├── Program.cs
│   └── appsettings.json
├── ERPZapateria.Application/
│   ├── DTOs/
│   │   ├── Auth/
│   │   ├── Producto/
│   │   ├── Pedido/
│   │   ├── Usuario/
│   │   ├── Cliente/
│   │   └── Rol/
│   └── Interfaces/
│       ├── IAuthService.cs
│       ├── IProductoService.cs
│       ├── IPedidoService.cs
│       ├── IUsuarioService.cs
│       ├── IClienteService.cs
│       └── IRolService.cs
└── ERPZapateria.sln
```

---

## Endpoints Principales

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

Response 200:
{
  "idUsuario": 1,
  "username": "admin",
  "rol": "Admin",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Register (Admin only)
```http
POST /api/auth/register
Authorization: Bearer {token}
Content-Type: application/json

{
  "username": "newuser",
  "password": "password123",
  "idRol": 2
}
```

---

### Productos

#### Listar todos
```http
GET /api/productos
Authorization: Bearer {token}

Response 200:
[
  {
    "idProducto": 1,
    "nombre": "Zapato Deportivo",
    "descripcion": "Zapato para correr",
    "precio": 89.99,
    "stockDisponible": 50
  }
]
```

#### Crear (Admin only)
```http
POST /api/productos
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Zapato Formal",
  "descripcion": "Zapato de oficina",
  "precio": 129.99,
  "stock": 30,
  "stockMinimo": 5
}

Response 200:
{
  "idProducto": 2
}
```

#### Actualizar (Admin only)
```http
PUT /api/productos/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Zapato Deportivo Premium",
  "descripcion": "Actualizado",
  "precio": 99.99,
  "stock": 45,
  "stockMinimo": 10
}
```

#### Eliminar (Admin only - soft delete)
```http
DELETE /api/productos/1
Authorization: Bearer {token}

Response 200:
"Producto eliminado"
```

---

### Pedidos

#### Crear Pedido
```http
POST /api/pedidos
Authorization: Bearer {token}
Content-Type: application/json

{
  "idCliente": 1,
  "idUsuario": 1,
  "detalle": [
    {
      "idProducto": 1,
      "cantidad": 2,
      "precioUnitario": 89.99
    },
    {
      "idProducto": 2,
      "cantidad": 1,
      "precioUnitario": 129.99
    }
  ]
}

Response 200:
{
  "idPedido": 1,
  "message": "Pedido creado correctamente"
}
```

#### Obtener Detalle Completo
```http
GET /api/pedidos/1/detalle
Authorization: Bearer {token}

Response 200:
{
  "idPedido": 1,
  "idCliente": 1,
  "clienteNombre": "Acme Corp",
  "clienteNIT": "123456789",
  "idUsuario": 1,
  "usuarioNombre": "admin",
  "fecha": "2024-01-15T10:30:00",
  "total": 309.97,
  "estado": "Pendiente",
  "detalle": [
    {
      "idProducto": 1,
      "productoNombre": "Zapato Deportivo",
      "cantidad": 2,
      "precioUnitario": 89.99,
      "subtotal": 179.98
    },
    {
      "idProducto": 2,
      "productoNombre": "Zapato Formal",
      "cantidad": 1,
      "precioUnitario": 129.99,
      "subtotal": 129.99
    }
  ]
}
```

---

### Usuarios (Admin only)

#### Listar usuarios
```http
GET /api/usuarios
Authorization: Bearer {token}

Response 200:
[
  {
    "idUsuario": 1,
    "username": "admin",
    "idRol": 1,
    "rol": "Admin",
    "activo": true,
    "fechaCreacion": "2024-01-01T00:00:00"
  }
]
```

#### Crear usuario
```http
POST /api/usuarios
Authorization: Bearer {token}
Content-Type: application/json

{
  "username": "vendedor1",
  "password": "securepass123",
  "idRol": 2,
  "activo": true
}
```

#### Actualizar usuario
```http
PUT /api/usuarios/2
Authorization: Bearer {token}
Content-Type: application/json

{
  "username": "vendedor1_updated",
  "password": "newpass123",  // opcional
  "idRol": 2,
  "activo": true
}
```

---

## Autenticación y Autorización

### JWT Token Structure

```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "nameid": "1",
  "unique_name": "admin",
  "role": "Admin",
  "exp": 1705329600,
  "iss": "ERPZapateria",
  "aud": "ERPZapateriaUsers"
}

Signature:
HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)
```

### Roles

| Rol | Permisos |
|-----|----------|
| **Admin** | Todo (CRUD completo en todos módulos) |
| **Vendedor** | Ver productos, Crear pedidos, Ver pedidos |
| **Anónimo** | Solo endpoint /auth/login |

### Header de Autorización

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Manejo de Errores

Todos los errores retornan con estructura consistente:

```json
{
  "error": "Producto no encontrado",
  "statusCode": 404
}
```

### Códigos de Estado HTTP

| Código | Significado |
|--------|-----------|
| 200 | OK - Operación exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - Token inválido o expirado |
| 403 | Forbidden - Sin permisos para esta acción |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - Error de negocio (ej: sin stock) |
| 500 | Internal Server Error - Error en servidor |

---

## Transacciones y Stored Procedures

### sp_CrearPedido
Crea un pedido con validación de inventario.

**Entrada:**
- @IdCliente INT
- @IdUsuario INT
- @Detalle PedidoDetalleType (Table-Valued Parameter)

**Salida:**
- IdPedido (INT)

**Flujo:**
1. Inicia transacción
2. INSERT Pedidos (retorna IdPedido)
3. INSERT PedidoDetalle para cada item
4. Calcula Total
5. EXEC sp_ActualizarInventario para cada item
6. Si todo OK: COMMIT, si error: ROLLBACK

### sp_ActualizarInventario
Actualiza disponibilidad de stock y registra movimiento.

**Entrada:**
- @IdProducto INT
- @Cantidad INT (negativo = salida)
- @TipoMovimiento VARCHAR(50)
- @IdPedido INT (opcional)

**Validaciones:**
- Stock disponible >= cantidad requerida
- No negativa después de operación

---

## Testing de Endpoints

### Con Postman/Thunder Client

1. **Importar colección:** `Backend/ERPZapateria.API/ERPZapateria.API.http`
2. **Configurar variables:**
   - `token`: Obtener token del endpoint login
   - `baseUrl`: http://localhost:5000
3. **Ejecutar requests**

### Con cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'

# Obtener token de respuesta y usar en siguiente request

# Listar productos
curl -X GET http://localhost:5000/api/productos \
  -H "Authorization: Bearer {token}"
```

---

## Depuración

### Logs

Los logs se escriben en consola por defecto. Configurar en appsettings.json:

```json
"Logging": {
  "LogLevel": {
    "Default": "Information",
    "Microsoft": "Warning",
    "System": "Warning"
  }
}
```

### Debug Middleware

JwtDebugMiddleware (solo en Development) imprime información del token en logs.

### Database Queries

Usar SQL Profiler o Query Analyzer para ver queries generadas por Dapper.

---

## Deployment

### Local Development
```bash
dotnet run --configuration Development
```

### Production
```bash
# Publicar
dotnet publish -c Release -o ./publish

# Ejecutar
dotnet publish/ERPZapateria.API.dll
```

### IIS
1. Instalar ASP.NET Core Hosting Bundle
2. Publicar con: `dotnet publish -c Release`
3. Crear Application Pool en IIS
4. Configurar ConnectionString para SQL Server
5. Iniciar Application

---

## Performance Considerations

- **Queries complejas:** Usar Stored Procedures (sp_CrearPedido)
- **Conexión SQL:** Usar connection pooling (default en Dapper)
- **DTOs:** Mapeo explícito vs AutoMapper (actual: explícito para control)
- **Caché:** Considerar para productos frecuentemente accedidos

---

## Seguridad

- **Passwords:** Hasheadas con BCrypt (10 salt rounds)
- **JWT:** Secret key en appsettings (producción: secreto fuerte)
- **CORS:** Restricciones por origen
- **SQL Injection:** Prevenido por Dapper (parametrizado)
- **Soft Delete:** Productos/Usuarios marcados Activo=0, no eliminados físicamente

---

## Troubleshooting

### "Cannot connect to database"
- Verificar SQL Server está corriendo
- Verificar connection string
- Verificar credenciales (user/password)
- Verificar puerto (default: 1433)

### "JWT expired"
- Token expira según ExpirationMinutes en appsettings
- Cliente debe obtener nuevo token con login

### "402 Unauthorized"
- Token invalido o expirado en header
- Verifica formato: `Authorization: Bearer {token}`

### "CORS error"
- Frontend URL debe estar en AddCors method en Program.cs
- Verifica CORS policy permite métodos POST/PUT/DELETE

---

## Documentación Adicional

- [Architecture Overview](../ARCHITECTURE.md)
- [API Documentation (Swagger)](http://localhost:5000/swagger)
- [Database Schema](../DataBase/README.md)
- [Frontend Integration](../Frontend/README.md)

