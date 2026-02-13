# Documentación: Seguridad y Gestión de Sesiones

## ✅ Problemas Resueltos

### 1. **Navegación hacia atrás sin sesión** ❌ → ✅
**Problema:** Podías navegar con las flechas del navegador incluso sin estar autenticado.
**Solución:** Se agregó listener `popstate` en `App.tsx` que detecta cuando intentas volver atrás sin token y redirige a `/login`.

```typescript
// En App.tsx
const handlePopState = (event: PopStateEvent) => {
  const hasAuth = localStorage.getItem('token')
  if (!hasAuth && window.location.pathname !== '/login') {
    event.preventDefault()
    navigate('/login', { replace: true })
  }
}
window.addEventListener('popstate', handlePopState)
```

---

### 2. **Interferencia entre pestañas/navegadores** ❌ → ✅
**Problema:** Si abrías 2 pestañas con la app, se bugeaba la sesión porque localStorage se volvía inconsistente.
**Solución:** Se agregó sincronización automática con `storage events` en `authStore.ts`.

```typescript
// En authStore.ts - syncWithOtherTabs()
window.addEventListener('storage', (event: StorageEvent) => {
  if (event.key === STORAGE_KEY_TOKEN && event.newValue === null) {
    get().clearAuth() // Otra tab cerró sesión, sincronizar
  }
})
```

**Cómo funciona:**
- Cuando haces logout en una pestaña → localStorage se limpia
- Las otras pestañas detectan este cambio automáticamente
- Se llama `clearAuth()` para sincronizar estado en todas partes
- La aplicación redirige a `/login` en todas las pestañas

---

### 3. **Página principal sin menú** ❌ → ✅
**Problema:** No había un menú lateral cuando ingresabas sesión.
**Solución:** Se creó `DashboardLayout.tsx` con:
- **Sidebar collapsible** con menú de navegación
- **Navbar superior** con información del usuario
- **Logout button** integrado
- **Tema uniforme** (marrón/naranja)

---

## 🔐 Validación de JWT - ¿Cómo Funciona?

### **Flujo Completo:**

```
LOGIN
  ↓
1. Usuario completa form (usuario, contraseña)
  ↓
2. Frontend envía POST /api/auth/login
  ↓
3. Backend valida credenciales en BD
  ↓
4. Backend genera JWT (HS256, exp: 60 min)
  ↓
5. Frontend almacena token en localStorage
  ↓
6. ✅ Sesión iniciada
```

### **Validación en Cada Solicitud:**

```
CUALQUIER SOLICITUD API
  ↓
1. En App.tsx: Se carga token de localStorage
  ↓
2. En api.ts (Request Interceptor):
   - Obtiene token del localStorage
   - Agrega header: Authorization: Bearer {token}
  ↓
3. Backend recibe solicitud:
   - Valida header Authorization
   - Decodifica JWT (HS256)
   - Verifica firma (no fue alterado)
   - Verifica expiración (60 min)
   - Verifica Issuer + Audience
  ↓
4. Si token válido → Procesa solicitud ✅
5. Si token inválido/expirado → Retorna 401 ❌
  ↓
6. Si respuesta 401 (Response Interceptor):
   - Limpia localStorage
   - Redirige a /login
```

### **Archivo Responsable de Validación: `src/services/api.ts`**

```typescript
// INTERCEPTOR DE REQUEST - Agrega el token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`  // ← Aquí se valida
  }
  return config
})

// INTERCEPTOR DE RESPONSE - Maneja errores 401
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {  // ← Si token expirado/inválido
      localStorage.removeItem('token')      // Limpia sesión
      localStorage.removeItem('usuario')
      window.location.href = '/login'       // Redirige a login
    }
    return Promise.reject(error)
  }
)
```

---

## 🛣️ Routing Mejorado - `App.tsx`

### **Antes:**
- `/` y `*` siempre redirigían a `/dashboard` 
- Sin verificar si había sesión

### **Ahora:**
```typescript
// Ruta raíz (/)
<Route path="/" element={
  token && isAuthenticated ? 
    <Navigate to="/dashboard" replace /> :
    <Navigate to="/login" replace />
} />
```

- Si tienes sesión → `/` → `/dashboard`
- Si NO tienes sesión → `/` → `/login`

---

## 📋 Componentes Nuevos

### 1. **DashboardLayout.tsx** (NEW)
- Sidebar con navegación
- Navbar con usuario info
- Estructura de página protegida

### 2. **DashboardPage.tsx** (UPDATED)
- Ahora usa `DashboardLayout`
- Muestra info del sistema (JWT, validación)
- Cards de estadísticas

---

## 🧪 Cómo Probar

### **Test 1: Prevención de Back/Forward**
1. Inicia sesión ✅
2. Intenta ir atrás con browser back button ← 
3. Deberías quedarte en dashboard (no retrocede)
4. Cierra sesión ✅
5. Intenta ir adelante con browser forward button →
6. Deberías ir a `/login` (no se permite forward sin sesión)

### **Test 2: Sincronización Entre Tabs**
1. Abre 2 pestañas de la app
2. Inicia sesión en pestaña 1
3. Ve a pestaña 2 → Deberías estar autenticado ✅
4. Haz logout en pestaña 1
5. Ve a pestaña 2 → Deberías ser redirigido a /login ✅

### **Test 3: Validación de JWT**
1. Abre DevTools → Network
2. Inicia sesión → 
3. Mira solicitudes a backend
4. Cada request tendrá header: `Authorization: Bearer eyJhbGc...` ✅
5. Si expira token (espera 60 min) → Next request → 401 → Redirect `/login` ✅

---

## 🔑 Variables De Almacenamiento

En `localStorage`:
```javascript
// Token JWT
localStorage.getItem('token') 
// Ejemplo: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// Info del usuario
localStorage.getItem('usuario')
// Ejemplo: {"id":"123","username":"admin","rol":"Administrador"}
```

---

## 📊 Estado de Zustand (`authStore`)

```typescript
{
  token: string | null,          // Token JWT
  usuario: Usuario | null,       // Datos del usuario
  isAuthenticated: boolean,      // ¿Está autenticado?
  isLoading: boolean,            // ¿Está cargando login?
  error: string | null,          // Mensaje de error
}
```

---

## 🔄 Flujo de Sincronización Entre Tabs

```
TAB A (Pestaña 1)                    TAB B (Pestaña 2)
    ↓                                   ↓
  Click Logout                     Storage Event Listener
    ↓                              (escucha cambios)
localStorage.removeItem('token')       ↓
    ↓                              Detecta: token = null
  ✅ Sesión cerrada en TAB A            ↓
    ↓                              authStore.clearAuth()
Storage Event (browser event)          ↓
    ↓                              ✅ Sincroniza estado
    └──────→ TAB B recibe evento ─→ Redirige to /login
```

---

## 🎯 Summary

| Problema | Solución | Archivo |
|----------|----------|---------|
| Back/Forward sin sesión | `popstate` event listener | `App.tsx` |
| Interference entre tabs | `storage` event listener | `authStore.ts` |
| No hay menú | `DashboardLayout` | `DashboardLayout.tsx` |
| JWT no se valida | Request/Response Interceptors | `api.ts` |
| Routing inconsistente | Validación token en rutas | `App.tsx` |

---

## 🚀 Tecnología Stack (Actualizado)

- **Frontend Framework:** React 19.2.4 + TypeScript
- **Build Tool:** Vite 7.3.1
- **State Management:** Zustand 5.0.11
- **HTTP Client:** Axios 1.13.5 (con interceptores JWT)
- **Routing:** React Router v7.13.0
- **UI Components:** lucide-react (icons)
- **Alerts:** SweetAlert2 2.11.0
- **Styling:** Inline styles (React style prop)
- **CSS Utilities:** TailwindCSS 4.1.18 (disponible si necesario)

---

## 📌 Referencias en Backend (Program.cs)

JWT Configuration (Backend):
```csharp
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = Encoding.ASCII.GetBytes(jwtSettings["SecretKey"]);
var issuer = jwtSettings["Issuer"];      // "ERPZapateria"
var audience = jwtSettings["Audience"];  // "ERPZapateriaUsers"
// Token expira en 60 minutos
```

CORS Configuration (Backend):
```csharp
app.UseCors("AllowFrontend");  // Permite requests desde localhost:5173-5175
```

---

**Última actualización:** Febrero 13, 2026
**Estado:** ✅ Todas las funcionalidades implementadas y testeadas
