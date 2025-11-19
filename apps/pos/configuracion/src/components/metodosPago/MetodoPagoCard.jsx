import { Edit2, Trash2, ToggleLeft, ToggleRight, Banknote, CreditCard, ArrowRightLeft, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useMetodosPagoStore } from '../../hooks/useMetodosPagoStore';

const iconMap = {
  Banknote,
  CreditCard,
  ArrowRightLeft,
  Clock,
};

export default function MetodoPagoCard({ metodoPago, onEditar }) {
  const eliminarMetodoPago = useMetodosPagoStore((state) => state.eliminarMetodoPago);
  const toggleActivoMetodoPago = useMetodosPagoStore((state) => state.toggleActivoMetodoPago);

  const Icon = iconMap[metodoPago.icono] || CreditCard;

  const handleEliminar = () => {
    if (window.confirm(`¿Eliminar el método de pago "${metodoPago.nombre}"?`)) {
      eliminarMetodoPago(metodoPago.id);
      toast.success('Método de pago eliminado');
    }
  };

  const handleToggleActivo = () => {
    toggleActivoMetodoPago(metodoPago.id);
    toast.success(metodoPago.activo ? 'Método desactivado' : 'Método activado');
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 border-2 ${
      metodoPago.activo ? 'border-blue-200' : 'border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${
          metodoPago.activo ? 'bg-blue-100' : 'bg-gray-100'
        }`}>
          <Icon className={`w-6 h-6 ${
            metodoPago.activo ? 'text-blue-600' : 'text-gray-400'
          }`} />
        </div>
        <button
          onClick={handleToggleActivo}
          className="p-1"
        >
          {metodoPago.activo ? (
            <ToggleRight className="w-6 h-6 text-green-500" />
          ) : (
            <ToggleLeft className="w-6 h-6 text-gray-400" />
          )}
        </button>
      </div>

      {/* Contenido */}
      <h4 className="font-bold text-gray-900 text-lg mb-1">{metodoPago.nombre}</h4>
      <p className="text-sm text-gray-500 capitalize mb-3">{metodoPago.tipo}</p>

      <div className="space-y-2 mb-4">
        {metodoPago.requiereReferencia && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Requiere referencia
          </div>
        )}
        {metodoPago.comision > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
            Comisión: {metodoPago.comision}%
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <button
          onClick={() => onEditar(metodoPago)}
          className="flex-1 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <Edit2 className="w-4 h-4" />
          Editar
        </button>
        <button
          onClick={handleEliminar}
          className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
