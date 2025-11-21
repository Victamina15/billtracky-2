import { Edit2, Trash2, ToggleLeft, ToggleRight, Folder } from 'lucide-react';
import { toast } from 'sonner';
import { useCategoriasStore } from '@shared/hooks/useCategoriasStore';

export default function CategoriaCard({ categoria, onEditar }) {
  const eliminarCategoria = useCategoriasStore((state) => state.eliminarCategoria);
  const toggleActivoCategoria = useCategoriasStore((state) => state.toggleActivoCategoria);

  const handleEliminar = () => {
    if (window.confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) {
      eliminarCategoria(categoria.id);
      toast.success('Categoría eliminada');
    }
  };

  const handleToggleActivo = () => {
    toggleActivoCategoria(categoria.id);
    toast.success(categoria.activo ? 'Categoría desactivada' : 'Categoría activada');
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-6 border-2`}
      style={{
        borderColor: categoria.activo ? categoria.color : '#E5E7EB',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="p-3 rounded-lg"
          style={{
            backgroundColor: categoria.activo ? `${categoria.color}20` : '#F3F4F6',
          }}
        >
          <Folder
            className="w-6 h-6"
            style={{
              color: categoria.activo ? categoria.color : '#9CA3AF',
            }}
          />
        </div>
        <button onClick={handleToggleActivo} className="p-1">
          {categoria.activo ? (
            <ToggleRight className="w-6 h-6 text-green-500" />
          ) : (
            <ToggleLeft className="w-6 h-6 text-gray-400" />
          )}
        </button>
      </div>

      {/* Contenido */}
      <h4 className="font-bold text-gray-900 text-lg mb-1">{categoria.nombre}</h4>
      <p className="text-sm text-gray-500 mb-3">{categoria.descripcion || 'Sin descripción'}</p>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-gray-600">Color:</span>
        <div
          className="w-6 h-6 rounded border border-gray-300"
          style={{ backgroundColor: categoria.color }}
        ></div>
        <span className="text-sm font-mono text-gray-500">{categoria.color}</span>
      </div>

      {/* Acciones */}
      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <button
          onClick={() => onEditar(categoria)}
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
