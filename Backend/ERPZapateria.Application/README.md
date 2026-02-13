# Application Layer - ERPZapatería

Capa de aplicación con DTOs (Data Transfer Objects) e interfaces de servicios.

---

## 📁 Estructura

```
ERPZapateria.Application/
├── DTOs/
│   ├── Auth/
│   │   ├── LoginRequestDto.cs       # username, password
│   │   ├── LoginResponseDto.cs      # token, usuario
│   │   └── RegisterRequestDto.cs    # registro de usuario
│   ├── Producto/
│   │   ├── ProductoDto.cs           # Lectura
│   │   └── CreateProductoDto.cs     # Crear/Editar
│   ├── Pedido/
│   │   ├── CreatePedidoDto.cs       # Crear pedido
│   │   ├── PedidoDetalleDto.cs      # Items del pedido
│   │   ├── PedidoDetalleItemDto.cs  # Respuesta items
│   │   └── PedidoDetalleResponseDto.cs # Respuesta completa
│   ├── Usuario/
│   │   ├── UsuarioDto.cs            # Lectura
│   │   ├── CreateUsuarioDto.cs      # Crear
│   │   └── UpdateUsuarioDto.cs      # Editar
│   ├── Cliente/
│   │   └── ClienteDto.cs            # Información de cliente
│   └── Rol/
│       └── RolDto.cs                # Información de rol
│
└── Interfaces/
    ├── IAuthService.cs              # Autenticación
    ├── IProductoService.cs          # CRUD productos
    ├── IPedidoService.cs            # CRUD pedidos
    ├── IUsuarioService.cs           # CRUD usuarios
    ├── IClienteService.cs           # CRUD clientes
    └── IRolService.cs               # Lectura de roles
```

---

## 🎯 Propósito

- **DTOs**: Estructuran datos entre API y clientes
- **Interfaces**: Definen contratos que cumplen los servicios

---

## 📚 Documentación Adicional

- [README General](../../README.md)
- [Backend API](../ERPZapateria.API/README.md)
- [Base de Datos](../../DataBase/README.md)
- [Frontend](../../Frontend/README.md)

#### Auth
- Autenticación y autorización de usuarios
- Login y respuestas de token

#### Producto
- Gestión de información de productos
- Operaciones CRUD de productos del inventario

#### Pedido
- Gestión de pedidos de clientes
- Detalles y líneas de pedido

### 3. Interfaces
Define los contratos de los servicios que serán implementados en la capa de negocio:

- **IAuthService**: Operaciones de autenticación y seguridad
- **IProductoService**: Operaciones CRUD para productos
- **IPedidoService**: Operaciones CRUD para pedidos y su gestión

## Patrones y Principios

Este proyecto sigue los siguientes principios y patrones:

- **Separation of Concerns**: Cada componente tiene una responsabilidad específica
- **Dependency Inversion**: Las interfaces definen contratos, las implementaciones están en otras capas
- **DTO Pattern**: Transferencia de datos entre capas sin exponer entidades de dominio
- **Clean Architecture**: Independencia de frameworks, UI y bases de datos

## Dependencias

Esta capa **NO** debe depender de:
- Frameworks de UI
- Bases de datos
- Librerías de terceros específicas

Esta capa define contratos que serán implementados por:
- **ERPZapateria.Infrastructure**: Implementación de acceso a datos
- **ERPZapateria.Services**: Implementación de lógica de negocio

## Tecnologías

- **.NET 8**
- **C# 12.0**

## Uso

Los DTOs e interfaces definidos en este proyecto son utilizados por:

1. **Capa API**: Para definir contratos de endpoints
2. **Capa Services**: Para implementar la lógica de negocio
3. **Capa Infrastructure**: Para el mapeo de entidades

## Notas Importantes

- Todos los DTOs deben ser clases simples sin lógica de negocio
- Las interfaces definen el "qué" pero no el "cómo"
- ApiResponse proporciona un formato consistente para todas las respuestas
- Esta capa es el núcleo de la arquitectura y debe mantenerse limpia y enfocada

---
