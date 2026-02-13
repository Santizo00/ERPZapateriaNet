# Módulo de Productos - Sistema de Roles

## 🎯 Resumen

Se ha implementado el módulo de **Gestión de Productos** con control de acceso basado en roles:

```
Admin (Administrador)          Vendedor
├─ Ver productos              ├─ Ver productos
├─ Crear productos ✅         ├─ Editar productos
├─ Editar productos ✅        └─ No: Crear
├─ Eliminar productos ✅      └─ No: Eliminar
└─ Acceso a "Crear Producto"
```

---

## 📂 Archivos Nuevos Creados

### 1. **`ProtectedRoleRoute.tsx`** (Componente)
Componente wrapper que valida si el usuario tiene un rol permitido para acceder a una ruta.

```typescript
<ProtectedRoleRoute allowedRoles={['Administrador']}>
  <ProductoFormPage />
</ProtectedRoleRoute>
```

- Si el usuario NO tiene uno de los roles permitidos → Redirige a `/dashboard`
- Si el usuario NO está autenticado → Redirige a `/login`

### 2. **`ProductosPage.tsx`** (página)
Página de listado de productos con:
- ✅ Tabla de productos
- ✅ Botón "Crear Producto" (SOLO para Admin)
- ✅ Botones "Editar" y "Eliminar" (SOLO para Admin)
- ✅ Carga de productos desde API (`GET /api/productos`)
- ✅ Eliminación con confirmación SweetAlert2
- ✅ Validaciones de permisos

**Acceso:** `/dashboard/productos`
**Roles permitidos:** `Administrador`, `Vendedor`

### 3. **`ProductoFormPage.tsx`** (página)
Página para crear y editar productos con:
- ✅ Formulario con validación
- ✅ Campos: Nombre*, Descripción, Precio*, Stock*, Talla (opcional), Color (opcional)
- ✅ Modo creación: `POST /api/productos`
- ✅ Modo edición: `GET /api/productos/{id}` + `PUT /api/productos/{id}`
- ✅ Botones Cancelar y Guardar

**Crear:** `/dashboard/productos/crear` (Solo Admin)
**Editar:** `/dashboard/productos/:id/editar` (Solo Admin)

---

## 📊 Actualización de Archivos Existentes

### **`DashboardLayout.tsx`** (actualizado)
Se agregó validación de roles en el menú sidebar:

```typescript
const menuItems = [
  { label: 'Inicio', roles: ['Administrador', 'Vendedor'] },
  { label: 'Productos', roles: ['Administrador', 'Vendedor'] },
  { label: 'Crear Producto', roles: ['Administrador'] },  // NUEVO
  { label: 'Pedidos', roles: ['Administrador', 'Vendedor'] },
  { label: 'Usuarios', roles: ['Administrador'] },
]

// Filtrar menú según rol
const filteredMenuItems = menuItems.filter((item) => 
  item.roles.includes(usuario?.rol || '')
)
```

**Resultado visual:**
- ✅ Admin ve: Inicio, Productos, **Crear Producto**, Pedidos, Usuarios
- ✅ Vendedor ve: Inicio, Productos, Pedidos (sin "Crear Producto" ni "Usuarios")

### **`App.tsx`** (actualizado)
Se agregaron 3 rutas nuevas:

```typescript
// 1. Listado de Productos (Admin + Vendedor)
<Route path="/dashboard/productos" element={
  <ProtectedRoute>
    <ProtectedRoleRoute allowedRoles={['Administrador', 'Vendedor']}>
      <ProductosPage />
    </ProtectedRoleRoute>
  </ProtectedRoute>
} />

// 2. Crear Producto (Solo Admin)
<Route path="/dashboard/productos/crear" element={
  <ProtectedRoute>
    <ProtectedRoleRoute allowedRoles={['Administrador']}>
      <ProductoFormPage />
    </ProtectedRoleRoute>
  </ProtectedRoute>
} />

// 3. Editar Producto (Solo Admin)
<Route path="/dashboard/productos/:id/editar" element={
  <ProtectedRoute>
    <ProtectedRoleRoute allowedRoles={['Administrador']}>
      <ProductoFormPage />
    </ProtectedRoleRoute>
  </ProtectedRoute>
} />
```

---

## 🔐 Flujo de Control de Acceso

```
Usuario intenta acceder a /dashboard/productos/crear
              ↓
ProtectedRoute valida:
  ✓ ¿Tiene token? 
  ✓ ¿isAuthenticated = true?
              ↓
            SÍ → Continúa
            NO → Redirige a /login
              ↓
ProtectedRoleRoute valida:
  ✓ ¿usuario.rol está en allowedRoles?
              ↓
            SÍ → Renderiza ProductoFormPage
            NO → Redirige a /dashboard
```

---

## ✨ Features por Rol

### **ADMINISTRADOR**
```
✅ Ver todos los productos
✅ Crear nuevos productos
✅ Editar productos existentes
✅ Eliminar productos
✅ Acceder a "Crear Producto" en sidebar
✅ Acceder a "Usuarios" en sidebar
```

### **VENDEDOR**
```
✅ Ver todos los productos
✅ Editar productos     (❌ Bloqueado en UI - botón deshabilitado)
✅ Acceder a Productos en sidebar
❌ NO puede crear
❌ NO puede eliminar
❌ NO ve "Crear Producto" en sidebar
❌ NO se "Usuarios" en sidebar
```

---

## 🧪 Testing

### **Test 1: Acceso de Admin**
```
1. Login con admin/admin123
2. Sidebar debe mostrar:
   ✅ Inicio
   ✅ Productos
   ✅ Crear Producto    (bot adicional)
   ✅ Pedidos
   ✅ Usuarios
3. Click en "Productos" → Muestra tabla con botones
   ✅ Crear Producto (verde)
   ✅ Editar (gris)
   ✅ Eliminar (rojo)
4. Click en "Crear Producto" → Formulario nuevo
5. Click en Editar en tabla → Carga el producto
6. Click en "Crear Producto" en sidebar → Va a /dashboard/productos/crear
```

### **Test 2: Acceso de Vendedor**
```
1. Login como Vendedor (si existe ese usuario)
2. Sidebar debe mostrar:
   ✅ Inicio
   ✅ Productos
   ✅ Pedidos
   ❌ Crear Producto (NO visible)
   ❌ Usuarios (NO visible)
3. Click en "Productos" → Muestra tabla
   ❌ Crear Producto (NO visible)
   ❌ Editar/Eliminar (NO visible)
4. Intenta acceder directamente a /dashboard/productos/crear
   → Redirige a /dashboard (no tiene permiso)
```

### **Test 3: Intento de Bypass**
```
1. Login como Vendedor
2. Abre DevTools → Console
3. Intenta navegar a /dashboard/productos/crear directamente
4. ProtectedRoleRoute detecta rol ≠ Administrador
5. Redirige automáticamente a /dashboard ✅
```

---

## 🌐 Endpoints API Requeridos

```
GET    /api/productos              → Lista todos los productos
GET    /api/productos/{id}         → Obtiene un producto
POST   /api/productos              → Crea producto (Admin)
PUT    /api/productos/{id}         → Edita producto (Admin)
DELETE /api/productos/{id}         → Elimina producto (Admin)
```

**Headers requeridos:**
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**Backend debe validar:**
- Token JWT válido en header Authorization
- Si es POST/PUT/DELETE → Usuario.Rol = "Administrador"

---

## 📋 Estructura de Datos - Producto

```typescript
interface Producto {
  id: string
  nombre: string           // Requerido (ej: Zapato de niño)
  descripcion: string      // Opcional
  precio: number          // Requerido, > 0
  stock: number           // Requerido, >= 0
  talla?: string          // Opcional (ej: 35, 36, 37)
  color?: string          // Opcional (ej: Negro, Rojo)
}
```

---

## 🎨 UI/UX Detalles

### **ProductosPage (Tabla)**
- Header con título y botón "Crear Producto" (si es Admin)
- Tabla con filas hover efecto
- Columnas: Nombre, Descripción, Precio, Stock, Acciones
- Acciones: Editar (gris), Eliminar (rojo) - solo si Admin
- Empty state si no hay productos
- Loading state mientras carga

### **ProductoFormPage**
- Breadcrumb "Volver a Productos"
- Formulario en card con borde marrón
- Campos con validación e inputs enfocables
- Botones: Cancelar, Guardar (con loading)
- Mensajes SweetAlert ingegrados para éxito/error

### **Sidebar de DashboardLayout**
- Menú filtrado según `usuario.rol`
- Items con hover effects
- Solo muestra opciones permitidas
- "Crear Producto" aparece como item adicional si se accede como Admin

---

## 🔄 Flujo Completo de Creación

```
1. Admin verifica "Crear Producto" en sidebar
2. Click → Navega a /dashboard/productos/crear
3. ProtectedRoleRoute valida: ✓ Administrador
4. ProductoFormPage carga (modo creación)
5. Admin completa formulario:
   - Nombre: "Zapato deportivo"
   - Precio: 99.99
   - Stock: 50
6. Click "Crear"
7. Validación frontend:
   ✓ Nombre no vacío
   ✓ Precio > 0
   ✓ Stock >= 0
8. POST /api/productos {nombre, precio, stock, ...}
9. Respuesta 200 OK
10. SweetAlert success
11. Redirige a /dashboard/productos
12. Producto aparece en tabla
```

---

## 🔄 Flujo Completo de Edición (Admin)

```
1. Admin verifica tabla en /dashboard/productos
2. Click "Editar" en fila
3. Navega a /dashboard/productos/{id}/editar
4. ProductoFormPage carga producto:
   GET /api/productos/{id}
5. Formulario se llena con datos actuales
6. Admin modifica campos
7. Click "Actualizar"
8. Validación igual que creación
9. PUT /api/productos/{id} {nombre, precio, stock, ...}
10. Respuesta 200 OK
11. SweetAlert success
12. Redirige a /dashboard/productos
```

---

## ⚠️ Intentos de Acceso No Autorizados

### **Vendedor intenta editar**
```
Vendedor abre /dashboard/productos
Tabla se carga pero:
❌ No ve botón "Crear Producto" (header)
❌ No ve botones Editar/Eliminar (acciones)
```

### **Vendedor intenta acceder a /dashboard/productos/crear**
```
1. URL: http://localhost:5176/dashboard/productos/crear
2. ProtectedRoute: ✓ Token válido
3. ProtectedRoleRoute: ✗ Rol = "Vendedor" no en ["Administrador"]
4. Redirige a /dashboard
```

### **Vendedor intenta editar por URL**
```
1. URL: http://localhost:5176/dashboard/productos/123/editar
2. ProtectedRoute: ✓ Token válido
3. ProtectedRoleRoute: ✗ Rol = "Vendedor" no en ["Administrador"]
4. Redirige a /dashboard
```

### **Backend rechaza creación de Vendedor**
```
Si un Vendedor intenta POST /api/productos:
Backend valida JWT y rol
← 403 Forbidden: "No tienes permisos para crear productos"
```

---

## 📦 Build Status

```
✅ 1782 módulos transformados
✅ CSS: 2.87 kB (gzip: 1.02 kB)
✅ JS: 381.35 kB (gzip: 116.75 kB)
✅ Build time: 2.52s
✅ 0 TypeScript errors
```

---

## 🚀 Próximos Pasos

1. **Backend:** Implementar endpoints `/api/productos` con validación JWT
2. **Testing:** Verificar control de acceso por rol en backend
3. **Módulo Pedidos:** Aplicar mismo patrón de roles (crear, ver, editar)
4. **Módulo Usuarios:** Crear CRU (Create, Read, Update) - solo Admin

---

## 📌 Componentes Reutilizables Creados

| Componente | Ubicación | Propósito |
|-----------|-----------|----------|
| ProtectedRoleRoute | `components/` | Validar roles en rutas |
| ProductosPage | `pages/` | Listado de productos |
| ProductoFormPage | `pages/` | Crear/editar productos |
| DashboardLayout | `components/` | Layout con sidebar filtrado |

---

## 🔑 Variables de Redux/Store

En `useAuthStore`:
- `usuario.rol` → "Administrador" o "Vendedor"
- Usado para filtrar menú
- Usado para mostrar/ocultar botones
- Validado en ProtectedRoleRoute

---

**Última actualización:** Febrero 13, 2026
**Estado:** ✅ Módulo de Productos implementado con control de roles
