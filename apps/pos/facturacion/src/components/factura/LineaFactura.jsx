import { Plus, Minus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { useFacturaStore } from '../../hooks/useFacturaStore';

export default function LineaFactura({ item }) {
  const incrementarCantidad = useFacturaStore((state) => state.incrementarCantidad);
  const decrementarCantidad = useFacturaStore((state) => state.decrementarCantidad);
  const eliminarItem = useFacturaStore((state) => state.eliminarItem);

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 text-sm truncate">
          {item.nombre}
        </h4>
        <p className="text-xs text-gray-600">
          {formatCurrency(item.precio)} / {item.unidad}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => decrementarCantidad(item.id)}
          className="p-1 rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Minus className="w-4 h-4 text-gray-600" />
        </button>

        <input
          type="number"
          value={item.cantidad}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            if (!isNaN(val) && val > 0) {
              useFacturaStore.getState().actualizarCantidad(item.id, val);
            }
          }}
          className="w-16 text-center font-semibold text-gray-900 border border-gray-300 rounded px-2 py-1"
          min="0.1"
          step="0.1"
        />

        <button
          onClick={() => incrementarCantidad(item.id)}
          className="p-1 rounded hover:bg-white transition-colors"
        >
          <Plus className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <div className="text-right min-w-[80px]">
        <p className="font-bold text-gray-900">{formatCurrency(item.subtotal)}</p>
      </div>

      <button
        onClick={() => eliminarItem(item.id)}
        className="p-2 rounded hover:bg-red-50 transition-colors group"
      >
        <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
      </button>
    </div>
  );
}
