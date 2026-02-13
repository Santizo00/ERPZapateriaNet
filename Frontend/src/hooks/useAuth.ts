import { useAuthStore } from '../stores/authStore'
import type { LoginRequest } from '../types'

/**
 * Hook personalizado para manejo de autenticación.
 * Proporciona funciones login/logout y estado de autenticación.
 */
export const useAuth = () => {
  const { token, usuario, isAuthenticated, isLoading, error, login, logout } = useAuthStore()

  // Manejar login con manejo de errores
  const handleLogin = async (credentials: LoginRequest) => {
    try {
      await login(credentials)
      return true
    } catch (err) {
      return false
    }
  }

  // Manejar logout
  const handleLogout = () => {
    logout()
  }

  return {
    token,
    usuario,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    logout: handleLogout,
  }
}
