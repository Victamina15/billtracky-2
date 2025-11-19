import { Settings } from 'lucide-react';

export default function Header() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 p-3 rounded-lg">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
            <p className="text-sm text-gray-500">
              Gestiona servicios, categorías y métodos de pago
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
