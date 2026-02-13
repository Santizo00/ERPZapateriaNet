# Frontend

Interfaz de usuario del sistema ERP de zapateria. Aplicacion React con TypeScript, enrutamiento, autenticacion JWT y gestion de estado con Zustand.

## Contenido

- **App.tsx**: Configuracion de rutas y navegacion
- **main.tsx**: Punto de entrada de la aplicacion
- **pages**: Vistas principales del sistema
- **components**: Componentes reutilizables (layout, rutas protegidas)
- **stores**: Gestion de estado global con Zustand
- **services**: Comunicacion con API REST del backend
- **hooks**: Hooks personalizados (autenticacion)
- **types**: Interfaces TypeScript compartidas

## Estructura

```
src/
├── App.tsx                         # Configuracion de rutas y navegacion
├── main.tsx                        # Punto de entrada React
├── pages/                           
│   ├── LoginPage.tsx               # Autenticacion de usuarios
│   ├── DashboardPage.tsx           # Pagina principal del sistema
│   ├── ProductosPage.tsx           # Lista y gestion de productos
│   ├── ProductoFormPage.tsx        # Formulario crear/editar producto
│   ├── PedidosPage.tsx             # Lista y creacion de pedidos
│   └── UsuariosPage.tsx            # Gestion de usuarios (Admin)
├── components/                      
│   ├── DashboardLayout.tsx         # Layout con sidebar y navbar
│   ├── ProtectedRoute.tsx          # Proteccion de rutas autenticadas
│   └── ProtectedRoleRoute.tsx      # Proteccion por rol de usuario
├── stores/                          
│   └── authStore.ts                # Estado de autenticacion (Zustand)
├── services/                       
│   ├── api.ts                      # Cliente Axios con interceptores
│   ├── productosService.ts         # Endpoints de productos
│   └── pedidosService.ts           # Endpoints de pedidos
├── hooks/                          
│   └── useAuth.ts                  # Hook de autenticacion
└── types/                         
    └── index.ts                    # Interfaces de DTOs y modelos
```

## Proposito

- **pages**: Vistas completas con logica de negocio y UI
- **components**: Componentes compartidos para layout y proteccion de rutas
- **stores**: Gestion de estado global con Zustand (usuario autenticado, token)
- **services**: Abstracciones para consumir endpoints del backend
- **hooks**: Logica reutilizable de React (autenticacion wrapper)
- **types**: Definiciones de tipos compartidas con el backend

## Notas

- Autenticacion JWT con tokens en sessionStorage
- Interceptores Axios para agregar token y manejar 401
- Rutas protegidas por autenticacion y rol de usuario
- Validaciones client-side con alertas SweetAlert2
- Estilos con Tailwind CSS y estilos inline
- Iconos con lucide-react

## Documentacion adicional

- [Backend API](../Backend/ERPZapateria.API/ERPZapateria.API/README.md)
- [Application Layer](../Backend/ERPZapateria.Application/README.md)
- [Database Schema](../DataBase/README.md)

