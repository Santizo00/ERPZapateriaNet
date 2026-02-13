# ERPZapateria.API

API REST para el sistema ERP de zapateria. Implementa autenticacion JWT, manejo de pedidos, productos, usuarios y clientes.

## Contenido

- **Controllers**: Endpoints REST para manejo de recursos
- **Services**: Logica de negocio e interaccion con base de datos
- **Middleware**: Interceptores de peticiones HTTP
- **Helpers**: Utilidades para generacion de tokens JWT
- **Extensions**: Metodos de extension para configuracion de servicios

## Estructura

```
ERPZapateria.API/
├── Program.cs                          # Configuracion de la aplicacion y middleware
├── appsettings.json                    # Configuracion de la aplicacion (conexion DB, JWT)
├── Controllers/                        
│   ├── AuthController.cs               # Login y registro de usuarios
│   ├── ProductosController.cs          # CRUD de productos
│   ├── PedidosController.cs            # Creacion y consulta de pedidos
│   ├── ClientesController.cs           # Consulta de clientes
│   ├── UsuariosController.cs           # CRUD de usuarios (Admin)
│   └── RolesController.cs              # Consulta de roles (Admin)
├── Services/                           
│   ├── AuthService.cs                  # Autenticacion y validacion de credenciales
│   ├── ProductoService.cs              # Gestion de productos e inventario
│   ├── PedidoService.cs                # Creacion de pedidos y actualizacion de inventario
│   ├── ClienteService.cs               # Consulta de clientes
│   ├── UsuarioService.cs               # Gestion de usuarios
│   └── RolService.cs                   # Consulta de roles
├── Middleware/                         
│   ├── ErrorHandlingMiddleware.cs      # Manejo global de errores
│   └── JwtDebugMiddleware.cs           # Debug de tokens JWT
├── Helpers/                            
│   └── JwtHelper.cs                    # Generacion de tokens JWT
└── Extensions/                         
    └── ServiceCollectionExtensions.cs  # Configuracion de DI, JWT y Swagger
```

## Proposito

- **Controllers**: Exponen endpoints HTTP para interactuar con recursos del sistema
- **Services**: Implementan las interfaces del proyecto Application y ejecutan consultas con Dapper
- **Middleware**: Interceptan peticiones para manejo de errores y debug
- **Helpers**: Centralizan logica de generacion de tokens JWT
- **Extensions**: Facilitan configuracion de servicios (DI, JWT, Swagger, base de datos)

## Notas

- Autenticacion mediante JWT Bearer tokens
- Autorizacion basada en roles (Admin, Vendedor)
- Conexion a SQL Server mediante Dapper
- Validacion de contraseñas con BCrypt
- Documentacion interactiva con Swagger
- CORS configurado para frontend en puertos 5173-5176
- Manejo global de errores mediante middleware

## Documentacion adicional

- [Application Layer](../../ERPZapateria.Application/README.md)
- [Database Schema](../../../DataBase/README.md)
