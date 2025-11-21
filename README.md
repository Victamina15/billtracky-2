# 💼 Billtracky-2 - Sistema POS de Facturación

Sistema de punto de venta (POS) modular para gestión de facturación de servicios, construido con arquitectura monorepo.

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Arquitectura](#-arquitectura)
- [Tecnologías](#-tecnologías)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Desarrollo](#-desarrollo)
- [Documentación](#-documentación)
- [Estado del Proyecto](#-estado-del-proyecto)

---

## 🎯 Descripción

Billtracky-2 es un sistema POS completo que permite:

- ✅ Gestionar catálogo de servicios, categorías y métodos de pago
- ✅ Crear y gestionar facturas con múltiples líneas de servicio
- ✅ Calcular totales automáticamente
- ✅ Seleccionar clientes y fechas de entrega
- 🔧 Generar PDFs de facturas (próximamente)
- 🔧 Gestionar inventario (próximamente)

---

## 🏗️ Arquitectura

Monorepo con múltiples aplicaciones frontend y un backend centralizado:

```
billtracky-2/
├── apps/
│   ├── api/              # 🔹 Backend Node.js + Express + PostgreSQL
│   └── pos/              # 🔹 Aplicaciones Frontend React
│       ├── configuracion/  # App de configuración de catálogo
│       ├── facturacion/    # App de creación de facturas
│       └── dashboard/      # App principal con navegación
├── docker-compose.yml
├── ARCHITECTURE.md
├── DIAGNOSTIC_REPORT.md
└── REFACTORING_NEEDED.md
```

### Aplicaciones

| Aplicación | Puerto | Descripción |
|-----------|--------|-------------|
| **Dashboard** | 5175 | App principal con sidebar y navegación integrada |
| **Facturación** | 5174 | Módulo standalone para crear facturas |
| **Configuración** | 5176 | Gestión de servicios, categorías y métodos de pago |
| **API** | 3000 | Backend REST API con PostgreSQL |

---

## 🛠️ Tecnologías

### Frontend
- **React** 19.2.0 - Librería UI
- **Vite** - Build tool y dev server
- **TailwindCSS** 3.4.18 / 4.1.17 - Estilos utility-first
- **Zustand** 5.0.8 - Estado global ligero
- **React Query** 5.90.10 - Gestión de datos del servidor
- **Zod** 4.1.12 - Validación de esquemas
- **Sonner** 2.0.7 - Notificaciones toast
- **Radix UI** - Componentes accesibles (solo Dashboard)

### Backend
- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **PostgreSQL** - Base de datos relacional
- **CORS** - Habilitado para desarrollo

---

## 📦 Requisitos

- **Node.js** >= 18.x
- **npm** >= 9.x
- **PostgreSQL** >= 14.x (si no usas Docker)
- **Docker** y **Docker Compose** (opcional, recomendado)

---

## 🚀 Instalación

### Opción 1: Con Docker (Recomendado)

```bash
# Clonar el repositorio
git clone https://github.com/Victamina15/billtracky-2.git
cd billtracky-2

# Iniciar todos los servicios
docker-compose up
```

### Opción 2: Sin Docker (Manual)

```bash
# 1. Backend
cd apps/api
npm install
cp .env.example .env  # Configurar variables de entorno
npm run dev

# 2. Frontend - Dashboard (en nueva terminal)
cd apps/pos/dashboard
npm install
npm run dev

# 3. Frontend - Facturación (en nueva terminal)
cd apps/pos/facturacion
npm install
npm run dev

# 4. Frontend - Configuración (en nueva terminal)
cd apps/pos/configuracion
npm install
npm run dev
```

---

## 💻 Uso

Una vez iniciado el proyecto, accede a:

- 🎛️ **Dashboard**: http://localhost:5175
- 📄 **Facturación**: http://localhost:5174
- ⚙️ **Configuración**: http://localhost:5176
- 🔌 **API**: http://localhost:3000

### Flujo de trabajo recomendado:

1. **Configuración**: Crear servicios, categorías y métodos de pago
2. **Facturación**: Crear nuevas facturas seleccionando servicios
3. **Dashboard**: Navegación entre módulos desde app principal

---

## 📁 Estructura del Proyecto

```
billtracky-2/
├── apps/
│   ├── api/                          # Backend
│   │   ├── src/
│   │   │   ├── routes/              # Endpoints REST
│   │   │   ├── db/                  # Conexión y schema de BD
│   │   │   └── server.js            # Entry point
│   │   ├── .env.example
│   │   └── package.json
│   │
│   └── pos/                          # Frontend Apps
│       ├── configuracion/            # App de configuración
│       │   ├── src/
│       │   │   ├── api/             # Clientes API (servicios, categorias, metodosPago)
│       │   │   ├── hooks/           # Zustand stores
│       │   │   ├── components/      # Componentes React
│       │   │   └── pages/           # Páginas principales
│       │   ├── vite.config.js       # Puerto 5176
│       │   └── package.json
│       │
│       ├── facturacion/              # App de facturación
│       │   ├── src/
│       │   │   ├── api/             # ⚠️ DUPLICADO (ver REFACTORING_NEEDED.md)
│       │   │   ├── hooks/           # ⚠️ DUPLICADO
│       │   │   ├── components/
│       │   │   │   ├── factura/     # PanelFactura, Header, MetodosPago, etc.
│       │   │   │   └── servicios/   # Categorias, ListaServicios, ServicioCard
│       │   │   └── pages/           # NuevaFacturaPage
│       │   ├── vite.config.js       # Puerto 5174
│       │   └── package.json
│       │
│       └── dashboard/                # App principal
│           ├── src/
│           │   ├── api/             # ⚠️ DUPLICADO
│           │   ├── hooks/           # ⚠️ DUPLICADO
│           │   ├── components/
│           │   │   ├── facturacion/ # ⚠️ DUPLICADO (copia de facturacion/)
│           │   │   ├── sidebar/     # Navegación
│           │   │   └── ui/          # Componentes Shadcn
│           │   └── pages/
│           ├── vite.config.js       # Puerto 5175
│           └── package.json
│
├── docker-compose.yml                # Orquestación de servicios
├── ARCHITECTURE.md                   # Documentación de arquitectura
├── DIAGNOSTIC_REPORT.md              # Análisis completo del proyecto
├── REFACTORING_NEEDED.md             # Plan de refactorización
└── README.md                         # Este archivo
```

---

## 🔧 Desarrollo

### Scripts Disponibles

**Backend** (`apps/api/`):
```bash
npm run dev      # Modo desarrollo con nodemon
npm start        # Modo producción
```

**Frontend** (`apps/pos/{app}/`):
```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción
npm run preview  # Preview del build
npm run lint     # Ejecutar ESLint
```

### Variables de Entorno

**Backend** (`apps/api/.env`):
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=billtracky
DB_USER=postgres
DB_PASSWORD=password
```

**Frontend** (pendiente crear `.env.example`):
```env
VITE_API_URL=http://localhost:3000
```

### Comandos Git

```bash
# Ver estado
git status

# Crear nueva rama
git checkout -b feature/nueva-funcionalidad

# Commit
git add .
git commit -m "feat: descripción del cambio"

# Push
git push -u origin feature/nueva-funcionalidad
```

---

## 📚 Documentación

- **[ARCHITECTURE.md](./ARCHITECTURE.md)**: Decisiones de arquitectura y patrones
- **[DIAGNOSTIC_REPORT.md](./DIAGNOSTIC_REPORT.md)**: Análisis completo del proyecto (300+ líneas)
- **[REFACTORING_NEEDED.md](./REFACTORING_NEEDED.md)**: Plan de refactorización de código duplicado

### Endpoints API

**Servicios**:
- `GET /api/servicios` - Obtener todos los servicios
- `POST /api/servicios` - Crear servicio
- `PUT /api/servicios/:id` - Actualizar servicio
- `DELETE /api/servicios/:id` - Eliminar servicio

**Categorías**:
- `GET /api/categorias` - Obtener categorías
- ⚠️ POST, PUT, DELETE - Pendientes de implementar

**Métodos de Pago**:
- `GET /api/metodosPago` - Obtener métodos de pago
- ⚠️ POST, PUT, DELETE - Pendientes de implementar

---

## ⚠️ Estado del Proyecto

### ✅ Funcionalidades Completadas
- CRUD completo de servicios (backend + frontend)
- Interfaz de facturación con selección de servicios
- Cálculo automático de totales
- Selector de cliente y fecha de entrega
- Selección de método de pago
- Navegación con sidebar en Dashboard

### 🔧 En Desarrollo
- Endpoints POST/PUT/DELETE para categorías y métodos de pago
- Guardado de facturas en base de datos
- Generación de PDFs
- Conexión con base de datos de clientes

### 🔴 Problemas Conocidos
- **~3000 líneas de código duplicado** entre apps (APIs, hooks, componentes)
- Inconsistencias en versiones de TailwindCSS (v3 vs v4)
- Alias de Vite documentados pero no implementados
- Falta `.env.example` en apps frontend

**Ver [DIAGNOSTIC_REPORT.md](./DIAGNOSTIC_REPORT.md) para análisis completo**

---

## 🎯 Próximos Pasos

### Alta Prioridad 🔴
1. Refactorizar código duplicado creando `/apps/shared/`
2. Completar endpoints backend faltantes
3. Estandarizar TailwindCSS a v4 en todas las apps

### Prioridad Media 🟡
4. Crear `.env.example` para frontends
5. Implementar guardado de facturas en BD
6. Agregar validación y error handling

### Mejoras Futuras 🟢
7. Migrar a TypeScript
8. Agregar tests unitarios y E2E
9. Implementar generación de PDFs
10. Dashboard de reportes y analytics

---

## 👥 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es privado y pertenece a Victamina15.

---

## 📞 Contacto

**Repositorio**: [https://github.com/Victamina15/billtracky-2](https://github.com/Victamina15/billtracky-2)

---

## 🙏 Agradecimientos

- Proyecto creado con [Vite](https://vitejs.dev/)
- UI basada en [Radix UI](https://www.radix-ui.com/) y [Shadcn/ui](https://ui.shadcn.com/)
- Estado global con [Zustand](https://zustand-demo.pmnd.rs/)

---

**Última actualización**: 2025-11-21
**Versión**: 0.1.0
**Estado**: 🟡 En desarrollo activo
