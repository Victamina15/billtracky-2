import { useState, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Search, Loader2 } from 'lucide-react';
import ServicioCard from './ServicioCard';
import Categorias from './Categorias';
import { getServicios, searchServicios } from '../../data/mockServicios';

export default function ListaServicios() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const parentRef = useRef(null);

  // Usar React Query para cargar servicios
  const { data: servicios = [], isLoading } = useQuery({
    queryKey: ['servicios', categoriaSeleccionada],
    queryFn: () => getServicios(categoriaSeleccionada),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Filtrar servicios por búsqueda
  const serviciosFiltrados = useMemo(() => {
    return searchServicios(busqueda, servicios);
  }, [servicios, busqueda]);

  // Configurar virtualización
  const rowVirtualizer = useVirtualizer({
    count: serviciosFiltrados.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // Altura estimada de cada item
    overscan: 5, // Renderizar 5 items extra fuera de la vista
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col h-full">
      {/* Categorías */}
      <div className="mb-4">
        <Categorias onCategoriaChange={setCategoriaSeleccionada} />
      </div>

      {/* Buscador */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar servicio..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Lista virtualizada */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : (
        <div
          ref={parentRef}
          className="flex-1 overflow-auto"
          style={{ height: 'calc(100vh - 400px)' }}
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const servicio = serviciosFiltrados[virtualRow.index];

              return (
                <div
                  key={servicio.id}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className="px-1 py-1"
                >
                  <ServicioCard servicio={servicio} />
                </div>
              );
            })}
          </div>

          {serviciosFiltrados.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron servicios</p>
            </div>
          )}
        </div>
      )}

      {/* Contador */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          {serviciosFiltrados.length} servicio{serviciosFiltrados.length !== 1 ? 's' : ''} disponible{serviciosFiltrados.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
