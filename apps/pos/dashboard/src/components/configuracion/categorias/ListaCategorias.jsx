import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useCategoriasStore } from '@shared/hooks/useCategoriasStore';
import FormCategoria from './FormCategoria';
import CategoriaCard from './CategoriaCard';

export default function ListaCategorias() {
  const [mostrarForm, setMostrarForm] = useState(false);
  const categorias = useCategoriasStore((state) => state.categorias);
  const categoriaEditando = useCategoriasStore((state) => state.categoriaEditando);
  const setCategoriaEditando = useCategoriasStore((state) => state.setCategoriaEditando);

  const handleNuevo = () => {
    setCategoriaEditando(null);
    setMostrarForm(true);
  };

  const handleEditar = (categoria) => {
    setCategoriaEditando(categoria);
    setMostrarForm(true);
  };

  const handleCerrarForm = () => {
    setMostrarForm(false);
    setCategoriaEditando(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Categorías de Servicios</h3>
            <p className="text-sm text-gray-500 mt-1">
              {categorias.length} categoría{categorias.length !== 1 ? 's' : ''} configurada{categorias.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={handleNuevo}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nueva Categoría
          </button>
        </div>
      </div>

      {/* Formulario */}
      {mostrarForm && (
        <FormCategoria
          categoria={categoriaEditando}
          onCerrar={handleCerrarForm}
        />
      )}

      {/* Grid de categorías */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categorias.map((categoria) => (
          <CategoriaCard
            key={categoria.id}
            categoria={categoria}
            onEditar={handleEditar}
          />
        ))}
      </div>

      {categorias.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-500">No hay categorías configuradas</p>
        </div>
      )}
    </div>
  );
}
