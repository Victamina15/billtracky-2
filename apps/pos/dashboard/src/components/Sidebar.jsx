import { Home, Settings, Receipt, Package, BarChart3, Users, ChevronRight } from 'lucide-react'
import { useState } from 'react'

const modules = [
  {
    id: 'home',
    name: 'Inicio',
    icon: Home,
    url: '/',
    description: 'Dashboard principal'
  },
  {
    id: 'facturacion',
    name: 'Facturación',
    icon: Receipt,
    url: 'http://localhost:5173',
    description: 'Crear y gestionar facturas',
    external: true
  },
  {
    id: 'configuracion',
    name: 'Configuración',
    icon: Settings,
    url: 'http://localhost:5174',
    description: 'Servicios, categorías y métodos de pago',
    external: true,
    submodules: [
      { name: 'Servicios', icon: Package },
      { name: 'Categorías', icon: BarChart3 },
      { name: 'Métodos de Pago', icon: Receipt }
    ]
  },
  {
    id: 'clientes',
    name: 'Clientes',
    icon: Users,
    url: '#',
    description: 'Gestión de clientes',
    disabled: true
  }
]

export function Sidebar({ selectedModule, onModuleSelect }) {
  const [expandedModule, setExpandedModule] = useState(null)

  const handleModuleClick = (module) => {
    if (module.disabled) return

    if (module.external) {
      window.open(module.url, '_blank')
    } else {
      onModuleSelect(module)
    }

    if (module.submodules) {
      setExpandedModule(expandedModule === module.id ? null : module.id)
    }
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-sidebar-background">
      {/* Logo/Brand */}
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold text-sidebar-foreground">Billtracky</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {modules.map((module) => {
          const Icon = module.icon
          const isExpanded = expandedModule === module.id
          const isSelected = selectedModule?.id === module.id

          return (
            <div key={module.id}>
              {/* Main Module Button */}
              <button
                onClick={() => handleModuleClick(module)}
                disabled={module.disabled}
                className={`
                  group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left
                  transition-all duration-200
                  ${isSelected
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  }
                  ${module.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                `}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${isSelected ? 'text-sidebar-primary' : ''}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">{module.name}</span>
                    {module.submodules && (
                      <ChevronRight
                        className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                      />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{module.description}</p>
                </div>
                {module.external && (
                  <svg
                    className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                )}
              </button>

              {/* Submodules */}
              {module.submodules && isExpanded && (
                <div className="ml-8 mt-1 space-y-1">
                  {module.submodules.map((sub) => {
                    const SubIcon = sub.icon
                    return (
                      <div
                        key={sub.name}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent/30 transition-colors"
                      >
                        <SubIcon className="h-4 w-4" />
                        <span>{sub.name}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/50 px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
            <span className="text-sm font-semibold">U</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">Usuario</p>
            <p className="text-xs text-muted-foreground truncate">admin@billtracky.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
