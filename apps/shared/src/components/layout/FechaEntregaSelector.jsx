import { Calendar } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { useFacturaStore } from '../../hooks/useFacturaStore';
import { formatRelativeDate } from '../../utils/formatDate';

const opcionesFechas = [
  { dias: 0, label: 'Hoy' },
  { dias: 1, label: 'Mañana' },
  { dias: 2, label: '2 días' },
  { dias: 3, label: '3 días' },
  { dias: 7, label: '1 semana' },
];

export default function FechaEntregaSelector() {
  const fechaEntrega = useFacturaStore((state) => state.fechaEntrega);
  const setFechaEntrega = useFacturaStore((state) => state.setFechaEntrega);

  const handleSeleccionarFecha = (dias) => {
    const nuevaFecha = addDays(new Date(), dias);
    setFechaEntrega(nuevaFecha);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Fecha de Entrega
      </label>

      <div className="grid grid-cols-5 gap-2 mb-3">
        {opcionesFechas.map((opcion) => {
          const fecha = addDays(new Date(), opcion.dias);
          const seleccionada =
            format(fechaEntrega, 'yyyy-MM-dd') === format(fecha, 'yyyy-MM-dd');

          return (
            <button
              key={opcion.dias}
              onClick={() => handleSeleccionarFecha(opcion.dias)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                seleccionada
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {opcion.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
        <Calendar className="w-5 h-5 text-blue-600" />
        <div>
          <p className="text-sm text-gray-600">Entrega programada</p>
          <p className="font-semibold text-gray-900">
            {format(fechaEntrega, "EEEE, d 'de' MMMM", { locale: es })}
          </p>
        </div>
      </div>
    </div>
  );
}
