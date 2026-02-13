import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

/**
 * Componente que protege rutas basadas en roles de usuario.
 * Valida que el usuario tenga un rol permitido.
 */
export const ProtectedRoleRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode
  allowedRoles: string[]
}) => {
  const { usuario } = useAuthStore()

  // Verificar si el usuario existe y tiene un rol permitido
  if (!usuario || !allowedRoles.includes(usuario.rol)) {
    // Redirigir a dashboard si no tiene permiso
    return <Navigate to="/dashboard" replace />
  }

  // Mostrar contenido si tiene permiso
  return <>{children}</>
}
