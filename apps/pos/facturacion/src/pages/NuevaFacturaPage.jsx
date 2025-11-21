import Header from '@shared/components/layout/Header';
import ClienteSelector from '@shared/components/layout/ClienteSelector';
import FechaEntregaSelector from '@shared/components/layout/FechaEntregaSelector';
import ListaServicios from '@shared/components/servicios/ListaServicios';
import PanelFactura from '@shared/components/factura/PanelFactura';

export default function NuevaFacturaPage() {
  return (
    <div className="min-h-screen bg-[#F4F4F5] p-4 md:p-6">
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <Header />

        {/* Grid de selecciones de cliente y fecha */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <ClienteSelector />
          <FechaEntregaSelector />
        </div>

        {/* Layout principal: Servicios (izquierda) + Factura (derecha) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel de servicios - 2/3 del espacio */}
          <div className="lg:col-span-2 h-[calc(100vh-400px)] lg:h-[calc(100vh-320px)]">
            <ListaServicios />
          </div>

          {/* Panel de factura - 1/3 del espacio */}
          <div className="lg:col-span-1 h-[calc(100vh-400px)] lg:h-[calc(100vh-320px)]">
            <div className="sticky top-6 h-full">
              <PanelFactura />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
