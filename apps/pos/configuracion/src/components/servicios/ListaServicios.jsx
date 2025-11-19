import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { useServiciosStore } from '../../hooks/useServiciosStore';
import { useCategoriasStore } from '../../hooks/useCategoriasStore';
import FormServicio from './FormServicio';
import ServicioRow from './ServicioRow';

export default function ListaServicios() {
  const [mostrarForm, setMostrarForm] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todos');

  const servicios = useServiciosStore((state) => state.servicios);
  const categorias = useCategoriasStore((state) => state.categorias);
  const servicioEditando = useServiciosStore((state) => state.servicioEditando);
  const setServicioEditando = useServiciosStore((state) => state.setServicioEditando);

  // Filtrar servicios
  const serviciosFiltrados = servicios.filter((servicio) => {
    const matchCategoria = categoriaFiltro === 'todos' || servicio.categoria === categoriaFiltro;
    const matchBusqueda = busqueda === '' ||
      servicio.nombre.toLowerCase().includes(busqueda.toLowerCase());

    return matchCategoria && matchBusqueda;
  });

  const handleNuevo = () => {
    setServicioEditando(null);
    setMostrarForm(true);
  };

  const handleEditar = (servicio) => {
    setServicioEditando(servicio);
    setMostrarForm(true);
  };

  const handleCerrarForm = () => {
    setMostrarForm(false);
    setServicioEditando(null);
  };

  return (
    <div>
      {/* Header con búsqueda y filtros */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
          <div className="flex-1 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar servicios..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="todos">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>

            <button
              onClick={handleNuevo}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Nuevo Servicio
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          {serviciosFiltrados.length} servicio{serviciosFiltrados.length !== 1 ? 's' : ''} encontrado{serviciosFiltrados.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Formulario de creación/edición */}
      {mostrarForm && (
        <FormServicio
          servicio={servicioEditando}
          onCerrar={handleCerrarForm}
        />
      )}

      {/* Tabla de servicios */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Servicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Unidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {serviciosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No se encontraron servicios
                  </td>
                </tr>
              ) : (
                serviciosFiltrados.map((servicio) => (
                  <ServicioRow
                    key={servicio.id}
                    servicio={servicio}
                    onEditar={handleEditar}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
