import { X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useServiciosStore } from '../../hooks/useServiciosStore';
import { useCategoriasStore } from '../../hooks/useCategoriasStore';

export default function FormServicio({ servicio, onCerrar }) {
  const agregarServicio = useServiciosStore((state) => state.agregarServicio);
  const actualizarServicio = useServiciosStore((state) => state.actualizarServicio);
  const categorias = useCategoriasStore((state) => state.categorias);

  const [formData, setFormData] = useState({
    nombre: servicio?.nombre || '',
    categoria: servicio?.categoria || '',
    precio: servicio?.precio || '',
    unidad: servicio?.unidad || 'unidad',
    descripcion: servicio?.descripcion || '',
    tiempoEstimado: servicio?.tiempoEstimado || '',
  });

  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo al modificarlo
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const datos = {
      ...formData,
      precio: parseFloat(formData.precio),
      tiempoEstimado: formData.tiempoEstimado ? parseInt(formData.tiempoEstimado) : undefined,
    };

    let resultado;
    if (servicio) {
      // Editar
      resultado = actualizarServicio(servicio.id, datos);
    } else {
      // Crear nuevo
      resultado = agregarServicio(datos);
    }

    if (resultado.success) {
      toast.success(servicio ? 'Servicio actualizado' : 'Servicio creado');
      onCerrar();
    } else {
      // Mostrar errores de validación de Zod
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
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {servicio ? 'Editar Servicio' : 'Nuevo Servicio'}
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
              Nombre del Servicio *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errores.nombre ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: Lavado Express"
            />
            {errores.nombre && (
              <p className="text-red-500 text-sm mt-1">{errores.nombre}</p>
            )}
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría *
            </label>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errores.categoria ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
            {errores.categoria && (
              <p className="text-red-500 text-sm mt-1">{errores.categoria}</p>
            )}
          </div>

          {/* Precio y Unidad */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio *
              </label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                step="0.01"
                min="0.01"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errores.precio ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errores.precio && (
                <p className="text-red-500 text-sm mt-1">{errores.precio}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unidad *
              </label>
              <select
                name="unidad"
                value={formData.unidad}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errores.unidad ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="kg">kg</option>
                <option value="unidad">unidad</option>
                <option value="metro">metro</option>
                <option value="servicio">servicio</option>
              </select>
              {errores.unidad && (
                <p className="text-red-500 text-sm mt-1">{errores.unidad}</p>
              )}
            </div>
          </div>

          {/* Tiempo Estimado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiempo Estimado (minutos)
            </label>
            <input
              type="number"
              name="tiempoEstimado"
              value={formData.tiempoEstimado}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="120"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows="3"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errores.descripcion ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Descripción opcional del servicio..."
            />
            {errores.descripcion && (
              <p className="text-red-500 text-sm mt-1">{errores.descripcion}</p>
            )}
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
              {servicio ? 'Guardar Cambios' : 'Crear Servicio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
