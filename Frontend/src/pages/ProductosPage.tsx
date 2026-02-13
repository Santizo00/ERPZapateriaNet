import { useEffect, useState } from 'react'
import { DashboardLayout } from '../components/DashboardLayout'
import { Trash2, Edit, Plus, Search } from 'lucide-react'
import Swal from 'sweetalert2'
import api from '../services/api'
import { useAuthStore } from '../stores/authStore'

interface Producto {
  idProducto: number
  nombre: string
  descripcion: string
  precio: number
  stockDisponible: number
  stockMinimo: number
}

/**
 * Pagina de gestion de productos.
 * Lista, busca, crea, edita y elimina productos.
 */
export const ProductosPage = () => {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchId, setSearchId] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null)
  const [precioInput, setPrecioInput] = useState('')
  const [stockInput, setStockInput] = useState('')
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
  })
  const { usuario } = useAuthStore()
  const isAdmin = usuario?.rol === 'Admin' || usuario?.rol === 'Administrador'

  useEffect(() => {
    loadProductos()
  }, [])

  const loadProductos = async () => {
    try {
      setLoading(true)
      const { data } = await api.get<Producto[]>('/productos')
      setProductos(data)
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al cargar productos'
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
        confirmButtonColor: '#c2783c',
        background: '#1a1714',
        color: '#ede8df',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchId.trim()) {
      loadProductos()
      return
    }

    try {
      setLoading(true)
      const { data } = await api.get<Producto>(`/productos/${searchId}`)
      setProductos([data])
    } catch (error: any) {
      if (error.response?.status === 404) {
        await Swal.fire({
          icon: 'info',
          title: 'No encontrado',
          text: `No se encontró producto con ID ${searchId}`,
          confirmButtonColor: '#c2783c',
          background: '#1a1714',
          color: '#ede8df',
        })
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al buscar producto',
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

  const handleDelete = async (id: number, nombre: string) => {
    const result = await Swal.fire({
      icon: 'question',
      title: '¿Eliminar Producto?',
      text: `¿Estás seguro de eliminar "${nombre}"?`,
      showCancelButton: true,
      confirmButtonColor: '#c2783c',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#1a1714',
      color: '#ede8df',
    })

    if (result.isConfirmed) {
      try {
        await api.delete(`/productos/${id}`)
        await Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'Producto eliminado correctamente',
          timer: 1500,
          showConfirmButton: false,
          confirmButtonColor: '#c2783c',
          background: '#1a1714',
          color: '#ede8df',
        })
        loadProductos()
      } catch (error: any) {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Error al eliminar producto',
          confirmButtonColor: '#c2783c',
          background: '#1a1714',
          color: '#ede8df',
        })
      }
    }
  }

  const openCreateModal = () => {
    setEditingProduct(null)
    setFormData({ nombre: '', descripcion: '', precio: 0, stock: 0 })
    setPrecioInput('')
    setStockInput('')
    setShowModal(true)
  }

  const openEditModal = (producto: Producto) => {
    setEditingProduct(producto)
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stockDisponible,
    })
    setPrecioInput(producto.precio.toFixed(2))
    setStockInput(String(producto.stockDisponible))
    setShowModal(true)
  }

  const handlePrecioChange = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) {
      setPrecioInput('')
      setFormData({ ...formData, precio: 0 })
      return
    }

    const valid = /^\d+(\.\d{0,2})?$/.test(trimmed)
    if (!valid) return

    setPrecioInput(trimmed)
    const parsed = Number(trimmed)
    if (!Number.isNaN(parsed)) {
      setFormData({ ...formData, precio: parsed })
    }
  }

  const handleStockChange = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) {
      setStockInput('')
      setFormData({ ...formData, stock: 0 })
      return
    }

    const valid = /^\d+$/.test(trimmed)
    if (!valid) return

    setStockInput(trimmed)
    const parsed = parseInt(trimmed, 10)
    setFormData({ ...formData, stock: parsed })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nombre.trim()) {
      await Swal.fire({
        icon: 'warning',
        title: 'Validación',
        text: 'El nombre es requerido',
        confirmButtonColor: '#c2783c',
        background: '#1a1714',
        color: '#ede8df',
      })
      return
    }

    if (!precioInput || formData.precio <= 0) {
      await Swal.fire({
        icon: 'warning',
        title: 'Validación',
        text: 'El precio debe ser mayor a 0',
        confirmButtonColor: '#c2783c',
        background: '#1a1714',
        color: '#ede8df',
      })
      return
    }

    if (!stockInput || formData.stock < 0) {
      await Swal.fire({
        icon: 'warning',
        title: 'Validación',
        text: 'El stock no puede ser negativo',
        confirmButtonColor: '#c2783c',
        background: '#1a1714',
        color: '#ede8df',
      })
      return
    }

    try {
      const payload = { ...formData, stockMinimo: 0 }
      if (editingProduct) {
        await api.put(`/productos/${editingProduct.idProducto}`, payload)
        await Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'Producto actualizado correctamente',
          timer: 1500,
          showConfirmButton: false,
          confirmButtonColor: '#c2783c',
          background: '#1a1714',
          color: '#ede8df',
        })
      } else {
        await api.post('/productos', payload)
        await Swal.fire({
          icon: 'success',
          title: 'Creado',
          text: 'Producto creado correctamente',
          timer: 1500,
          showConfirmButton: false,
          confirmButtonColor: '#c2783c',
          background: '#1a1714',
          color: '#ede8df',
        })
      }
      setShowModal(false)
      loadProductos()
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al guardar producto',
        confirmButtonColor: '#c2783c',
        background: '#1a1714',
        color: '#ede8df',
      })
    }
  }

  return (
    <DashboardLayout title="Productos">
      <div className="productos-page" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Búsqueda y Botón Crear */}
        <div className="productos-toolbar" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="number"
            placeholder="Buscar por ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="productos-search-input"
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
            className="productos-search-button"
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
          {isAdmin && (
            <button
                onClick={openCreateModal}
                className="productos-create-button"
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
                Crear Producto
            </button>
          )}

        </div>

        {/* Tabla */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#8b7355' }}>Cargando...</div>
        ) : productos.length > 0 ? (
          <div className="productos-table-wrapper" style={{ overflowX: 'auto' }}>
            <table
              className="productos-table"
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
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#c2783c', fontWeight: 600 }}>
                    Nombre
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#c2783c', fontWeight: 600 }}>
                    Descripción
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: '#c2783c', fontWeight: 600 }}>
                    Precio (Q)
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: '#c2783c', fontWeight: 600 }}>
                    Stock
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: '#c2783c', fontWeight: 600 }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.idProducto} style={{ borderBottom: '1px solid #2a2420' }}>
                    <td data-label="ID" style={{ padding: '12px 16px', color: '#ede8df' }}>{producto.idProducto}</td>
                    <td data-label="Nombre" style={{ padding: '12px 16px', color: '#ede8df' }}>{producto.nombre}</td>
                    <td data-label="Descripción" style={{ padding: '12px 16px', color: '#8b7355', fontSize: '13px' }}>
                      {producto.descripcion || '-'}
                    </td>
                    <td data-label="Precio (Q)" style={{ padding: '12px 16px', color: '#c2783c', textAlign: 'center', fontWeight: 600 }}>
                      Q{producto.precio.toFixed(2)}
                    </td>
                    <td data-label="Stock" style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#ede8df' }}>
                      {producto.stockDisponible}
                    </td>
                    <td data-label="Acciones" style={{ padding: '12px 16px', textAlign: 'center' }}>
                        {isAdmin && (
                            <div className="productos-actions" style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                            <button
                                onClick={() => openEditModal(producto)}
                                className="productos-action-button"
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
                                onClick={() =>
                                handleDelete(producto.idProducto, producto.nombre)
                                }
                              className="productos-action-button"
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
                                Eliminar
                            </button>
                            </div>
                        )}
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
            No hay productos registrados
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="productos-modal"
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
            className="productos-modal-card"
            style={{
              backgroundColor: '#1a1714',
              border: '1px solid #2a2420',
              borderRadius: '12px',
              padding: '24px',
              width: '90%',
              maxWidth: '500px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ color: '#ede8df', margin: '0 0 20px 0', fontSize: '20px' }}>
              {editingProduct ? 'Editar Producto' : 'Crear Producto'}
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ color: '#ede8df', fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Nombre del producto"
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
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Descripción del producto"
                  rows={3}
                  style={{
                    width: '100%',
                    backgroundColor: '#242220',
                    border: '1px solid #3a3430',
                    borderRadius: '6px',
                    color: '#ede8df',
                    padding: '10px 12px',
                    fontSize: '14px',
                    resize: 'vertical',
                  }}
                />
              </div>
              <div>
                <label style={{ color: '#ede8df', fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                  Precio (Q) *
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  pattern="^\d*(\.\d{0,2})?$"
                  value={precioInput}
                  onChange={(e) => handlePrecioChange(e.target.value)}
                  placeholder="0.00"
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
                  Stock *
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="^\d+$"
                  value={stockInput}
                  onChange={(e) => handleStockChange(e.target.value)}
                  placeholder="0"
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
                  {editingProduct ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
