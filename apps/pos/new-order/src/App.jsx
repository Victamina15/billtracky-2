import { useState } from 'react'

function App() {
  return (
    <div className="min-h-screen bg-[#F4F4F5] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Nuevo Pedido
          </h1>
          <p className="text-gray-600">
            Módulo de facturación POS - Billtracky 2.0
          </p>
          <div className="mt-6 p-4 bg-[#F4F4F5] rounded-lg">
            <p className="text-sm text-gray-700">
              ✅ Proyecto Vite configurado correctamente
            </p>
            <p className="text-sm text-gray-700">
              ✅ TailwindCSS instalado y funcionando
            </p>
            <p className="text-sm text-gray-700">
              ✅ Colores oficiales aplicados: Fondo #F4F4F5, Contenedores #FFFFFF
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
