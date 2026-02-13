import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

/**
 * Componente que protege rutas autenticadas.
 * Redirige a login si el usuario no está autenticado.
 */
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore()

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Mostrar contenido protegido
  return <>{children}</>
}
