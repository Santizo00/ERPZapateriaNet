import api from './api'
import type { Producto, CreateProductoRequest } from '../types'

/**
 * Servicio de API para gestión de productos.
 * Proporciona métodos CRUD para productos.
 */
export const productosService = {
  /** Obtener lista de todos los productos */
  getAll: async (): Promise<Producto[]> => {
    const { data } = await api.get('/productos')
    return data
  },

  /** Obtener detalles de un producto por su ID */
  getById: async (id: number): Promise<Producto> => {
    const { data } = await api.get(`/productos/${id}`)
    return data
  },

  /** Crear un nuevo producto (requiere rol Admin) */
  create: async (producto: CreateProductoRequest): Promise<Producto> => {
    const { data } = await api.post('/productos', producto)
    return data
  },

  /** Actualizar información de un producto (requiere rol Admin) */
  update: async (id: number, producto: Partial<CreateProductoRequest>): Promise<Producto> => {
    const { data } = await api.put(`/productos/${id}`, producto)
    return data
  },

  /** Eliminar un producto (requiere rol Admin) */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/productos/${id}`)
  },
}
