import { useEffect, useState } from 'react'
import { DashboardLayout } from '../components/DashboardLayout'
import { Search, Plus, Edit, Trash2 } from 'lucide-react'
import Swal from 'sweetalert2'
import api from '../services/api'

interface UsuarioItem {
  idUsuario: number
  username: string
  idRol: number
  rol: string
  activo: boolean
  fechaCreacion: string
}

interface RolItem {
  idRol: number
  nombre: string
  activo: boolean
}

export const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState<UsuarioItem[]>([])
  const [roles, setRoles] = useState<RolItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchId, setSearchId] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingUsuario, setEditingUsuario] = useState<UsuarioItem | null>(null)

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    idRol: 0,
    activo: true,
  })

  useEffect(() => {
    loadUsuarios()
    loadRoles()
  }, [])

  const normalizeUsuario = (raw: any): UsuarioItem => ({
    idUsuario: raw.IdUsuario ?? raw.idUsuario,
    username: raw.Username ?? raw.username ?? '',
    idRol: raw.IdRol ?? raw.idRol,
    rol: raw.Rol ?? raw.rol ?? '',
    activo: raw.Activo ?? raw.activo ?? false,
    fechaCreacion: raw.FechaCreacion ?? raw.fechaCreacion ?? '',
  })

  const normalizeRol = (raw: any): RolItem => ({
    idRol: raw.IdRol ?? raw.idRol,
    nombre: raw.Nombre ?? raw.nombre ?? '',
    activo: raw.Activo ?? raw.activo ?? false,
  })

  const loadUsuarios = async () => {
    try {
      setLoading(true)
      const { data } = await api.get<UsuarioItem[]>('/usuarios')
      setUsuarios(data.map(normalizeUsuario))
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al cargar usuarios',
        confirmButtonColor: '#c2783c',
        background: '#1a1714',
        color: '#ede8df',
      })
    } finally {
      setLoading(false)
    }
  }

  const loadRoles = async () => {
    try {
      const { data } = await api.get<RolItem[]>('/roles')
      setRoles(data.map(normalizeRol))
    } catch (error) {
      console.error('Error al cargar roles:', error)
    }
  }

  const handleSearch = async () => {
    if (!searchId.trim()) {
      loadUsuarios()
      return
    }

    try {
      setLoading(true)
      const { data } = await api.get<UsuarioItem>(`/usuarios/${searchId}`)
      setUsuarios([normalizeUsuario(data)])
    } catch (error: any) {
      if (error.response?.status === 404) {
        await Swal.fire({
          icon: 'info',
          title: 'No encontrado',
          text: `No se encontró usuario con ID ${searchId}`,
          confirmButtonColor: '#c2783c',
          background: '#1a1714',
          color: '#ede8df',
        })
      }
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = () => {
    setEditingUsuario(null)
    setFormData({
      username: '',
      password: '',
      idRol: roles.length > 0 ? roles[0].idRol : 0,
      activo: true,
    })
    setShowModal(true)
  }

  const openEditModal = (usuario: UsuarioItem) => {
    setEditingUsuario(usuario)
    setFormData({
      username: usuario.username,
      password: '',
      idRol: usuario.idRol,
      activo: usuario.activo,
    })
    setShowModal(true)
  }

  const handleDelete = async (id: number, username: string) => {
    const result = await Swal.fire({
      icon: 'question',
      title: '¿Desactivar usuario?',
      text: `¿Deseas desactivar a "${username}"?`,
      showCancelButton: true,
      confirmButtonColor: '#c2783c',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar',
      background: '#1a1714',
      color: '#ede8df',
    })

    if (!result.isConfirmed) return

    try {
      await api.delete(`/usuarios/${id}`)
      await Swal.fire({
        icon: 'success',
        title: 'Desactivado',
        text: 'Usuario desactivado correctamente',
        timer: 1500,
        showConfirmButton: false,
        confirmButtonColor: '#c2783c',
        background: '#1a1714',
        color: '#ede8df',
      })
      loadUsuarios()
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al desactivar usuario',
        confirmButtonColor: '#c2783c',
        background: '#1a1714',
        color: '#ede8df',
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.username.trim()) {
      await Swal.fire({
        icon: 'warning',
        title: 'Validación',
        text: 'El usuario es requerido',
        confirmButtonColor: '#c2783c',
        background: '#1a1714',
        color: '#ede8df',
      })
      return
    }

    if (formData.idRol <= 0) {
      await Swal.fire({
        icon: 'warning',
        title: 'Validación',
        text: 'Selecciona un rol válido',
        confirmButtonColor: '#c2783c',
        background: '#1a1714',
        color: '#ede8df',
      })
      return
    }

    if (!editingUsuario && !formData.password.trim()) {
      await Swal.fire({
        icon: 'warning',
        title: 'Validación',
        text: 'La contraseña es requerida',
        confirmButtonColor: '#c2783c',
        background: '#1a1714',
        color: '#ede8df',
      })
      return
    }

    try {
      if (editingUsuario) {
        await api.put(`/usuarios/${editingUsuario.idUsuario}`, formData)
        await Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'Usuario actualizado correctamente',
          timer: 1500,
          showConfirmButton: false,
          confirmButtonColor: '#c2783c',
          background: '#1a1714',
          color: '#ede8df',
        })
      } else {
        await api.post('/usuarios', formData)
        await Swal.fire({
          icon: 'success',
          title: 'Creado',
          text: 'Usuario creado correctamente',
          timer: 1500,
          showConfirmButton: false,
          confirmButtonColor: '#c2783c',
          background: '#1a1714',
          color: '#ede8df',
        })
      }
      setShowModal(false)
      loadUsuarios()
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al guardar usuario',
        confirmButtonColor: '#c2783c',
        background: '#1a1714',
        color: '#ede8df',
      })
    }
  }

  return (
    <DashboardLayout title="Usuarios">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="number"
            placeholder="Buscar por ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            style={{
              flex: 1,
              backgroundColor: '#1a1714',
              border: '1px solid #2a2420',
              borderRadius: '8px',
              color: '#ede8df',
              padding: '10px 12px',
              fontSize: '14px',
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              backgroundColor: '#8b7355',
              border: 'none',
              color: 'white',
              padding: '10px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            <Search size={18} />
            Buscar
          </button>
          <button
            onClick={openCreateModal}
            style={{
              backgroundColor: '#c2783c',
              border: 'none',
              color: 'white',
              padding: '10px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            <Plus size={18} />
            Crear Usuario
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#8b7355' }}>Cargando...</div>
        ) : usuarios.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                backgroundColor: '#1a1714',
                borderRadius: '8px',
                border: '1px solid #2a2420',
                overflow: 'hidden',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#2a2420', borderBottom: '1px solid #3a3430' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#c2783c', fontWeight: 600 }}>ID</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#c2783c', fontWeight: 600 }}>Usuario</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#c2783c', fontWeight: 600 }}>Rol</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: '#c2783c', fontWeight: 600 }}>Estado</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: '#c2783c', fontWeight: 600 }}>Creado</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: '#c2783c', fontWeight: 600 }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.idUsuario} style={{ borderBottom: '1px solid #2a2420' }}>
                    <td style={{ padding: '12px 16px', color: '#ede8df' }}>{usuario.idUsuario}</td>
                    <td style={{ padding: '12px 16px', color: '#ede8df' }}>{usuario.username}</td>
                    <td style={{ padding: '12px 16px', color: '#8b7355' }}>{usuario.rol || '-'}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <span
                        style={{
                          backgroundColor: usuario.activo ? '#2d5f2e' : '#6b7280',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        {usuario.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#ede8df', textAlign: 'center', fontSize: '13px' }}>
                      {usuario.fechaCreacion ? new Date(usuario.fechaCreacion).toLocaleDateString('es-GT') : '-'}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <button
                          onClick={() => openEditModal(usuario)}
                          style={{
                            backgroundColor: '#8b7355',
                            border: 'none',
                            color: 'white',
                            padding: '6px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                          }}
                        >
                          <Edit size={14} />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(usuario.idUsuario, usuario.username)}
                          style={{
                            backgroundColor: '#d32f2f',
                            border: 'none',
                            color: 'white',
                            padding: '6px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                          }}
                        >
                          <Trash2 size={14} />
                          Desactivar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: '#1a1714',
              border: '1px solid #2a2420',
              borderRadius: '8px',
              padding: '40px',
              textAlign: 'center',
              color: '#8b7355',
            }}
          >
            No hay usuarios registrados
          </div>
        )}
      </div>

      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: '#1a1714',
              border: '1px solid #2a2420',
              borderRadius: '12px',
              padding: '24px',
              width: '90%',
              maxWidth: '520px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ color: '#ede8df', margin: '0 0 20px 0', fontSize: '20px' }}>
              {editingUsuario ? 'Editar Usuario' : 'Crear Usuario'}
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ color: '#ede8df', fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                  Username *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="usuario"
                  style={{
                    width: '100%',
                    backgroundColor: '#242220',
                    border: '1px solid #3a3430',
                    borderRadius: '6px',
                    color: '#ede8df',
                    padding: '10px 12px',
                    fontSize: '14px',
                  }}
                />
              </div>
              <div>
                <label style={{ color: '#ede8df', fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                  Password {editingUsuario ? '(opcional)' : '*'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={editingUsuario ? 'Dejar en blanco para mantener' : '********'}
                  style={{
                    width: '100%',
                    backgroundColor: '#242220',
                    border: '1px solid #3a3430',
                    borderRadius: '6px',
                    color: '#ede8df',
                    padding: '10px 12px',
                    fontSize: '14px',
                  }}
                />
              </div>
              <div>
                <label style={{ color: '#ede8df', fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                  Rol *
                </label>
                <select
                  value={formData.idRol}
                  onChange={(e) => setFormData({ ...formData, idRol: parseInt(e.target.value) })}
                  style={{
                    width: '100%',
                    backgroundColor: '#242220',
                    border: '1px solid #3a3430',
                    borderRadius: '6px',
                    color: '#ede8df',
                    padding: '10px 12px',
                    fontSize: '14px',
                  }}
                >
                  <option value="0">-- Selecciona un rol --</option>
                  {roles.map((rol) => (
                    <option key={rol.idRol} value={rol.idRol}>
                      {rol.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  id="activo"
                  type="checkbox"
                  checked={formData.activo}
                  onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                  style={{ width: '16px', height: '16px' }}
                />
                <label htmlFor="activo" style={{ color: '#ede8df', fontSize: '14px', fontWeight: 600 }}>
                  Activo
                </label>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1,
                    backgroundColor: '#2a2420',
                    border: '1px solid #3a3430',
                    color: '#8b7355',
                    padding: '10px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    backgroundColor: '#c2783c',
                    border: 'none',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  {editingUsuario ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
