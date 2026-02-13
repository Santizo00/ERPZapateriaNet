// ========== TIPOS DE AUTENTICACIÓN ==========

/** Credenciales para login */
export interface LoginRequest {
  username: string
  password: string
}

/** Respuesta al hacer login - contiene token y datos del usuario */
export interface LoginResponse {
  token: string
  usuario: {
    id: number
    username: string
    email: string
    rol: string
  }
}

/** Datos para registro de usuario */
export interface RegisterRequest {
  username: string
  email: string
  password: string
  rol: string
}

/** Información del usuario autenticado */
export interface Usuario {
  id: number
  username: string
  email: string
  rol: string
  fechaCreacion?: string
}

// ========== TIPOS DE PRODUCTOS ==========

/** Información completa de un producto */
export interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: number
  stock: number
  categoria: string
  imagen?: string
  activo: boolean
}

/** Datos para crear o actualizar un producto */
export interface CreateProductoRequest {
  nombre: string
  descripcion: string
  precio: number
  stock: number
  categoria: string
  imagen?: string
}

// ========== TIPOS DE PEDIDOS ==========

/** Información de un pedido con detalles */
export interface Pedido {
  idPedido: number
  usuarioId: number
  clienteId?: number
  fechaPedido: string
  total: number
  estado: string
  detalles: PedidoDetalle[]
}

/** Detalle de línea en un pedido */
export interface PedidoDetalle {
  id?: number
  productoId: number
  cantidad: number
  precioUnitario: number
  subtotal: number
}

/** Datos para crear un nuevo pedido */
export interface CreatePedidoRequest {
  clienteId?: number
  detalles: PedidoDetalle[]
}

// ========== TIPOS DE ERRORES API ==========

/** Estructura de error devuelta por la API */
export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
}
