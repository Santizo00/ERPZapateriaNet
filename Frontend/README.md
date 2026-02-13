# Frontend - ERPZapatería

Interfaz de usuario en React + TypeScript + Vite. Gestión de productos, pedidos, usuarios y clientes.

---

## ⚙️ Requisitos

- Node.js 16+
- npm o yarn
- Backend API en http://localhost:5000

---

## 🚀 Instalación

### 1. Instalar dependencias
```bash
cd Frontend
npm install
```

### 2. Configurar API

Crear/editar `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Ejecutar en desarrollo
```bash
npm run dev
# Frontend en http://localhost:5173
```

### 4. Build para producción
```bash
npm run build
# Carpeta dist/ lista para deploy
```

---

## 📁 Estructura

```
src/
├── pages/
│   ├── LoginPage.tsx           # Autenticación
│   ├── DashboardPage.tsx       # Inicio
│   ├── ProductosPage.tsx       # Gestión productos
│   ├── PedidosPage.tsx         # Gestión pedidos
│   ├── UsuariosPage.tsx        # Gestión usuarios (Admin)
│   └── ClientesPage.tsx        # Consulta clientes
├── components/
│   ├── DashboardLayout.tsx     # Layout con sidebar
│   ├── ProtectedRoute.tsx      # Rutas autenticadas
│   └── ProtectedRoleRoute.tsx  # Rutas por rol
├── stores/
│   └── authStore.ts            # Zustand (autenticación)
├── services/
│   └── api.ts                  # Axios con JWT interceptor
└── App.tsx                     # Componente raíz
```

---

## 🔐 Autenticación

- Login: username + password
- Token guardado en sessionStorage
- Cierra sesión al cerrar navegador
- Interceptor agrega JWT a todas las requests

---

## 🛠️ Tecnologías

- React 18 + TypeScript
- Vite (bundler)
- Tailwind CSS (estilos)
- Zustand (estado)
- Axios (HTTP)
- SweetAlert2 (diálogos)

---

## 📚 Documentación Adicional

- [README General](../../README.md)
- [Backend API](../../Backend/README.md)
- [Application Layer](../../Backend/ERPZapateria.Application/README.md)
- [Base de Datos](../../DataBase/README.md)
