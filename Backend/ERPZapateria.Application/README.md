# ERPZapateria.Application

## Descripción

La capa de **Application** es responsable de la lógica de negocio y orquestación de la aplicación. Actúa como intermediario entre la capa de presentación (API) y la capa de acceso a datos (Infrastructure), implementando el patrón de arquitectura limpia.

## Propósito

Este proyecto contiene:

- **DTOs (Data Transfer Objects)**: Objetos de transferencia de datos que definen la estructura de información que viaja entre capas
- **Interfaces de Servicios**: Contratos que definen las operaciones de negocio disponibles
- **Respuestas API**: Estructuras estándar para las respuestas de la aplicación

## Estructura del Proyecto

```
ERPZapateria.Application
│
├── Common
│   └── ApiResponse.cs              # Clase genérica para respuestas estandarizadas
│
├── DTOs
│   ├── Auth
│   │   ├── LoginRequestDto.cs      # DTO para solicitudes de login (username y password)
│   │   └── LoginResponseDto.cs     # DTO para respuestas de autenticación (token y datos usuario)
│   │
│   ├── Producto
│   │   ├── ProductoDto.cs          # DTO principal de productos (lectura/consulta)
│   │   └── CreateProductoDto.cs    # DTO para crear o actualizar productos
│   │
│   └── Pedido
│       ├── CreatePedidoDto.cs      # DTO para crear pedidos (cliente + lista de productos)
│       └── PedidoDetalleDto.cs     # DTO para detalles del pedido (producto, cantidad, precio)
│
└── Interfaces
    ├── IAuthService.cs             # Contrato del servicio de autenticación
    ├── IProductoService.cs         # Contrato del servicio CRUD de productos
    └── IPedidoService.cs           # Contrato del servicio de creación de pedidos

```

## Componentes Principales

### 1. Common
Contiene clases compartidas y utilidades comunes en toda la aplicación:
- **ApiResponse<T>**: Wrapper genérico para estandarizar las respuestas de la API

### 2. DTOs (Data Transfer Objects)
Objetos que transportan datos entre procesos, organizados por dominio:

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
