import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useMetodosPagoStore } from '../../hooks/useMetodosPagoStore';
import FormMetodoPago from './FormMetodoPago';
import MetodoPagoCard from './MetodoPagoCard';

export default function ListaMetodosPago() {
  const [mostrarForm, setMostrarForm] = useState(false);
  const metodosPago = useMetodosPagoStore((state) => state.metodosPago);
  const metodoPagoEditando = useMetodosPagoStore((state) => state.metodoPagoEditando);
  const setMetodoPagoEditando = useMetodosPagoStore((state) => state.setMetodoPagoEditando);

  const handleNuevo = () => {
    setMetodoPagoEditando(null);
    setMostrarForm(true);
  };

  const handleEditar = (metodoPago) => {
    setMetodoPagoEditando(metodoPago);
    setMostrarForm(true);
  };

  const handleCerrarForm = () => {
    setMostrarForm(false);
    setMetodoPagoEditando(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Métodos de Pago</h3>
            <p className="text-sm text-gray-500 mt-1">
              {metodosPago.length} método{metodosPago.length !== 1 ? 's' : ''} configurado{metodosPago.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={handleNuevo}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nuevo Método
          </button>
        </div>
      </div>

      {/* Formulario */}
      {mostrarForm && (
        <FormMetodoPago
          metodoPago={metodoPagoEditando}
          onCerrar={handleCerrarForm}
        />
      )}

      {/* Grid de métodos de pago */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metodosPago.map((metodoPago) => (
          <MetodoPagoCard
            key={metodoPago.id}
            metodoPago={metodoPago}
            onEditar={handleEditar}
          />
        ))}
      </div>

      {metodosPago.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-500">No hay métodos de pago configurados</p>
        </div>
      )}
    </div>
  );
}
