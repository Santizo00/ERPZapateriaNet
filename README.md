# ERPZapatería.NET

Sistema ERP para gestión empresarial de zapatería. Aplicación de tres capas con backend en .NET, frontend en React y base de datos SQL Server.

---

## 📚 Documentación por Proyecto

Cada proyecto tiene su propio README con instrucciones específicas:

- **[Backend API](Backend/ERPZapateria.API/README.md)** - Endpoints, autenticación y servicios
- **[Application Layer](Backend/ERPZapateria.Application/README.md)** - DTOs e Interfaces
- **[Frontend](Frontend/README.md)** - Interfaz de usuario en React
- **[Base de Datos](DataBase/README.md)** - Tablas, relaciones y stored procedures

---

## 🚀 Inicio Rápido

### Backend
```bash
cd Backend/ERPZapateria.API
dotnet restore
dotnet run
# API en: http://localhost:5000
```

### Frontend
```bash
cd Frontend
npm install
npm run dev
# Frontend en: http://localhost:5173
```

### Database
Ejecutar en SQL Server Management Studio:
```sql
-- 1. Crear base de datos
CREATE DATABASE ERPZapateria

-- 2. Ejecutar scripts en orden:
-- DataBase/01_Schema.sql
-- DataBase/02_StoredProcedures.sql
```

---

## 📋 Requisitos

- **.NET Core**: 6.0+
- **SQL Server**: 2019+
- **Node.js**: 16+
- **npm** o yarn

---

## 🏗️ Estructura

```
ERPZapateriaNet/
├── Backend/
│   ├── ERPZapateria.API/           # Controllers, Services, Middleware
│   └── ERPZapateria.Application/   # DTOs, Interfaces
├── Frontend/                        # React + Vite
├── DataBase/                        # Scripts SQL
└── README.md                        # Este archivo
```

---

## ✨ Módulos

- ✅ Autenticación JWT con BCrypt
- ✅ Gestión de Productos
- ✅ Gestión de Pedidos
- ✅ Gestión de Usuarios (Admin)
- ✅ Gestión de Clientes
- ✅ Control de Inventario
- ✅ Control de acceso por roles

---

## 🔐 Seguridad

- Passwords hasheados con BCrypt
- JWT para autenticación stateless
- Roles: Admin y Vendedor
- CORS configurado
- SQL Injection prevenido (Dapper parametrizado)