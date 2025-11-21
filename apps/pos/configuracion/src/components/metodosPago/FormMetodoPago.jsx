import { X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useMetodosPagoStore } from '@shared/hooks/useMetodosPagoStore';

const iconosDisponibles = [
  { value: 'Banknote', label: 'Billete' },
  { value: 'CreditCard', label: 'Tarjeta' },
  { value: 'ArrowRightLeft', label: 'Transferencia' },
  { value: 'Clock', label: 'Reloj' },
];

export default function FormMetodoPago({ metodoPago, onCerrar }) {
  const agregarMetodoPago = useMetodosPagoStore((state) => state.agregarMetodoPago);
  const actualizarMetodoPago = useMetodosPagoStore((state) => state.actualizarMetodoPago);

  const [formData, setFormData] = useState({
    nombre: metodoPago?.nombre || '',
    tipo: metodoPago?.tipo || 'otro',
    icono: metodoPago?.icono || 'CreditCard',
    requiereReferencia: metodoPago?.requiereReferencia || false,
    comision: metodoPago?.comision || '',
  });

  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const datos = {
      ...formData,
      comision: formData.comision ? parseFloat(formData.comision) : 0,
    };

    let resultado;
    if (metodoPago) {
      resultado = actualizarMetodoPago(metodoPago.id, datos);
    } else {
      resultado = agregarMetodoPago(datos);
    }

    if (resultado.success) {
      toast.success(metodoPago ? 'Método actualizado' : 'Método creado');
      onCerrar();
    } else {
      const erroresZod = {};
      resultado.error.forEach((err) => {
        erroresZod[err.path[0]] = err.message;
      });
      setErrores(erroresZod);
      toast.error('Revisa los campos del formulario');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {metodoPago ? 'Editar Método de Pago' : 'Nuevo Método de Pago'}
          </h2>
          <button
            onClick={onCerrar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errores.nombre ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: Efectivo"
            />
            {errores.nombre && (
              <p className="text-red-500 text-sm mt-1">{errores.nombre}</p>
            )}
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo *
            </label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errores.tipo ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="transferencia">Transferencia</option>
              <option value="credito">Crédito</option>
              <option value="otro">Otro</option>
            </select>
            {errores.tipo && (
              <p className="text-red-500 text-sm mt-1">{errores.tipo}</p>
            )}
          </div>

          {/* Icono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icono
            </label>
            <select
              name="icono"
              value={formData.icono}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {iconosDisponibles.map((icono) => (
                <option key={icono.value} value={icono.value}>
                  {icono.label}
                </option>
              ))}
            </select>
          </div>

          {/* Comisión */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comisión (%)
            </label>
            <input
              type="number"
              name="comision"
              value={formData.comision}
              onChange={handleChange}
              step="0.1"
              min="0"
              max="100"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </div>

          {/* Requiere referencia */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="requiereReferencia"
              name="requiereReferencia"
              checked={formData.requiereReferencia}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="requiereReferencia" className="text-sm font-medium text-gray-700">
              Requiere número de referencia
            </label>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCerrar}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              {metodoPago ? 'Guardar Cambios' : 'Crear Método'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
