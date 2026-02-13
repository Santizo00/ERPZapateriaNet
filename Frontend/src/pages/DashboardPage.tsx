import { DashboardLayout } from '../components/DashboardLayout'
import { Footprints } from 'lucide-react'

export const DashboardPage = () => {
  return (
    <DashboardLayout title="Inicio">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Welcome Card */}
        <div
          style={{
            backgroundColor: '#1a1714',
            border: '1px solid #2a2420',
            borderRadius: '12px',
            padding: '32px',
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <Footprints size={48} color="#c2783c" />
          </div>
          <h2 style={{ color: '#ede8df', fontSize: '24px', fontWeight: 600, margin: '0 0 8px 0' }}>
            Bienvenido a ERPZapatería
          </h2>
          <p style={{ color: '#8b7355', margin: 0 }}>
            Sistema de gestión integral para tu negocio de calzado
          </p>
        </div>

        {/* Quick Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
          }}
        >
          {[
            { label: 'Productos', value: '0', color: '#c2783c' },
            { label: 'Pedidos', value: '0', color: '#8b7355' },
            { label: 'Usuarios', value: '0', color: '#6b7355' },
            { label: 'Ganancias', value: '$0.00', color: '#a6644d' },
          ].map((stat, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#1a1714',
                border: '1px solid #2a2420',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
              }}
            >
              <p style={{ color: '#8b7355', margin: '0 0 8px 0', fontSize: '13px', fontWeight: 600 }}>
                {stat.label}
              </p>
              <p style={{ color: stat.color, fontSize: '32px', fontWeight: 600, margin: 0 }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Info Cards */}
        <div
          style={{
            backgroundColor: '#1a1714',
            border: '1px solid #2a2420',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <h3 style={{ color: '#ede8df', fontSize: '16px', fontWeight: 600, marginTop: 0 }}>
            Información del Sistema
          </h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #2a2420', paddingBottom: '12px' }}>
              <span style={{ color: '#8b7355' }}>Estado de Autenticación:</span>
              <span style={{ color: '#c2783c', fontWeight: 600 }}>✓ Autenticado con JWT</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #2a2420', paddingBottom: '12px' }}>
              <span style={{ color: '#8b7355' }}>Validación de Token:</span>
              <span style={{ color: '#c2783c', fontWeight: 600 }}>✓ Activo</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px' }}>
              <span style={{ color: '#8b7355' }}>Sesión Sincronizada:</span>
              <span style={{ color: '#c2783c', fontWeight: 600 }}>✓ Entre pestañas</span>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div
          style={{
            backgroundColor: 'rgba(194, 120, 60, 0.1)',
            border: '1px solid #c2783c',
            borderRadius: '12px',
            padding: '16px',
          }}
        >
          <p style={{ color: '#ede8df', margin: '0 0 8px 0', fontWeight: 600, fontSize: '14px' }}>
            💡 Tip de Seguridad
          </p>
          <p style={{ color: '#8b7355', margin: 0, fontSize: '13px' }}>
            Tu sesión se valida automáticamente con JWT en cada solicitud. Si intentas navegar sin autenticación, serás redirigido a login.
            Tu sesión también se sincroniza entre todas las pestañas abiertas.
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
