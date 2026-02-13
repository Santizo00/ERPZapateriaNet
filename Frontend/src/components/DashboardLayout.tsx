import { useAuthStore } from '../stores/authStore'
import { LogOut, Home, Package, ShoppingCart, Users, Menu, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useEffect, useState } from 'react'

interface LayoutProps {
  children: React.ReactNode
  title?: string
}

/**
 * Componente de layout para el dashboard.
 * Proporciona sidebar, navbar y estructura base para las páginas.
 */
export const DashboardLayout = ({ children, title }: LayoutProps) => {
  const { usuario, logout } = useAuthStore()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 900
      setIsMobile(mobile)
      setSidebarOpen(!mobile)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Manejar logout con confirmación
  const handleLogout = async () => {
    const result = await Swal.fire({
      icon: 'question',
      title: '¿Cerrar sesión?',
      text: 'Serás desconectado del sistema',
      confirmButtonColor: '#c2783c',
      background: '#1a1714',
      color: '#ede8df',
      showCancelButton: true,
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
    })

    if (result.isConfirmed) {
      logout()
      await Swal.fire({
        icon: 'success',
        title: 'Sesión cerrada',
        text: 'Has cerrado sesión correctamente',
        timer: 1500,
        showConfirmButton: false,
        confirmButtonColor: '#c2783c',
        background: '#1a1714',
        color: '#ede8df',
      })
      navigate('/login', { replace: true })
    }
  }

  // Items del menú del sidebar
  const menuItems = [
    { label: 'Inicio', icon: Home, path: '/dashboard', roles: ['Admin', 'Administrador', 'Vendedor'] },
    { label: 'Productos', icon: Package, path: '/dashboard/productos', roles: ['Admin', 'Administrador', 'Vendedor'] },
    { label: 'Pedidos', icon: ShoppingCart, path: '/dashboard/pedidos', roles: ['Admin', 'Administrador', 'Vendedor'] },
    { label: 'Usuario', icon: Users, path: '/dashboard/usuario', roles: ['Admin', 'Administrador'] },
  ]

  // Filtrar menú según rol del usuario
  const userRole = usuario?.rol || ''
  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(userRole))

  return (
    <div className="dashboard-shell">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        {/* Logo */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid #2a2420',
            textAlign: 'center',
          }}
        >
          <h2 style={{ color: '#ede8df', margin: '0', fontSize: '18px', fontWeight: 600 }}>
            ERPZapatería
          </h2>
        </div>

        {/* Menu Items */}
        <nav style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredMenuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#8b7355',
                cursor: 'pointer',
                borderRadius: '8px',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2a2420'
                ;(e.currentTarget as HTMLButtonElement).style.color = '#c2783c'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
                ;(e.currentTarget as HTMLButtonElement).style.color = '#8b7355'
              }}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Info */}
        <div style={{ padding: '16px', borderTop: '1px solid #2a2420' }}>
          <div style={{ marginBottom: '12px' }}>
            <p style={{ color: '#ede8df', margin: '0 0 4px 0', fontWeight: 600, fontSize: '13px' }}>
              {usuario?.username}
            </p>
            <p style={{ color: '#8b7355', margin: 0, fontSize: '12px' }}>{usuario?.rol}</p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: '#c2783c',
              border: 'none',
              color: 'white',
              padding: '10px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.1)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1)'
            }}
          >
            <LogOut size={16} />
            Salir
          </button>
        </div>
      </aside>

      {isMobile && sidebarOpen && (
        <button
          className="dashboard-overlay"
          aria-label="Cerrar menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Contenido Principal */}
      <div className="dashboard-main">
        {/* Navbar */}
        <header
          style={{
            backgroundColor: '#1a1714',
            borderBottom: '1px solid #2a2420',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="dashboard-menu-toggle"
              aria-label={sidebarOpen ? 'Cerrar menu' : 'Abrir menu'}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 style={{ color: '#ede8df', margin: 0, fontSize: '20px', fontWeight: 600 }}>
              {title || 'Dashboard'}
            </h1>
          </div>
          <div style={{ fontSize: '13px', color: '#8b7355' }}>
            Conectado como <span style={{ color: '#c2783c', fontWeight: 600 }}>{usuario?.username}</span>
          </div>
        </header>

        {/* Contenido */}
        <main
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '24px',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
