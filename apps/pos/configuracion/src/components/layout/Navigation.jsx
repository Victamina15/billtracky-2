import { Package, CreditCard, Folder } from 'lucide-react';
import clsx from 'clsx';

const tabs = [
  { id: 'servicios', nombre: 'Servicios', icon: Package },
  { id: 'categorias', nombre: 'Categorías', icon: Folder },
  { id: 'metodosPago', nombre: 'Métodos de Pago', icon: CreditCard },
];

export default function Navigation({ tabActivo, setTabActivo }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-2 mb-6">
      <div className="flex gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tabActivo === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setTabActivo(tab.id)}
              className={clsx(
                'flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all',
                isActive
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.nombre}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
