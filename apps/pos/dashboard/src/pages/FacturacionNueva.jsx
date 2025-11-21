import ClienteSelector from '@shared/components/layout/ClienteSelector'
import FechaEntregaSelector from '@shared/components/layout/FechaEntregaSelector'
import ListaServicios from '@shared/components/servicios/ListaServicios'
import PanelFactura from '@shared/components/factura/PanelFactura'

export function FacturacionNuevaPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Nueva Factura</h1>
        <p className="text-gray-500 mt-1">Crear una nueva factura de venta</p>
      </div>

      {/* Grid de selecciones de cliente y fecha */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ClienteSelector />
        <FechaEntregaSelector />
      </div>

      {/* Layout principal: Servicios (izquierda) + Factura (derecha) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de servicios - 2/3 del espacio */}
        <div className="lg:col-span-2 h-[calc(100vh-450px)] lg:h-[calc(100vh-380px)]">
          <ListaServicios />
        </div>

        {/* Panel de factura - 1/3 del espacio */}
        <div className="lg:col-span-1 h-[calc(100vh-450px)] lg:h-[calc(100vh-380px)]">
          <div className="sticky top-6 h-full">
            <PanelFactura />
          </div>
        </div>
      </div>
    </div>
  )
}
