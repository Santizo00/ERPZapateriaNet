import api from './api'
import type { Pedido, CreatePedidoRequest } from '../types'

/**
 * Servicio de API para gestión de pedidos.
 * Proporciona métodos para obtener y crear pedidos.
 */
export const pedidosService = {
  /** Obtener lista de todos los pedidos */
  getAll: async (): Promise<Pedido[]> => {
    const { data } = await api.get('/pedidos')
    return data
  },

  /** Obtener detalles completos de un pedido por su ID */
  getById: async (id: number): Promise<Pedido> => {
    const { data } = await api.get(`/pedidos/${id}`)
    return data
  },

  /** Crear un nuevo pedido con artículos */
  create: async (pedido: CreatePedidoRequest): Promise<{ idPedido: number }> => {
    const { data } = await api.post('/pedidos', pedido)
    return data
  },
}
