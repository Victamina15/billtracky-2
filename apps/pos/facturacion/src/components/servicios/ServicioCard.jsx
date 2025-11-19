import { Plus } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { useFacturaStore } from '../../hooks/useFacturaStore';
import { toast } from 'sonner';

export default function ServicioCard({ servicio }) {
  const agregarServicio = useFacturaStore((state) => state.agregarServicio);

  const handleAgregar = () => {
    agregarServicio(servicio);
    toast.success(`${servicio.nombre} agregado`, {
      description: `${formatCurrency(servicio.precio)} por ${servicio.unidad}`,
      duration: 2000,
    });
  };

  return (
    <button
      onClick={handleAgregar}
      className="bg-white rounded-lg p-4 shadow-sm border-2 border-transparent hover:border-blue-500 hover:shadow-md transition-all text-left w-full group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight">
          {servicio.nombre}
        </h3>
        <div className="bg-blue-50 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <Plus className="w-4 h-4 text-blue-600" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xl font-bold text-gray-900">
          {formatCurrency(servicio.precio)}
        </span>
        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
          por {servicio.unidad}
        </span>
      </div>
    </button>
  );
}
