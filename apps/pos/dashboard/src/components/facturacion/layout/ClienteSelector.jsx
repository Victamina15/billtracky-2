import { useState } from 'react';
import { Search, User, Phone, Mail, MapPin } from 'lucide-react';
import { useFacturaStore } from '../../../hooks/facturacion/useFacturaStore';
import { useClientesStore } from '../../../hooks/clientes/useClientesStore';
import ClienteModal from '../clientes/ClienteModal';

/**
 * Componente de selección de cliente para facturación
 * Integrado con Zustand stores y modal profesional
 */
export default function ClienteSelector() {
  const [modalAbierto, setModalAbierto] = useState(false);

  // Store de factura (para sincronizar con la factura actual)
  const cliente = useFacturaStore((state) => state.cliente);
  const setCliente = useFacturaStore((state) => state.setCliente);

  // Store de clientes (para obtener el cliente completo)
  const clienteSeleccionado = useClientesStore((state) => state.clienteSeleccionado);
  const limpiarSeleccion = useClientesStore((state) => state.limpiarSeleccion);

  const handleSelectCliente = (clienteData) => {
    // Sincronizar con factura store
    setCliente({
      id: clienteData.id,
      nombre: clienteData.nombre,
      telefono: clienteData.telefono,
      email: clienteData.email,
    });
  };

  const handleCambiarCliente = () => {
    setCliente(null);
    limpiarSeleccion();
    setModalAbierto(true);
  };

  // Usar clienteSeleccionado del store si está disponible, sino usar cliente de factura
  const clienteActual = clienteSeleccionado || cliente;

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-4">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Cliente
        </label>

        {clienteActual ? (
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200">
            <div className="flex items-start gap-3 flex-1">
              <div className="bg-blue-500 p-2.5 rounded-full">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-lg">{clienteActual.nombre}</p>
                <div className="mt-2 space-y-1">
                  {clienteActual.telefono && (
                    <p className="text-sm text-gray-700 flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">{clienteActual.telefono}</span>
                    </p>
                  )}
                  {clienteActual.email && (
                    <p className="text-sm text-gray-600 flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span>{clienteActual.email}</span>
                    </p>
                  )}
                  {clienteActual.direccion && (
                    <p className="text-sm text-gray-600 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span>{clienteActual.direccion}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={handleCambiarCliente}
              className="ml-4 px-4 py-2 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-sm"
            >
              Cambiar
            </button>
          </div>
        ) : (
          <button
            onClick={() => setModalAbierto(true)}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="bg-gray-100 p-2 rounded-full group-hover:bg-blue-100 transition-colors">
                <Search className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Buscar o agregar cliente</p>
                <p className="text-sm text-gray-500">Haz clic para seleccionar un cliente</p>
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Modal de clientes */}
      <ClienteModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSelectCliente={handleSelectCliente}
      />
    </>
  );
}
