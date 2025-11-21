import { ShoppingCart, Trash2, Check, Printer, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useFacturaStore } from '../../hooks/useFacturaStore';
import LineaFactura from './LineaFactura';
import Totales from './Totales';
import MetodosPago from './MetodosPago';

export default function PanelFactura() {
  const items = useFacturaStore((state) => state.items);
  const limpiarFactura = useFacturaStore((state) => state.limpiarFactura);
  const puedeCompletar = useFacturaStore((state) => state.puedeCompletar);
  const getFacturaData = useFacturaStore((state) => state.getFacturaData);
  const getCantidadItems = useFacturaStore((state) => state.getCantidadItems);

  const cantidadItems = getCantidadItems();

  const handleCobrar = () => {
    if (!puedeCompletar()) {
      toast.error('Completa todos los campos requeridos');
      return;
    }

    const facturaData = getFacturaData();

    // TODO: Guardar en base de datos

    toast.success('Factura completada', {
      description: `Total: ${facturaData.total.toFixed(2)}`,
    });

    limpiarFactura();
  };

  const handlePendiente = () => {
    if (items.length === 0) {
      toast.error('Agrega servicios a la factura');
      return;
    }

    // TODO: Guardar como pendiente
    toast.success('Factura guardada como pendiente');
    limpiarFactura();
  };

  const handleImprimir = () => {
    if (items.length === 0) {
      toast.error('No hay nada que imprimir');
      return;
    }

    // TODO: Generar PDF e imprimir
    toast.info('Generando impresión...');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-bold text-gray-900">Factura Actual</h2>
          {cantidadItems > 0 && (
            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
              {cantidadItems}
            </span>
          )}
        </div>

        {items.length > 0 && (
          <button
            onClick={limpiarFactura}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
            title="Limpiar factura"
          >
            <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-600" />
          </button>
        )}
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto mb-6 space-y-2">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">No hay servicios agregados</p>
            <p className="text-sm text-gray-400 mt-1">
              Selecciona servicios para comenzar
            </p>
          </div>
        ) : (
          items.map((item) => <LineaFactura key={item.id} item={item} />)
        )}
      </div>

      {/* Totales */}
      {items.length > 0 && (
        <div className="mb-6">
          <Totales />
        </div>
      )}

      {/* Métodos de pago */}
      {items.length > 0 && (
        <div className="mb-6">
          <MetodosPago />
        </div>
      )}

      {/* Botones de acción */}
      <div className="space-y-2">
        <button
          onClick={handleCobrar}
          disabled={!puedeCompletar()}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all shadow-lg disabled:shadow-none"
        >
          <Check className="w-5 h-5" />
          COBRAR
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handlePendiente}
            className="py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <Clock className="w-4 h-4" />
            Pendiente
          </button>

          <button
            onClick={handleImprimir}
            className="py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
        </div>
      </div>
    </div>
  );
}
