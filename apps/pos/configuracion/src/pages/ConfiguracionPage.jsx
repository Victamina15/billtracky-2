import { useState } from 'react';
import Header from '../components/layout/Header';
import Navigation from '../components/layout/Navigation';
import ListaServicios from '../components/servicios/ListaServicios';
import ListaCategorias from '../components/categorias/ListaCategorias';
import ListaMetodosPago from '../components/metodosPago/ListaMetodosPago';

export default function ConfiguracionPage() {
  const [tabActivo, setTabActivo] = useState('servicios');

  return (
    <div className="min-h-screen bg-[#F4F4F5] p-4 md:p-6">
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <Header />

        {/* Navegación por tabs */}
        <Navigation tabActivo={tabActivo} setTabActivo={setTabActivo} />

        {/* Contenido según tab activo */}
        <div>
          {tabActivo === 'servicios' && <ListaServicios />}
          {tabActivo === 'categorias' && <ListaCategorias />}
          {tabActivo === 'metodosPago' && <ListaMetodosPago />}
        </div>
      </div>
    </div>
  );
}
