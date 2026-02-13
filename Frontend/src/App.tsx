import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ProtectedRoleRoute } from './components/ProtectedRoleRoute'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { ProductosPage } from './pages/ProductosPage'
import { ProductoFormPage } from './pages/ProductoFormPage'
import { PedidosPage } from './pages/PedidosPage'
import { UsuariosPage } from './pages/UsuariosPage'

/**
 * Componente principal de la aplicacion.
 * Define las rutas y proteccion por autenticacion/roles.
 */
function AppContent() {
  const { loadTokenFromStorage, isAuthenticated } = useAuthStore()

  // Cargar token desde sessionStorage al iniciar
  useEffect(() => {
    loadTokenFromStorage()
  }, [])

  return (
    <Routes>
      {/* Ruta de login */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
        }
      />

      {/* Ruta principal del dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Ruta de gestión de productos */}
      <Route
        path="/dashboard/productos"
        element={
          <ProtectedRoute>
            <ProtectedRoleRoute allowedRoles={['Admin', 'Vendedor']}>
              <ProductosPage />
            </ProtectedRoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/productos/crear"
        element={
          <ProtectedRoute>
            <ProtectedRoleRoute allowedRoles={['Admin']}>
              <ProductoFormPage />
            </ProtectedRoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Pedidos */}
      <Route
        path="/dashboard/pedidos"
        element={
          <ProtectedRoute>
            <ProtectedRoleRoute allowedRoles={['Admin', 'Vendedor']}>
              <PedidosPage />
            </ProtectedRoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Usuarios */}
      <Route
        path="/dashboard/usuario"
        element={
          <ProtectedRoute>
            <ProtectedRoleRoute allowedRoles={['Admin', 'Administrador']}>
              <UsuariosPage />
            </ProtectedRoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Default */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
