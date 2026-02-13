import axios from 'axios'
import type { AxiosInstance, AxiosError } from 'axios'

// URL base de la API REST del backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5017/api'

// Crear instancia de Axios con configuración base
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor de solicitudes - Agregar token JWT al header Authorization
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor de respuestas - Manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido - limpiar sesión y redirigir a login
      sessionStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
