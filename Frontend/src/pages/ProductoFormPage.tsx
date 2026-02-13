import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { DashboardLayout } from '../components/DashboardLayout'
import { ArrowLeft, Save } from 'lucide-react'
import Swal from 'sweetalert2'
import api from '../services/api'

interface Producto {
  id?: string
  nombre: string
  descripcion: string
  precio: number
  stock: number
  talla?: string
  color?: string
}

export const ProductoFormPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = !!id

  const [loading, setLoading] = useState(isEditMode)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState<Producto>({
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    talla: '',
    color: '',
  })

  useEffect(() => {
    if (isEditMode) {
      loadProducto()
    }
  }, [id])

  const loadProducto = async () => {
    try {
      setLoading(true)
      const { data } = await api.get(`/productos/${id}`)
      setForm(data)
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al cargar producto'
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
        confirmButtonColor: '#c2783c',
        background: '#1a1714',
        color: '#ede8df',
      })
      navigate('/dashboard/productos')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === 'precio' || name === 'stock' ? parseFloat(value) || 0 : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validación
    if (!form.nombre.trim()) {
      await Swal.fire({
        icon: 'warning',
        title: 'Validación',
        text: 'El nombre del producto es requerido',
        confirmButtonColor: '#c2783c',
        background: '#1a1714',
        color: '#ede8df',
      })
      return
    }

    if (form.precio <= 0) {
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

    if (form.stock < 0) {
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
      setSubmitting(true)

      if (isEditMode) {
        await api.put(`/productos/${id}`, form)
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
        await api.post('/productos', form)
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

      navigate('/dashboard/productos')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al guardar producto'
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
        confirmButtonColor: '#c2783c',
        background: '#1a1714',
        color: '#ede8df',
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout title={isEditMode ? 'Editar Producto' : 'Crear Producto'}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#8b7355' }}>Cargando...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title={isEditMode ? 'Editar Producto' : 'Crear Producto'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px' }}>
        {/* Header */}
        <button
          onClick={() => navigate('/dashboard/productos')}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#c2783c',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: 600,
            padding: 0,
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.opacity = '0.8'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.opacity = '1'
          }}
        >
          <ArrowLeft size={18} />
          Volver a Productos
        </button>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: '#1a1714',
            border: '1px solid #2a2420',
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* Nombre */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: '#ede8df', fontSize: '14px', fontWeight: 600 }}>
              Nombre del Producto *
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              disabled={submitting}
              placeholder="Ej: Zapato de niño"
              style={{
                backgroundColor: '#242220',
                border: '1px solid #3a3430',
                borderRadius: '6px',
                color: '#ede8df',
                padding: '10px 12px',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
              }}
              onFocus={(e) => {
                ;(e.target as HTMLInputElement).style.borderColor = '#c2783c'
              }}
              onBlur={(e) => {
                ;(e.target as HTMLInputElement).style.borderColor = '#3a3430'
              }}
            />
          </div>

          {/* Descripción */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: '#ede8df', fontSize: '14px', fontWeight: 600 }}>
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              disabled={submitting}
              placeholder="Descripción del producto..."
              rows={4}
              style={{
                backgroundColor: '#242220',
                border: '1px solid #3a3430',
                borderRadius: '6px',
                color: '#ede8df',
                padding: '10px 12px',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
                resize: 'vertical',
                minHeight: '100px',
              }}
              onFocus={(e) => {
                ;(e.target as HTMLTextAreaElement).style.borderColor = '#c2783c'
              }}
              onBlur={(e) => {
                ;(e.target as HTMLTextAreaElement).style.borderColor = '#3a3430'
              }}
            />
          </div>

          {/* Grid: Precio y Stock */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Precio */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: '#ede8df', fontSize: '14px', fontWeight: 600 }}>
                Precio (Q) *
              </label>
              <input
                type="number"
                name="precio"
                value={form.precio}
                onChange={handleChange}
                disabled={submitting}
                placeholder="0.00"
                step="0.01"
                min="0"
                style={{
                  backgroundColor: '#242220',
                  border: '1px solid #3a3430',
                  borderRadius: '6px',
                  color: '#ede8df',
                  padding: '10px 12px',
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit',
                }}
                onFocus={(e) => {
                  ;(e.target as HTMLInputElement).style.borderColor = '#c2783c'
                }}
                onBlur={(e) => {
                  ;(e.target as HTMLInputElement).style.borderColor = '#3a3430'
                }}
              />
            </div>

            {/* Stock */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: '#ede8df', fontSize: '14px', fontWeight: 600 }}>
                Stock *
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                disabled={submitting}
                placeholder="0"
                min="0"
                style={{
                  backgroundColor: '#242220',
                  border: '1px solid #3a3430',
                  borderRadius: '6px',
                  color: '#ede8df',
                  padding: '10px 12px',
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit',
                }}
                onFocus={(e) => {
                  ;(e.target as HTMLInputElement).style.borderColor = '#c2783c'
                }}
                onBlur={(e) => {
                  ;(e.target as HTMLInputElement).style.borderColor = '#3a3430'
                }}
              />
            </div>
          </div>

          {/* Grid: Talla y Color */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Talla */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: '#ede8df', fontSize: '14px', fontWeight: 600 }}>
                Talla (Opcional)
              </label>
              <input
                type="text"
                name="talla"
                value={form.talla}
                onChange={handleChange}
                disabled={submitting}
                placeholder="Ej: 35, 36, 37..."
                style={{
                  backgroundColor: '#242220',
                  border: '1px solid #3a3430',
                  borderRadius: '6px',
                  color: '#ede8df',
                  padding: '10px 12px',
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit',
                }}
                onFocus={(e) => {
                  ;(e.target as HTMLInputElement).style.borderColor = '#c2783c'
                }}
                onBlur={(e) => {
                  ;(e.target as HTMLInputElement).style.borderColor = '#3a3430'
                }}
              />
            </div>

            {/* Color */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: '#ede8df', fontSize: '14px', fontWeight: 600 }}>
                Color (Opcional)
              </label>
              <input
                type="text"
                name="color"
                value={form.color}
                onChange={handleChange}
                disabled={submitting}
                placeholder="Ej: Negro, Rojo..."
                style={{
                  backgroundColor: '#242220',
                  border: '1px solid #3a3430',
                  borderRadius: '6px',
                  color: '#ede8df',
                  padding: '10px 12px',
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit',
                }}
                onFocus={(e) => {
                  ;(e.target as HTMLInputElement).style.borderColor = '#c2783c'
                }}
                onBlur={(e) => {
                  ;(e.target as HTMLInputElement).style.borderColor = '#3a3430'
                }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button
              type="button"
              onClick={() => navigate('/dashboard/productos')}
              disabled={submitting}
              style={{
                flex: 1,
                backgroundColor: '#2a2420',
                border: '1px solid #3a3430',
                color: '#8b7355',
                padding: '12px',
                borderRadius: '8px',
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                transition: 'all 0.2s ease',
                opacity: submitting ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (!submitting) {
                  ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = '#3a3430'
                }
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2a2420'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                flex: 1,
                backgroundColor: '#c2783c',
                border: 'none',
                color: 'white',
                padding: '12px',
                borderRadius: '8px',
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: submitting ? 0.8 : 1,
              }}
              onMouseEnter={(e) => {
                if (!submitting) {
                  ;(e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.1)'
                }
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1)'
              }}
            >
              <Save size={18} />
              {submitting ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
