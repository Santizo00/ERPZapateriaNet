# Application Layer ERPZapateria

Esta capa contiene los DTOs y las interfaces que definen los contratos de los servicios.

## Contenido

- Common: clases comunes como ApiResponse.
- DTOs: objetos de transferencia de datos para Auth, Producto, Pedido, Usuario, Cliente y Rol.
- Interfaces: contratos de servicios implementados en la capa API.

## Estructura

```
ERPZapateria.Application/
├── DTOs/
│   ├── Auth/
│   │   ├── LoginRequestDto.cs            # username, password
│   │   ├── LoginResponseDto.cs           # token, usuario
│   │   └── RegisterRequestDto.cs         # registro de usuario
│   ├── Producto/
│   │   ├── ProductoDto.cs                # Lectura
│   │   └── CreateProductoDto.cs          # Crear/Editar
│   ├── Pedido/
│   │   ├── CreatePedidoDto.cs            # Crear pedido
│   │   ├── PedidoDetalleDto.cs           # Items del pedido
│   │   ├── PedidoDetalleItemDto.cs       # Respuesta items
│   │   └── PedidoDetalleResponseDto.cs   # Respuesta completa
│   ├── Usuario/
│   │   ├── UsuarioDto.cs                 # Lectura
│   │   ├── CreateUsuarioDto.cs           # Crear
│   │   └── UpdateUsuarioDto.cs           # Editar
│   ├── Cliente/
│   │   └── ClienteDto.cs                 # Información de cliente
│   └── Rol/
│       └── RolDto.cs                     # Información de rol
│
└── Interfaces/
    ├── IAuthService.cs                   # Autenticación
    ├── IProductoService.cs               # CRUD productos
    ├── IPedidoService.cs                 # CRUD pedidos
    ├── IUsuarioService.cs                # CRUD usuarios
    ├── IClienteService.cs                # CRUD clientes
    └── IRolService.cs                    # Lectura de roles
```

## Proposito

- DTOs: transferencia de datos entre capas sin logica de negocio.
- Interfaces: contratos de servicios que implementa la API.
- ApiResponse: formato estandar para respuestas de la API.

## Notas

- Los DTOs no contienen logica, solo propiedades.
- Las interfaces definen metodos, no implementaciones.
- Esta capa es independiente de frameworks y bases de datos.

## Documentacion adicional

- [README General](../../README.md)
- [Backend API](../ERPZapateria.API/README.md)
- [Base de Datos](../../DataBase/README.md)
- [Frontend](../../Frontend/README.md)
