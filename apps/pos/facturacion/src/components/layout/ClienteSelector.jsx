import { useState } from 'react';
import { Search, User, Plus } from 'lucide-react';
import { useFacturaStore } from '../../hooks/useFacturaStore';

export default function ClienteSelector() {
  const [busqueda, setBusqueda] = useState('');
  const cliente = useFacturaStore((state) => state.cliente);
  const setCliente = useFacturaStore((state) => state.setCliente);

  const handleSeleccionarCliente = () => {
    // TODO: Conectar con base de datos de clientes
    if (busqueda.trim()) {
      setCliente({
        id: Date.now(),
        nombre: busqueda,
        telefono: '',
        email: '',
      });
      setBusqueda('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Cliente
      </label>

      {cliente ? (
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{cliente.nombre}</p>
              <p className="text-sm text-gray-600">Cliente seleccionado</p>
            </div>
          </div>
          <button
            onClick={() => setCliente(null)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Cambiar
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSeleccionarCliente()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <button
            onClick={handleSeleccionarCliente}
            disabled={!busqueda.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Agregar</span>
          </button>
        </div>
      )}
    </div>
  );
}
