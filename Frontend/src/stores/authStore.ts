import { create } from 'zustand'
import { jwtDecode } from 'jwt-decode'

// Interfaz del usuario autenticado
interface Usuario {
  idUsuario: number
  username: string
  rol: string
}

// Interfaz de payload JWT decodificado
interface JwtPayload {
  exp: number
  [key: string]: any
}

/**
 * Store de Zustand para manejo global de autenticación.
 * Mantiene el estado del usuario, token y métodos de login/logout.
 */
export const useAuthStore = create<{
  token: string | null
  usuario: Usuario | null
  isAuthenticated: boolean
  isLoading: boolean

  login: (credentials: { username: string; password: string }) => Promise<void>
  logout: () => void
  loadTokenFromStorage: () => void
}>((set) => ({
  token: null,
  usuario: null,
  isAuthenticated: false,
  isLoading: false,

  // Función de login - Autentica usuario con API
  login: async (credentials) => {
    set({ isLoading: true })

    // Realizar solicitud de login al backend
    const response = await fetch('http://localhost:5017/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      set({ isLoading: false })
      throw new Error('Credenciales inválidas')
    }

    // Decodificar token JWT recibido
    const data = await response.json()
    const token = data.token
    const decoded = jwtDecode<JwtPayload>(token)

    const usuario: Usuario = {
      idUsuario: parseInt(
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
      ),
      username:
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
      rol:
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
    }

    // Guardar token en sessionStorage
    sessionStorage.setItem('token', token)

    // Actualizar estado con datos del usuario
    set({
      token,
      usuario,
      isAuthenticated: true,
      isLoading: false,
    })

    // Iniciar temporizador de expiración del token
    startExpirationTimer(token)
  },

  // Función de logout - Limpiar sesión
  logout: () => {
    sessionStorage.removeItem('token')
    set({
      token: null,
      usuario: null,
      isAuthenticated: false,
    })
  },

  // Cargar token desde sessionStorage al iniciar
  loadTokenFromStorage: () => {
    const token = sessionStorage.getItem('token')

    if (!token) return

    try {
      const decoded = jwtDecode<JwtPayload>(token)

      // Verificar si el token ha expirado
      if (decoded.exp * 1000 < Date.now()) {
        sessionStorage.removeItem('token')
        return
      }

      const usuario: Usuario = {
        idUsuario: parseInt(
          decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
        ),
        username:
          decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
        rol:
          decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
      }

      set({
        token,
        usuario,
        isAuthenticated: true,
      })

      startExpirationTimer(token)
    } catch {
      sessionStorage.removeItem('token')
    }
  },
}))

function startExpirationTimer(token: string) {
  const decoded = jwtDecode<JwtPayload>(token)
  const expirationTime = decoded.exp * 1000
  const timeout = expirationTime - Date.now()

  if (timeout > 0) {
    setTimeout(() => {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }, timeout)
  }
}
