import { Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'sonner';
import { useServiciosStore } from '../../hooks/useServiciosStore';
import { useCategoriasStore } from '../../hooks/useCategoriasStore';

export default function ServicioRow({ servicio, onEditar }) {
  const eliminarServicio = useServiciosStore((state) => state.eliminarServicio);
  const toggleActivoServicio = useServiciosStore((state) => state.toggleActivoServicio);
  const categorias = useCategoriasStore((state) => state.categorias);

  const categoria = categorias.find((c) => c.id === servicio.categoria);

  const handleEliminar = () => {
    if (window.confirm(`¿Eliminar el servicio "${servicio.nombre}"?`)) {
      eliminarServicio(servicio.id);
      toast.success('Servicio eliminado');
    }
  };

  const handleToggleActivo = () => {
    toggleActivoServicio(servicio.id);
    toast.success(servicio.activo ? 'Servicio desactivado' : 'Servicio activado');
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div>
          <div className="font-medium text-gray-900">{servicio.nombre}</div>
          {servicio.descripcion && (
            <div className="text-sm text-gray-500 mt-1">{servicio.descripcion}</div>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        {categoria && (
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: categoria.color }}
          >
            {categoria.nombre}
          </span>
        )}
      </td>
      <td className="px-6 py-4">
        <span className="font-semibold text-gray-900">
          ${servicio.precio.toFixed(2)}
        </span>
      </td>
      <td className="px-6 py-4 text-gray-600">
        {servicio.unidad}
      </td>
      <td className="px-6 py-4">
        <button
          onClick={handleToggleActivo}
          className="flex items-center gap-1"
        >
          {servicio.activo ? (
            <>
              <ToggleRight className="w-6 h-6 text-green-500" />
              <span className="text-sm text-green-600 font-medium">Activo</span>
            </>
          ) : (
            <>
              <ToggleLeft className="w-6 h-6 text-gray-400" />
              <span className="text-sm text-gray-500 font-medium">Inactivo</span>
            </>
          )}
        </button>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEditar(servicio)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Editar"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleEliminar}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
