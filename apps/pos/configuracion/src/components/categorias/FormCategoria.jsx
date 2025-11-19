import { X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useCategoriasStore } from '../../hooks/useCategoriasStore';

const coloresPredefinidos = [
  '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#6366F1',
  '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#84CC16', '#A855F7',
];

export default function FormCategoria({ categoria, onCerrar }) {
  const agregarCategoria = useCategoriasStore((state) => state.agregarCategoria);
  const actualizarCategoria = useCategoriasStore((state) => state.actualizarCategoria);

  const [formData, setFormData] = useState({
    nombre: categoria?.nombre || '',
    color: categoria?.color || '#3B82F6',
    descripcion: categoria?.descripcion || '',
  });

  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let resultado;
    if (categoria) {
      resultado = actualizarCategoria(categoria.id, formData);
    } else {
      resultado = agregarCategoria(formData);
    }

    if (resultado.success) {
      toast.success(categoria ? 'Categoría actualizada' : 'Categoría creada');
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
            {categoria ? 'Editar Categoría' : 'Nueva Categoría'}
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
              Nombre de la Categoría *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errores.nombre ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: Lavado"
            />
            {errores.nombre && (
              <p className="text-red-500 text-sm mt-1">{errores.nombre}</p>
            )}
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color *
            </label>
            <div className="grid grid-cols-6 gap-2 mb-3">
              {coloresPredefinidos.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, color }))}
                  className={`w-full h-10 rounded-lg border-2 transition-all ${
                    formData.color === color
                      ? 'border-gray-900 scale-110'
                      : 'border-gray-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono ${
                errores.color ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="#3B82F6"
              pattern="^#[0-9A-Fa-f]{6}$"
            />
            {errores.color && (
              <p className="text-red-500 text-sm mt-1">{errores.color}</p>
            )}
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
              placeholder="Descripción opcional de la categoría..."
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
              {categoria ? 'Guardar Cambios' : 'Crear Categoría'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
