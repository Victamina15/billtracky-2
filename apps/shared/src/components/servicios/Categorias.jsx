import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { getCategorias } from '../../data/mockServicios';

export default function Categorias({ onCategoriaChange }) {
  const [categoriaActiva, setCategoriaActiva] = useState('todos');

  // Cargar categorías desde configuración
  const { data: categorias = [], isLoading } = useQuery({
    queryKey: ['categorias'],
    queryFn: getCategorias,
    staleTime: 1000 * 60 * 10, // 10 minutos
  });

  const handleCategoriaClick = (categoriaId) => {
    setCategoriaActiva(categoriaId);
    onCategoriaChange(categoriaId);
  };

  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse flex-shrink-0" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categorias.map((categoria) => {
        const activa = categoriaActiva === categoria.id;

        return (
          <button
            key={categoria.id}
            onClick={() => handleCategoriaClick(categoria.id)}
            className={clsx(
              'px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all flex-shrink-0',
              activa
                ? 'text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            )}
            style={{
              backgroundColor: activa ? categoria.color : undefined,
            }}
          >
            {categoria.nombre}
          </button>
        );
      })}
    </div>
  );
}
