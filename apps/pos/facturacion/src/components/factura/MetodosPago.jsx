import { useQuery } from '@tanstack/react-query';
import { Banknote, CreditCard, ArrowLeftRight, Wallet } from 'lucide-react';
import clsx from 'clsx';
import { getMetodosPago } from '../../data/mockMetodosPago';
import { useFacturaStore } from '../../hooks/useFacturaStore';

const ICONOS = {
  Banknote,
  CreditCard,
  ArrowLeftRight,
  Wallet,
};

export default function MetodosPago() {
  const metodoPago = useFacturaStore((state) => state.metodoPago);
  const setMetodoPago = useFacturaStore((state) => state.setMetodoPago);
  const referenciaPago = useFacturaStore((state) => state.referenciaPago);
  const setReferenciaPago = useFacturaStore((state) => state.setReferenciaPago);

  const { data: metodos = [] } = useQuery({
    queryKey: ['metodosPago'],
    queryFn: getMetodosPago,
  });

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Método de Pago</h3>

      <div className="grid grid-cols-2 gap-2 mb-3">
        {metodos.map((metodo) => {
          const Icono = ICONOS[metodo.icono] || Banknote;
          const seleccionado = metodoPago?.id === metodo.id;

          return (
            <button
              key={metodo.id}
              onClick={() => setMetodoPago(metodo)}
              className={clsx(
                'flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all',
                seleccionado
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              )}
            >
              <Icono
                className={clsx(
                  'w-6 h-6',
                  seleccionado ? 'text-blue-600' : 'text-gray-600'
                )}
              />
              <span
                className={clsx(
                  'text-xs font-medium',
                  seleccionado ? 'text-blue-700' : 'text-gray-700'
                )}
              >
                {metodo.nombre}
              </span>
            </button>
          );
        })}
      </div>

      {metodoPago?.requiereReferencia && (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Número de referencia
          </label>
          <input
            type="text"
            value={referenciaPago}
            onChange={(e) => setReferenciaPago(e.target.value)}
            placeholder="Ej: 1234567890"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
          />
        </div>
      )}
    </div>
  );
}
