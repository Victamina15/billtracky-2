import { Home, Receipt, Settings, Package, CreditCard, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '../lib/utils'

const navigation = [
  {
    id: 'inicio',
    name: 'Inicio',
    href: '/inicio',
    icon: Home,
    description: 'Dashboard principal'
  },
  {
    id: 'facturacion',
    name: 'Facturación',
    href: '/facturacion/nueva',
    icon: Receipt,
    description: 'Crear y gestionar facturas'
  },
  {
    id: 'configuracion',
    name: 'Configuración',
    icon: Settings,
    description: 'Gestionar configuración del sistema',
    children: [
      {
        name: 'Servicios',
        href: '/configuracion/servicios',
        icon: Package
      },
      {
        name: 'Métodos de Pago',
        href: '/configuracion/metodos-pago',
        icon: CreditCard
      }
    ]
  }
]

export function Sidebar() {
  const [expandedItems, setExpandedItems] = useState(['configuracion'])
  const location = useLocation()

  const toggleExpanded = (id) => {
    setExpandedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const isActive = (href) => {
    if (!href) return false
    return location.pathname === href || location.pathname.startsWith(href + '/')
  }

  const hasActiveChild = (item) => {
    return item.children?.some(child => isActive(child.href))
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-gray-200 bg-white">
          <h1 className="text-xl font-bold text-gray-900">Billtracky</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 bg-[#FAFAFA]">
          {navigation.map((item) => {
            const Icon = item.icon
            const isExpanded = expandedItems.includes(item.id)
            const itemIsActive = isActive(item.href) || hasActiveChild(item)

            return (
              <div key={item.id}>
                {/* Main navigation item */}
                {item.children ? (
                  <button
                    onClick={() => toggleExpanded(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                      itemIsActive
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-700 hover:bg-white/50"
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <div className="flex-1 text-left min-w-0">
                      <div className="truncate">{item.name}</div>
                      <div className="text-xs text-gray-500 truncate">{item.description}</div>
                    </div>
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isExpanded && "rotate-90"
                      )}
                    />
                  </button>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                      itemIsActive
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-700 hover:bg-white/50"
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="truncate">{item.name}</div>
                      <div className="text-xs text-gray-500 truncate">{item.description}</div>
                    </div>
                  </Link>
                )}

                {/* Child navigation items */}
                {item.children && isExpanded && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon
                      const childIsActive = isActive(child.href)

                      return (
                        <Link
                          key={child.href}
                          to={child.href}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                            childIsActive
                              ? "bg-white text-gray-900 font-medium shadow-sm"
                              : "text-gray-600 hover:bg-white/50 hover:text-gray-900"
                          )}
                        >
                          <ChildIcon className="h-4 w-4" />
                          <span>{child.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
              <span className="text-sm font-semibold">U</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Usuario</p>
              <p className="text-xs text-gray-500 truncate">admin@billtracky.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
