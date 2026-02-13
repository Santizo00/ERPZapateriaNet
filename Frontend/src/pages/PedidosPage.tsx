import { useEffect, useState } from 'react'
import { DashboardLayout } from '../components/DashboardLayout'
import { Search, Plus, Trash2, ShoppingCart } from 'lucide-react'
import Swal from 'sweetalert2'
import api from '../services/api'
import { useAuthStore } from '../stores/authStore'

interface Pedido {
  idPedido: number
  idCliente: number
  idUsuario: number
  fecha: string
  total: number
  estado: string
}

interface PedidoDetalleItem {
  idProducto: number
  productoNombre: string
  cantidad: number
  precioUnitario: number
  subtotal: number
}

interface PedidoDetalleInfo {
  idPedido: number
  idCliente: number
  clienteNombre: string
  clienteNIT: string | null
  idUsuario: number
  usuarioNombre: string
  fecha: string
  total: number
  estado: string
  detalle: PedidoDetalleItem[]
}

interface Cliente {
  idCliente: number
  nombre: string
  nit: string
}

interface Producto {
  idProducto: number
  nombre: string
  precio: number
  stockDisponible: number
}

interface DetalleItem {
  idProducto: number
  nombreProducto: string
  cantidad: number
  precioUnitario: number
  subtotal: number
}

/**
 * Pagina de gestion de pedidos.
 * Lista pedidos, muestra detalles y crea nuevos pedidos.
 */
export const PedidosPage = () => {
  const { usuario } = useAuthStore()
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchId, setSearchId] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [detailData, setDetailData] = useState<PedidoDetalleInfo | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  const [formData, setFormData] = useState({
    idCliente: 0,
    detalle: [] as DetalleItem[],
  })

  const [selectedProducto, setSelectedProducto] = useState(0)
  const [cantidad, setCantidad] = useState(1)

  useEffect(() => {
    loadPedidos()
    loadClientes()
    loadProductos()
  }, [])

  const normalizePedido = (raw: any): Pedido => ({
    idPedido: raw.IdPedido ?? raw.idPedido,
    idCliente: raw.IdCliente ?? raw.idCliente,
    idUsuario: raw.IdUsuario ?? raw.idUsuario,
    fecha: raw.Fecha ?? raw.fecha,
    total: Number(raw.Total ?? raw.total ?? 0),
    estado: raw.Estado ?? raw.estado ?? '',
  })

  const normalizeDetalle = (raw: any): PedidoDetalleInfo => ({
    idPedido: raw.IdPedido ?? raw.idPedido,
    idCliente: raw.IdCliente ?? raw.idCliente,
    clienteNombre: raw.ClienteNombre ?? raw.clienteNombre ?? '',
    clienteNIT: raw.ClienteNIT ?? raw.clienteNIT ?? null,
    idUsuario: raw.IdUsuario ?? raw.idUsuario,
    usuarioNombre: raw.UsuarioNombre ?? raw.usuarioNombre ?? '',
    fecha: raw.Fecha ?? raw.fecha,
    total: Number(raw.Total ?? raw.total ?? 0),
    estado: raw.Estado ?? raw.estado ?? '',
    detalle: (raw.Detalle ?? raw.detalle ?? []).map((d: any) => ({
      idProducto: d.IdProducto ?? d.idProducto,
      productoNombre: d.ProductoNombre ?? d.productoNombre ?? '',
      cantidad: d.Cantidad ?? d.cantidad,
      precioUnitario: Number(d.PrecioUnitario ?? d.precioUnitario ?? 0),
      subtotal: Number(d.Subtotal ?? d.subtotal ?? 0),
    })),
  })

  const loadPedidos = async () => {
    try {
      setLoading(true)
      const { data } = await api.get<Pedido[]>('/pedidos')
      setPedidos(data.map(normalizePedido))
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al cargar pedidos',
        confirmButtonColor: '#c2783c',
        background: '#1a1714',
        color: '#ede8df',
      })
    } finally {
      setLoading(false)
    }
  }

  const loadClientes = async () => {
    try {
      const { data } = await api.get<Cliente[]>('/clientes')
      setClientes(data)
    } catch (error) {
      console.error('Error al cargar clientes:', error)
    }
  }

  const loadProductos = async () => {
    try {
      const { data } = await api.get<Producto[]>('/productos')
      setProductos(data)
    } catch (error) {
      console.error('Error al cargar productos:', error)
    }
  }

  const handleSearch = async () => {
    if (!searchId.trim()) {
      loadPedidos()
      return
    }

    try {
      setLoading(true)
      const { data } = await api.get<Pedido>(`/pedidos/${searchId}`)
      setPedidos([normalizePedido(data)])
    } catch (error: any) {
      if (error.response?.status === 404) {
        await Swal.fire({
          icon: 'info',
          title: 'No encontrado',
          text: `No se encontró pedido con ID ${searchId}`,
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

  const handleViewDetail = async (id: number) => {
    try {
      setLoadingDetail(true)
      const { data } = await api.get(`/pedidos/${id}/detalle`)
      setDetailData(normalizeDetalle(data))
      setShowDetailModal(true)
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al cargar detalle del pedido',
        confirmButtonColor: '#c2783c',
        background: '#1a1714',
        color: '#ede8df',
      })
    } finally {
      setLoadingDetail(false)
    }
  }

  const openCreateModal = () => {
    setFormData({ idCliente: 0, detalle: [] })
    setSelectedProducto(0)
    setCantidad(1)
    setShowModal(true)
  }

  const agregarProducto = () => {
    if (selectedProducto === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Validación',
        text: 'Selecciona un producto',
        confirmButtonColor: '#c2783c',
        background: '#1a1714',
        color: '#ede8df',
      })
      return
    }

    if (cantidad <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Validación',
        text: 'La cantidad debe ser mayor a 0',
        confirmButtonColor: '#c2783c',
        background: '#1a1714',
        color: '#ede8df',
      })
      return
    }

    const producto = productos.find((p) => p.idProducto === selectedProducto)
    if (!producto) return

    if (producto.stockDisponible <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Stock insuficiente',
        text: 'No se pudo agregar el producto porque no hay existencia disponible',
        confirmButtonColor: '#c2783c',
        background: '#1a1714',
        color: '#ede8df',
      })
      return
    }

    if (cantidad > producto.stockDisponible) {
      Swal.fire({
        icon: 'warning',
        title: 'Stock insuficiente',
        text: `La cantidad solicitada supera el stock disponible (${producto.stockDisponible})`,
        confirmButtonColor: '#c2783c',
        background: '#1a1714',
        color: '#ede8df',
      })
      return
    }

    // Verificar si ya existe el producto en el detalle
    const existe = formData.detalle.find((d) => d.idProducto === selectedProducto)
    if (existe) {
      Swal.fire({
        icon: 'warning',
        title: 'Validación',
        text: 'El producto ya está en el pedido',
        confirmButtonColor: '#c2783c',
        background: '#1a1714',
        color: '#ede8df',
      })
      return
    }

    const nuevoItem: DetalleItem = {
      idProducto: producto.idProducto,
      nombreProducto: producto.nombre,
      cantidad: cantidad,
      precioUnitario: producto.precio,
      subtotal: cantidad * producto.precio,
    }

    setFormData({
      ...formData,
      detalle: [...formData.detalle, nuevoItem],
    })

    setSelectedProducto(0)
    setCantidad(1)
  }

  const eliminarProducto = (idProducto: number) => {
    setFormData({
      ...formData,
      detalle: formData.detalle.filter((d) => d.idProducto !== idProducto),
    })
  }

  const calcularTotal = () => {
    return formData.detalle.reduce((sum, item) => sum + item.subtotal, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.idCliente === 0) {
      await Swal.fire({
        icon: 'warning',
        title: 'Validación',
        text: 'Selecciona un cliente',
        confirmButtonColor: '#c2783c',
        background: '#1a1714',
        color: '#ede8df',
      })
      return
    }

    if (formData.detalle.length === 0) {
      await Swal.fire({
        icon: 'warning',
        title: 'Validación',
        text: 'Agrega al menos un producto al pedido',
        confirmButtonColor: '#c2783c',
        background: '#1a1714',
        color: '#ede8df',
      })
      return
    }

    const productoById = new Map(productos.map((p) => [p.idProducto, p]))
    for (const item of formData.detalle) {
      const producto = productoById.get(item.idProducto)
      if (!producto || producto.stockDisponible <= 0) {
        await Swal.fire({
          icon: 'warning',
          title: 'Stock insuficiente',
          text: `No hay existencia disponible para el producto ${item.nombreProducto}`,
          confirmButtonColor: '#c2783c',
          background: '#1a1714',
          color: '#ede8df',
        })
        return
      }

      if (item.cantidad > producto.stockDisponible) {
        await Swal.fire({
          icon: 'warning',
          title: 'Stock insuficiente',
          text: `La cantidad de ${item.nombreProducto} supera el stock disponible (${producto.stockDisponible})`,
          confirmButtonColor: '#c2783c',
          background: '#1a1714',
          color: '#ede8df',
        })
        return
      }
    }

    try {
      const payload = {
        idCliente: formData.idCliente,
        idUsuario: usuario?.idUsuario,
        detalle: formData.detalle.map((d) => ({
          idProducto: d.idProducto,
          cantidad: d.cantidad,
          precioUnitario: d.precioUnitario,
        })),
      }

      await api.post('/pedidos', payload)
      await Swal.fire({
        icon: 'success',
        title: 'Creado',
        text: 'Pedido creado correctamente',
        timer: 1500,
        showConfirmButton: false,
        confirmButtonColor: '#c2783c',
        background: '#1a1714',
        color: '#ede8df',
      })
      setShowModal(false)
      loadPedidos()
    } catch (error: any) {
      const apiMessage =
        error.response?.data?.detail ||
        error.response?.data?.Detail ||
        error.response?.data?.message ||
        'Error al crear pedido'
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: apiMessage,
        confirmButtonColor: '#c2783c',
        background: '#1a1714',
        color: '#ede8df',
      })
    }
  }

  return (
    <DashboardLayout title="Pedidos">
      <div className="pedidos-page" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Búsqueda y Botón Crear */}
        <div className="pedidos-toolbar" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="number"
            placeholder="Buscar por ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pedidos-search-input"
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
            className="pedidos-search-button"
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
            className="pedidos-create-button"
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
            Crear Pedido
          </button>
        </div>

        {/* Tabla */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#8b7355' }}>Cargando...</div>
        ) : pedidos.length > 0 ? (
          <div className="pedidos-table-wrapper" style={{ overflowX: 'auto' }}>
            <table
              className="pedidos-table"
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
                    Cliente
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#c2783c', fontWeight: 600 }}>
                    Usuario
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: '#c2783c', fontWeight: 600 }}>
                    Fecha
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: '#c2783c', fontWeight: 600 }}>
                    Total (Q)
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: '#c2783c', fontWeight: 600 }}>
                    Estado
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: '#c2783c', fontWeight: 600 }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => (
                  <tr key={pedido.idPedido} style={{ borderBottom: '1px solid #2a2420' }}>
                    <td data-label="ID" style={{ padding: '12px 16px', color: '#ede8df' }}>{pedido.idPedido}</td>
                    <td data-label="Cliente" style={{ padding: '12px 16px', color: '#ede8df' }}>Cliente #{pedido.idCliente}</td>
                    <td data-label="Usuario" style={{ padding: '12px 16px', color: '#8b7355', fontSize: '13px' }}>
                      Usuario #{pedido.idUsuario}
                    </td>
                    <td data-label="Fecha" style={{ padding: '12px 16px', color: '#ede8df', textAlign: 'center', fontSize: '13px' }}>
                      {new Date(pedido.fecha).toLocaleDateString('es-GT')}
                    </td>
                    <td data-label="Total (Q)" style={{ padding: '12px 16px', color: '#c2783c', textAlign: 'center', fontWeight: 600 }}>
                      Q{pedido.total.toFixed(2)}
                    </td>
                    <td data-label="Estado" style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <span
                        style={{
                          backgroundColor: pedido.estado === 'Completado' ? '#2d5f2e' : '#8b7355',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        {pedido.estado}
                      </span>
                    </td>
                    <td data-label="Acciones" style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleViewDetail(pedido.idPedido)}
                        disabled={loadingDetail}
                        className="pedidos-action-button"
                        style={{
                          backgroundColor: '#8b7355',
                          border: 'none',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 600,
                          opacity: loadingDetail ? 0.6 : 1,
                        }}
                      >
                        {loadingDetail ? 'Cargando...' : 'Ver detalle'}
                      </button>
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
            No hay pedidos registrados
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="pedidos-modal"
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
            overflow: 'auto',
            padding: '20px',
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="pedidos-modal-card"
            style={{
              backgroundColor: '#1a1714',
              border: '1px solid #2a2420',
              borderRadius: '12px',
              padding: '24px',
              width: '90%',
              maxWidth: '800px',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ color: '#ede8df', margin: '0 0 20px 0', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingCart size={24} />
              Crear Pedido
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Selector de Cliente */}
              <div>
                <label
                  style={{ color: '#ede8df', fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '8px' }}
                >
                  Cliente *
                </label>
                <select
                  value={formData.idCliente}
                  onChange={(e) => setFormData({ ...formData, idCliente: parseInt(e.target.value) })}
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
                  <option value="0">-- Selecciona un cliente --</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.idCliente} value={cliente.idCliente}>
                      {cliente.nombre} - {cliente.nit}
                    </option>
                  ))}
                </select>
              </div>

              {/* Agregar Productos */}
              <div
                className="pedidos-add-section"
                style={{
                  backgroundColor: '#242220',
                  border: '1px solid #3a3430',
                  borderRadius: '8px',
                  padding: '16px',
                }}
              >
                <h3 style={{ color: '#c2783c', fontSize: '16px', marginTop: 0, marginBottom: '12px' }}>
                  Agregar Productos
                </h3>
                <div className="pedidos-add-row" style={{ display: 'flex', gap: '12px', alignItems: 'end' }}>
                  <div style={{ flex: 2 }}>
                    <label style={{ color: '#ede8df', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                      Producto
                    </label>
                    <select
                      value={selectedProducto}
                      onChange={(e) => setSelectedProducto(parseInt(e.target.value))}
                      style={{
                        width: '100%',
                        backgroundColor: '#1a1714',
                        border: '1px solid #3a3430',
                        borderRadius: '6px',
                        color: '#ede8df',
                        padding: '8px 10px',
                        fontSize: '13px',
                      }}
                    >
                      <option value="0">-- Selecciona --</option>
                      {productos.map((producto) => (
                        <option key={producto.idProducto} value={producto.idProducto}>
                          {producto.nombre} - Q{producto.precio.toFixed(2)} (Stock: {producto.stockDisponible})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ color: '#ede8df', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                      Cantidad
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={cantidad}
                      onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
                      style={{
                        width: '100%',
                        backgroundColor: '#1a1714',
                        border: '1px solid #3a3430',
                        borderRadius: '6px',
                        color: '#ede8df',
                        padding: '8px 10px',
                        fontSize: '13px',
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={agregarProducto}
                    className="pedidos-add-button"
                    style={{
                      backgroundColor: '#8b7355',
                      border: 'none',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    + Agregar
                  </button>
                </div>
              </div>

              {/* Detalle del Pedido */}
              {formData.detalle.length > 0 && (
                <div>
                  <h3 style={{ color: '#ede8df', fontSize: '14px', marginTop: 0, marginBottom: '12px' }}>
                    Detalle del Pedido
                  </h3>
                  <table
                    className="pedidos-detail-table"
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      backgroundColor: '#242220',
                      border: '1px solid #3a3430',
                      borderRadius: '6px',
                      overflow: 'hidden',
                    }}
                  >
                    <thead>
                      <tr style={{ backgroundColor: '#2a2420' }}>
                        <th style={{ padding: '8px', textAlign: 'left', color: '#c2783c', fontSize: '12px' }}>
                          Producto
                        </th>
                        <th style={{ padding: '8px', textAlign: 'center', color: '#c2783c', fontSize: '12px' }}>
                          Cantidad
                        </th>
                        <th style={{ padding: '8px', textAlign: 'center', color: '#c2783c', fontSize: '12px' }}>
                          Precio
                        </th>
                        <th style={{ padding: '8px', textAlign: 'center', color: '#c2783c', fontSize: '12px' }}>
                          Subtotal
                        </th>
                        <th style={{ padding: '8px', textAlign: 'center', color: '#c2783c', fontSize: '12px' }}>
                          Acción
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.detalle.map((item) => (
                        <tr key={item.idProducto} style={{ borderTop: '1px solid #3a3430' }}>
                          <td data-label="Producto" style={{ padding: '8px', color: '#ede8df', fontSize: '13px' }}>
                            {item.nombreProducto}
                          </td>
                          <td data-label="Cantidad" style={{ padding: '8px', textAlign: 'center', color: '#ede8df', fontSize: '13px' }}>
                            {item.cantidad}
                          </td>
                          <td data-label="Precio" style={{ padding: '8px', textAlign: 'center', color: '#c2783c', fontSize: '13px' }}>
                            Q{item.precioUnitario.toFixed(2)}
                          </td>
                          <td
                            data-label="Subtotal"
                            style={{
                              padding: '8px',
                              textAlign: 'center',
                              color: '#c2783c',
                              fontWeight: 600,
                              fontSize: '13px',
                            }}
                          >
                            Q{item.subtotal.toFixed(2)}
                          </td>
                          <td data-label="Accion" style={{ padding: '8px', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => eliminarProducto(item.idProducto)}
                              style={{
                                backgroundColor: '#d32f2f',
                                border: 'none',
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '12px',
                              }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Total */}
                  <div
                    style={{
                      marginTop: '12px',
                      padding: '12px 16px',
                      backgroundColor: '#2a2420',
                      borderRadius: '6px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ color: '#ede8df', fontSize: '16px', fontWeight: 600 }}>Total:</span>
                    <span style={{ color: '#c2783c', fontSize: '20px', fontWeight: 700 }}>
                      Q{calcularTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {/* Botones */}
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
                  Crear Pedido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetailModal && detailData && (
        <div
          className="pedidos-modal"
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
            overflow: 'auto',
            padding: '20px',
          }}
          onClick={() => setShowDetailModal(false)}
        >
          <div
            className="pedidos-modal-card"
            style={{
              backgroundColor: '#1a1714',
              border: '1px solid #2a2420',
              borderRadius: '12px',
              padding: '24px',
              width: '90%',
              maxWidth: '900px',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ color: '#ede8df', margin: '0 0 16px 0', fontSize: '20px' }}>
              Detalle del Pedido #{detailData.idPedido}
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '12px',
                marginBottom: '16px',
              }}
            >
              <div style={{ backgroundColor: '#242220', border: '1px solid #3a3430', borderRadius: '8px', padding: '12px' }}>
                <p style={{ color: '#8b7355', margin: '0 0 4px 0', fontSize: '12px' }}>Cliente</p>
                <p style={{ color: '#ede8df', margin: 0, fontWeight: 600 }}>{detailData.clienteNombre}</p>
                <p style={{ color: '#8b7355', margin: '4px 0 0 0', fontSize: '12px' }}>NIT: {detailData.clienteNIT || 'CF'}</p>
              </div>
              <div style={{ backgroundColor: '#242220', border: '1px solid #3a3430', borderRadius: '8px', padding: '12px' }}>
                <p style={{ color: '#8b7355', margin: '0 0 4px 0', fontSize: '12px' }}>Atendido por</p>
                <p style={{ color: '#ede8df', margin: 0, fontWeight: 600 }}>{detailData.usuarioNombre}</p>
              </div>
              <div style={{ backgroundColor: '#242220', border: '1px solid #3a3430', borderRadius: '8px', padding: '12px' }}>
                <p style={{ color: '#8b7355', margin: '0 0 4px 0', fontSize: '12px' }}>Fecha</p>
                <p style={{ color: '#ede8df', margin: 0, fontWeight: 600 }}>
                  {detailData.fecha ? new Date(detailData.fecha).toLocaleDateString('es-GT') : '-'}
                </p>
              </div>
              <div style={{ backgroundColor: '#242220', border: '1px solid #3a3430', borderRadius: '8px', padding: '12px' }}>
                <p style={{ color: '#8b7355', margin: '0 0 4px 0', fontSize: '12px' }}>Estado</p>
                <p style={{ color: '#ede8df', margin: 0, fontWeight: 600 }}>{detailData.estado}</p>
              </div>
            </div>

            <div className="pedidos-table-wrapper" style={{ overflowX: 'auto' }}>
              <table
                className="pedidos-view-table"
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  backgroundColor: '#242220',
                  border: '1px solid #3a3430',
                  borderRadius: '6px',
                  overflow: 'hidden',
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: '#2a2420' }}>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#c2783c', fontSize: '12px' }}>Producto</th>
                    <th style={{ padding: '10px', textAlign: 'center', color: '#c2783c', fontSize: '12px' }}>Cantidad</th>
                    <th style={{ padding: '10px', textAlign: 'center', color: '#c2783c', fontSize: '12px' }}>Precio</th>
                    <th style={{ padding: '10px', textAlign: 'center', color: '#c2783c', fontSize: '12px' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {detailData.detalle.map((item) => (
                    <tr key={item.idProducto} style={{ borderTop: '1px solid #3a3430' }}>
                      <td data-label="Producto" style={{ padding: '10px', color: '#ede8df', fontSize: '13px' }}>{item.productoNombre}</td>
                      <td data-label="Cantidad" style={{ padding: '10px', textAlign: 'center', color: '#ede8df', fontSize: '13px' }}>{item.cantidad}</td>
                      <td data-label="Precio" style={{ padding: '10px', textAlign: 'center', color: '#c2783c', fontSize: '13px' }}>
                        Q{item.precioUnitario.toFixed(2)}
                      </td>
                      <td data-label="Subtotal" style={{ padding: '10px', textAlign: 'center', color: '#c2783c', fontWeight: 600, fontSize: '13px' }}>
                        Q{item.subtotal.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div
              style={{
                marginTop: '16px',
                padding: '12px 16px',
                backgroundColor: '#2a2420',
                borderRadius: '6px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ color: '#ede8df', fontSize: '16px', fontWeight: 600 }}>Total a pagar:</span>
              <span style={{ color: '#c2783c', fontSize: '20px', fontWeight: 700 }}>
                Q{detailData.total.toFixed(2)}
              </span>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                style={{
                  backgroundColor: '#2a2420',
                  border: '1px solid #3a3430',
                  color: '#8b7355',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
