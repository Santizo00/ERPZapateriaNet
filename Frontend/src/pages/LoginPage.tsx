import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Lock, Eye, EyeOff, LogIn, Footprints } from 'lucide-react'
import Swal from 'sweetalert2'
import { useAuthStore } from '../stores/authStore'
import type { LoginRequest } from '../types'

export const LoginPage = () => {
  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()

  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [mostrarContrasena, setMostrarContrasena] = useState(false)
  const [focusUsuario, setFocusUsuario] = useState(false)
  const [focusContrasena, setFocusContrasena] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validaciones
    if (!usuario.trim() && !contrasena.trim()) {
      await Swal.fire({
        icon: 'warning',
        title: 'Campos vacíos',
        text: 'Por favor ingresa tu usuario y contraseña',
        confirmButtonColor: '#c2783c',
        background: '#1a1714',
        color: '#ede8df',
      })
      return
    }

    if (!usuario.trim()) {
      await Swal.fire({
        icon: 'error',
        title: 'Usuario requerido',
        text: 'Por favor ingresa tu nombre de usuario',
        confirmButtonColor: '#c2783c',
        background: '#1a1714',
        color: '#ede8df',
      })
      return
    }

    if (!contrasena.trim()) {
      await Swal.fire({
        icon: 'error',
        title: 'Contraseña requerida',
        text: 'Por favor ingresa tu contraseña',
        confirmButtonColor: '#c2783c',
        background: '#1a1714',
        color: '#ede8df',
      })
      return
    }

    // Intentar login
    try {
      const credentials: LoginRequest = {
        username: usuario,
        password: contrasena,
      }

      await login(credentials)

      await Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: `Hola, ${usuario}`,
        confirmButtonColor: '#c2783c',
        background: '#1a1714',
        color: '#ede8df',
        timer: 1500,
        showConfirmButton: false,
      })

      navigate('/dashboard')
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión'

      await Swal.fire({
        icon: 'error',
        title: 'Error de Autenticación',
        text: errorMessage,
        confirmButtonColor: '#c2783c',
        background: '#1a1714',
        color: '#ede8df',
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#0f0d0a' }}>
      {/* Resplandor sutil de fondo */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            left: '-100px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(194, 120, 60, 0.05)',
            filter: 'blur(80px)',
          }}
        ></div>
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            right: '-100px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(194, 120, 60, 0.05)',
            filter: 'blur(80px)',
          }}
        ></div>
      </div>

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '400px' }}>
        {/* Logo y título */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              margin: '0 auto 16px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(194, 120, 60, 0.1)',
            }}
          >
            <Footprints size={28} color="#c2783c" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#ede8df', margin: '0 0 8px 0', fontFamily: 'serif' }}>
            ERPZapatería
          </h1>
          <h2 style={{ fontSize: '14px', color: '#8b7355', margin: 0 }}>
            Inicia sesión en tu cuenta
          </h2>
        </div>

        {/* Card del formulario */}
        <div
          style={{
            backgroundColor: '#1a1714',
            borderRadius: '12px',
            padding: '32px',
            border: '1px solid #2a2420',
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Campo Usuario */}
            <div>
              <label
                htmlFor="usuario"
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#8b7355',
                  marginBottom: '8px',
                }}
              >
                Usuario
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  borderRadius: '12px',
                  border: `1px solid ${focusUsuario ? 'rgba(194, 120, 60, 0.6)' : '#2a2420'}`,
                  padding: '12px 16px',
                  backgroundColor: focusUsuario ? '#1a1714' : 'rgba(26, 23, 20, 0.5)',
                  transition: 'all 0.2s ease',
                }}
              >
                <User
                  size={16}
                  color={focusUsuario ? '#c2783c' : '#8b7355'}
                  style={{ flexShrink: 0 }}
                />
                <input
                  id="usuario"
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  onFocus={() => setFocusUsuario(true)}
                  onBlur={() => setFocusUsuario(false)}
                  placeholder="Ingresa tu usuario"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    backgroundColor: 'transparent',
                    fontSize: '14px',
                    color: '#ede8df',
                    outline: 'none',
                    border: 'none',
                    fontFamily: 'inherit',
                  }}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div>
              <label
                htmlFor="contrasena"
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#8b7355',
                  marginBottom: '8px',
                }}
              >
                Contraseña
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  borderRadius: '12px',
                  border: `1px solid ${focusContrasena ? 'rgba(194, 120, 60, 0.6)' : '#2a2420'}`,
                  padding: '12px 16px',
                  backgroundColor: focusContrasena ? '#1a1714' : 'rgba(26, 23, 20, 0.5)',
                  transition: 'all 0.2s ease',
                }}
              >
                <Lock
                  size={16}
                  color={focusContrasena ? '#c2783c' : '#8b7355'}
                  style={{ flexShrink: 0 }}
                />
                <input
                  id="contrasena"
                  type={mostrarContrasena ? 'text' : 'password'}
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  onFocus={() => setFocusContrasena(true)}
                  onBlur={() => setFocusContrasena(false)}
                  placeholder="Ingresa tu contraseña"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    backgroundColor: 'transparent',
                    fontSize: '14px',
                    color: '#ede8df',
                    outline: 'none',
                    border: 'none',
                    fontFamily: 'inherit',
                  }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setMostrarContrasena(!mostrarContrasena)}
                  disabled={isLoading}
                  style={{
                    flexShrink: 0,
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#8b7355',
                    transition: 'color 0.2s ease',
                    padding: 0,
                  }}
                  onMouseEnter={(e) => {
                    ;(e.target as HTMLButtonElement).style.color = '#c2783c'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.target as HTMLButtonElement).style.color = '#8b7355'
                  }}
                >
                  {mostrarContrasena ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Botón Ingresar */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                borderRadius: '12px',
                backgroundColor: isLoading ? '#a6592e' : '#c2783c',
                color: 'white',
                fontSize: '14px',
                fontWeight: 600,
                padding: '12px 16px',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: isLoading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  ;(e.target as HTMLButtonElement).style.filter = 'brightness(1.1)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  ;(e.target as HTMLButtonElement).style.filter = 'brightness(1)'
                }
              }}
            >
              <LogIn size={16} />
              {isLoading ? 'Iniciando sesión...' : 'Ingresar'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p
          style={{
            marginTop: '32px',
            textAlign: 'center',
            fontSize: '12px',
            color: 'rgba(139, 115, 85, 0.6)',
          }}
        >
        </p>
      </div>
    </div>
  )
}
