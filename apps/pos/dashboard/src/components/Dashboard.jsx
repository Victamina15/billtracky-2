import { Receipt, Settings, Users, Package, BarChart3, CreditCard, ArrowRight, ExternalLink } from 'lucide-react'

const moduleCards = [
  {
    title: 'Facturación',
    description: 'Crea y gestiona facturas de forma rápida y eficiente',
    icon: Receipt,
    color: 'from-blue-500 to-cyan-500',
    url: 'http://localhost:5173',
    features: ['Crear facturas', 'Calcular ITBIS', 'Gestionar carrito'],
    stats: { label: 'Facturas hoy', value: '12' }
  },
  {
    title: 'Configuración',
    description: 'Administra servicios, categorías y métodos de pago',
    icon: Settings,
    color: 'from-purple-500 to-pink-500',
    url: 'http://localhost:5174',
    features: ['Servicios', 'Categorías', 'Métodos de pago'],
    stats: { label: 'Servicios activos', value: '45' }
  },
  {
    title: 'Clientes',
    description: 'Gestiona tu base de clientes y historial',
    icon: Users,
    color: 'from-green-500 to-emerald-500',
    url: '#',
    features: ['Base de datos', 'Historial', 'Reportes'],
    stats: { label: 'Clientes', value: '128' },
    comingSoon: true
  },
  {
    title: 'Inventario',
    description: 'Controla tu inventario y stock de productos',
    icon: Package,
    color: 'from-orange-500 to-red-500',
    url: '#',
    features: ['Stock', 'Alertas', 'Movimientos'],
    stats: { label: 'Productos', value: '89' },
    comingSoon: true
  }
]

export function Dashboard() {
  const handleCardClick = (card) => {
    if (card.comingSoon) {
      alert('Este módulo estará disponible pronto')
      return
    }
    window.open(card.url, '_blank')
  }

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Bienvenido a Billtracky - Sistema de gestión POS
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[
            { label: 'Facturación Hoy', value: '$12,450', icon: Receipt, change: '+12%' },
            { label: 'Facturas', value: '45', icon: BarChart3, change: '+8%' },
            { label: 'Clientes Activos', value: '128', icon: Users, change: '+3%' },
            { label: 'Métodos de Pago', value: '4', icon: CreditCard, change: '0%' }
          ].map((stat, i) => (
            <div key={i} className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <stat.icon className="h-8 w-8 text-gray-400" />
                <span className={`text-sm font-medium ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="mt-4 text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Module Cards */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Módulos del Sistema</h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {moduleCards.map((card, i) => {
              const Icon = card.icon
              return (
                <button
                  key={i}
                  onClick={() => handleCardClick(card)}
                  className={`
                    group relative overflow-hidden rounded-xl border bg-white p-6 text-left
                    transition-all duration-200 hover:shadow-lg
                    ${card.comingSoon ? 'opacity-75' : 'hover:-translate-y-1'}
                  `}
                >
                  {/* Background Gradient */}
                  <div className={`absolute top-0 right-0 h-32 w-32 bg-gradient-to-br ${card.color} opacity-10 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150`} />

                  {/* Coming Soon Badge */}
                  {card.comingSoon && (
                    <div className="absolute top-4 right-4 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                      Próximamente
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`inline-flex rounded-lg bg-gradient-to-br ${card.color} p-3 text-white mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{card.description}</p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {card.features.map((feature, j) => (
                      <span key={j} className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Stats & Action */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{card.stats.value}</p>
                      <p className="text-xs text-gray-500">{card.stats.label}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
                      {card.comingSoon ? 'Próximamente' : 'Abrir módulo'}
                      {!card.comingSoon && <ExternalLink className="h-4 w-4" />}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 rounded-lg border bg-blue-50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white">
                <BarChart3 className="h-6 w-6" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">¿Necesitas ayuda?</h3>
              <p className="mt-1 text-sm text-gray-600">
                Consulta la documentación o contacta al equipo de soporte para obtener ayuda con el sistema.
              </p>
              <div className="mt-4 flex gap-3">
                <button className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors">
                  Ver Documentación
                </button>
                <button className="rounded-lg border border-blue-300 bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors">
                  Soporte
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
