# ERPZapateria.NET

Sistema de gestion empresarial (ERP) para zapaterias. Arquitectura de tres capas con backend en .NET Core, frontend en React TypeScript y base de datos SQL Server. Incluye autenticacion JWT, gestion de inventario, pedidos, usuarios y control de acceso basado en roles.

## Contenido

- **Backend**: API REST en .NET Core con autenticacion JWT
- **Application**: Capa de aplicacion con DTOs e interfaces
- **Frontend**: Interfaz de usuario en React TypeScript
- **DataBase**: Esquema de base de datos y procedimientos almacenados

## Estructura

```
ERPZapateriaNet/
├── Backend/
│   ├── ERPZapateria.API/           # API REST con controllers y services
│   │   ├── Controllers/            # Endpoints HTTP (Auth, Productos, Pedidos, Usuarios)
│   │   ├── Services/               # Logica de negocio con Dapper
│   │   ├── Middleware/             # Manejo de errores y debug JWT
│   │   ├── Helpers/                # Generacion de tokens JWT
│   │   └── Extensions/             # Configuracion de DI y servicios
|   |
│   └── ERPZapateria.Application/   # Capa de aplicacion
│       ├── DTOs/                   # Objetos de transferencia de datos
│       ├── Interfaces/             # Contratos de servicios
│       └── Common/                 # Respuestas API estandarizadas
| 
├── Frontend/                        # Aplicacion web React
│   └── src/
│       ├── pages/                  # Vistas principales del sistema
│       ├── components/             # Componentes reutilizables
│       ├── stores/                 # Estado global con Zustand
│       ├── services/               # Cliente HTTP con Axios
│       ├── hooks/                  # Hooks personalizados
│       └── types/                  # Tipos TypeScript
|
├── DataBase/                        # Scripts de base de datos
│   ├── 01_Schema.sql               # Tablas, indices y relaciones
│   └── 02_StoredProcedures.sql     # Procedimientos almacenados
|
└── README.md
```

## Proposito

Sistema completo de gestion empresarial para zapaterias que permite:

- **Autenticacion segura**: Login con JWT y contraseñas hasheadas con BCrypt
- **Gestion de productos**: CRUD completo con control de inventario y stock minimo
- **Gestion de pedidos**: Creacion de pedidos con actualizacion automatica de inventario
- **Gestion de usuarios**: Administracion de usuarios con asignacion de roles
- **Control de acceso**: Autorizacion basada en roles (Admin, Vendedor)
- **Consulta de clientes**: Visualizacion de informacion de clientes

## Arquitectura

### Backend (.NET Core 6.0+)
- **API REST**: Controllers exponen endpoints HTTP
- **Autenticacion**: JWT Bearer tokens con claims para usuario y rol
- **ORM**: Dapper para acceso a datos con consultas parametrizadas
- **Seguridad**: BCrypt para hash de passwords, validacion de tokens
- **Middleware**: Manejo centralizado de errores y logging
- **Documentacion**: Swagger/OpenAPI con soporte para autenticacion JWT

### Application Layer
- **DTOs**: Objetos de transferencia para Auth, Productos, Pedidos, Usuarios, Clientes, Roles
- **Interfaces**: Contratos que definen servicios de negocio
- **Common**: Clases compartidas para respuestas API

### Frontend (React 18 + TypeScript)
- **Enrutamiento**: React Router con rutas protegidas por autenticacion y rol
- **Estado**: Zustand para gestion de estado global (autenticacion)
- **HTTP**: Axios con interceptores para tokens JWT
- **UI**: Tailwind CSS y estilos inline, SweetAlert2 para alertas
- **Validaciones**: Validacion client-side antes de enviar al backend

### Base de Datos (SQL Server 2019+)
- **Tablas**: Roles, Usuarios, Categorias, Productos, Inventario, Clientes, Pedidos, PedidoDetalle
- **Relaciones**: Claves foraneas con integridad referencial
- **Stored Procedures**: Logica de negocio compleja (login, crear pedido, actualizar inventario)
- **Indices**: Optimizacion de consultas frecuentes
- **Seed Data**: Datos iniciales (roles y usuario admin)

## Tecnologias

### Backend
- .NET Core 6.0+
- Dapper (ORM)
- JWT Bearer Authentication
- BCrypt.NET (hashing)
- Swagger/OpenAPI

### Frontend
- React 18
- TypeScript
- Vite (build tool)
- Zustand (state management)
- Axios (HTTP client)
- React Router (routing)
- Tailwind CSS (styling)
- SweetAlert2 (alerts)
- lucide-react (icons)

### Base de Datos
- SQL Server 2019+
- Transact-SQL
- Stored Procedures
- Table-Valued Parameters

## Requisitos

- .NET Core SDK 6.0 o superior
- SQL Server 2019 o superior
- Node.js 16 o superior
- npm o yarn

## Instalacion

### Base de Datos

1. Crear base de datos en SQL Server:
```sql
CREATE DATABASE ERPZapateria
```

2. Ejecutar scripts en orden:
   - `DataBase/01_Schema.sql`
   - `DataBase/02_StoredProcedures.sql`

### Backend

1. Configurar cadena de conexion en `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=ERPZapateria;Trusted_Connection=True;"
  }
}
```

2. Restaurar dependencias y ejecutar:
```bash
cd Backend/ERPZapateria.API/ERPZapateria.API
dotnet restore
dotnet run
```

La API estara disponible en `http://localhost:5017`

### Frontend

1. Instalar dependencias:
```bash
cd Frontend
npm install
```

2. Configurar URL de API en `.env`:
```env
VITE_API_URL=http://localhost:(PORT)/api
```

3. Ejecutar en modo desarrollo:
```bash
npm run dev
```

## Credenciales por Defecto

Usuario administrador creado automaticamente:
- **Usuario**: `admin`
- **Contraseña**: `admin123`
- **Rol**: Admin

## Notas

- El token JWT expira en 60 minutos por defecto
- Los passwords se hashean con BCrypt (factor 10)
- Las eliminaciones son logicas (soft delete) marcando registros como inactivos
- El inventario se actualiza automaticamente al crear pedidos
- CORS configurado para frontend en puertos 5173-5176

## Documentacion Adicional

- [Backend API](Backend/ERPZapateria.API/ERPZapateria.API/README.md) - Documentacion de la API REST
- [Application Layer](Backend/ERPZapateria.Application/README.md) - Documentacion de DTOs e interfaces
- [Frontend](Frontend/README.md) - Documentacion de la aplicacion React
- [Base de Datos](DataBase/README.md) - Documentacion del esquema y procedimientos



## 👨‍💻 Autor

Desarrollado por [Axel Santizo](https://github.com/Santizo00)