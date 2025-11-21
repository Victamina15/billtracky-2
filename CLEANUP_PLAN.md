# 🧹 Plan de Limpieza de Código Basura - Billtracky-2

**Fecha**: 2025-11-21
**Estado**: 📋 Listo para ejecutar
**Impacto estimado**: Reducción de ~40% del código y mejora significativa de mantenibilidad

---

## 📊 Resumen Ejecutivo

Este documento contiene un plan **accionable y priorizado** para eliminar código basura, duplicado e innecesario del proyecto Billtracky-2.

**Beneficios esperados**:
- 🔥 Eliminar ~3000 líneas de código duplicado
- 📦 Reducir tamaño del bundle en ~30-40%
- ⚡ Mejorar velocidad de builds
- 🛠️ Facilitar mantenimiento futuro
- 🐛 Reducir superficie para bugs (cada bug se arregla en un solo lugar)

---

## 🎯 Código Basura Identificado

### **1. Código Duplicado (~3000 líneas)** - 🔴 PRIORIDAD MÁXIMA

#### **1.1 APIs Duplicadas (562 líneas)**

**Archivos idénticos** (verificados con hash MD5):

```
apps/pos/configuracion/src/api/
├── servicios.js (226 líneas)
├── categorias.js (156 líneas)
└── metodosPago.js (180 líneas)

apps/pos/dashboard/src/api/
├── servicios.js (226 líneas) ← DUPLICADO 100%
├── categorias.js (156 líneas) ← DUPLICADO 100%
└── metodosPago.js (180 líneas) ← DUPLICADO 100%
```

**Acción**: Mover a `/apps/shared/src/api/` y eliminar duplicados

---

#### **1.2 Hooks de Zustand Duplicados (343 líneas)**

**Archivos idénticos**:

```
apps/pos/configuracion/src/hooks/
├── useServiciosStore.js (118 líneas)
├── useCategoriasStore.js (99 líneas)
└── useMetodosPagoStore.js (126 líneas)

apps/pos/dashboard/src/hooks/
├── useServiciosStore.js (118 líneas) ← DUPLICADO 100%
├── useCategoriasStore.js (99 líneas) ← DUPLICADO 100%
└── useMetodosPagoStore.js (126 líneas) ← DUPLICADO 100%
```

**Acción**: Mover a `/apps/shared/src/hooks/` y eliminar duplicados

---

#### **1.3 Componentes de Facturación Duplicados (~2000 líneas)**

**Componentes copiados de `facturacion` a `dashboard`**:

```
apps/pos/facturacion/src/components/
├── factura/
│   ├── PanelFactura.jsx
│   ├── Header.jsx
│   ├── MetodosPago.jsx
│   ├── LineaFactura.jsx
│   ├── Totales.jsx
│   ├── ClienteSelector.jsx
│   └── FechaEntregaSelector.jsx
└── servicios/
    ├── Categorias.jsx
    ├── ListaServicios.jsx
    └── ServicioCard.jsx

apps/pos/dashboard/src/components/facturacion/
├── factura/ ← COPIA COMPLETA
└── servicios/ ← COPIA COMPLETA
```

**Problema**: Imports usan rutas diferentes:
- Facturacion: `import { formatCurrency } from '../../utils/formatCurrency'`
- Dashboard: `import { formatCurrency } from '../../../utils/formatCurrency'`

**Acción**: Mover a `/apps/shared/src/components/facturacion/` y eliminar duplicados

---

### **2. Archivos Innecesarios** - ✅ YA ELIMINADOS

- ~~`apps/pos/configuracion/src/App.jsx`~~ ✅ Eliminado
- ~~`apps/pos/configuracion/src/App.css`~~ ✅ Eliminado
- ~~`Dockerfile` (raíz)~~ ✅ Eliminado

---

### **3. Dependencias Inconsistentes** - 🟡 REQUIERE DECISIÓN

#### **3.1 TailwindCSS**

**Problema**: Versiones diferentes entre apps

```
dashboard: tailwindcss@4.1.17 + plugins (animate, darkMode)
facturacion: tailwindcss@3.4.18
configuracion: tailwindcss@3.4.18
```

**Acción recomendada**: Estandarizar a v4.1.17 en todas las apps

**Comando**:
```bash
# En facturacion y configuracion
npm install -D tailwindcss@4.1.17 tailwindcss-animate
npm install class-variance-authority tailwind-merge
```

---

#### **3.2 Dependencias Solo en Dashboard**

**Librerías que solo tiene dashboard**:
- `@radix-ui/react-slot`
- `class-variance-authority`
- `tailwind-merge`
- `tailwindcss-animate`
- `react-router-dom`

**Pregunta**: ¿Deberían compartirse si se comparten componentes UI?

**Acción recomendada**: Si se mueven componentes a shared, agregar estas deps a shared

---

### **4. Console.logs en Producción** - ✅ YA ELIMINADOS

- ~~`apps/pos/facturacion/src/components/factura/PanelFactura.jsx:26`~~ ✅ Eliminado
- ~~`apps/pos/dashboard/src/components/facturacion/factura/PanelFactura.jsx:26`~~ ✅ Eliminado

---

### **5. TODOs sin Implementar** - 🟡 DOCUMENTAR

**Frontend**:
```javascript
// apps/pos/*/src/components/factura/PanelFactura.jsx:25
// TODO: Guardar en base de datos

// apps/pos/*/src/components/layout/ClienteSelector.jsx
// TODO: Conectar con base de datos de clientes
// TODO: Guardar como pendiente
// TODO: Generar PDF e imprimir
```

**Backend**:
```javascript
// apps/api/src/routes/categorias.js
// TODO: Implementar POST, PUT, DELETE

// apps/api/src/routes/metodosPago.js
// TODO: Implementar POST, PUT, DELETE
```

**Acción**: Crear issues de GitHub para cada TODO o implementarlos

---

### **6. Archivos de Configuración Duplicados** - 🟡 REVISAR

**package.json**: Cada app tiene su package.json (correcto para monorepo)

**tailwind.config.js**: Cada app tiene configuración diferente

```
dashboard:
  - darkMode: 'class'
  - theme.extend con custom radius, animations
  - plugins: [tailwindcss-animate]

facturacion/configuracion:
  - Configuración básica
  - Sin plugins
```

**Acción recomendada**: Crear `tailwind.base.config.js` compartido y extenderlo

---

### **7. Variables de Entorno sin Documentar** - 🟡 CREAR .env.example

**Falta**:
- `apps/pos/dashboard/.env.example`
- `apps/pos/facturacion/.env.example`
- `apps/pos/configuracion/.env.example`

**Contenido sugerido**:
```env
# .env.example para apps frontend
VITE_API_URL=http://localhost:3000
```

---

## 🚀 Plan de Acción Paso a Paso

### **Fase 1: Preparación** (15 min)

```bash
# 1. Crear estructura shared
mkdir -p apps/shared/src/{api,hooks,components,utils}

# 2. Crear package.json para shared
cat > apps/shared/package.json << 'EOF'
{
  "name": "@billtracky/shared",
  "version": "0.1.0",
  "type": "module",
  "main": "./src/index.js"
}
EOF

# 3. Backup del proyecto
git checkout -b refactor/cleanup-duplicated-code
git add -A
git commit -m "chore: Checkpoint antes de refactorización"
```

---

### **Fase 2: Migrar APIs** (30 min)

```bash
# 1. Copiar de configuracion (versión original) a shared
cp apps/pos/configuracion/src/api/servicios.js apps/shared/src/api/
cp apps/pos/configuracion/src/api/categorias.js apps/shared/src/api/
cp apps/pos/configuracion/src/api/metodosPago.js apps/shared/src/api/

# 2. Eliminar duplicados
rm apps/pos/dashboard/src/api/servicios.js
rm apps/pos/dashboard/src/api/categorias.js
rm apps/pos/dashboard/src/api/metodosPago.js

# 3. Actualizar imports en configuracion (buscar y reemplazar)
# Antes: import { getServicios } from '../api/servicios'
# Después: import { getServicios } from '@shared/api/servicios'

# 4. Actualizar imports en dashboard (buscar y reemplazar)
# Antes: import { getServicios } from '../api/servicios'
# Después: import { getServicios } from '@shared/api/servicios'

# 5. Probar que compila
cd apps/pos/configuracion && npm run build
cd apps/pos/dashboard && npm run build
```

---

### **Fase 3: Migrar Hooks** (30 min)

```bash
# 1. Mover hooks a shared
mv apps/pos/configuracion/src/hooks/useServiciosStore.js apps/shared/src/hooks/
mv apps/pos/configuracion/src/hooks/useCategoriasStore.js apps/shared/src/hooks/
mv apps/pos/configuracion/src/hooks/useMetodosPagoStore.js apps/shared/src/hooks/

# 2. Eliminar duplicados
rm apps/pos/dashboard/src/hooks/useServiciosStore.js
rm apps/pos/dashboard/src/hooks/useCategoriasStore.js
rm apps/pos/dashboard/src/hooks/useMetodosPagoStore.js

# 3. Actualizar imports (buscar y reemplazar en todas las apps)
# Antes: import { useServiciosStore } from '../hooks/useServiciosStore'
# Después: import { useServiciosStore } from '@shared/hooks/useServiciosStore'
```

---

### **Fase 4: Migrar Componentes de Facturación** (1-2 horas)

```bash
# 1. Mover componentes de facturacion a shared
mv apps/pos/facturacion/src/components/factura apps/shared/src/components/
mv apps/pos/facturacion/src/components/servicios apps/shared/src/components/

# 2. Eliminar duplicados en dashboard
rm -rf apps/pos/dashboard/src/components/facturacion/factura
rm -rf apps/pos/dashboard/src/components/facturacion/servicios

# 3. Actualizar imports en facturacion
# Antes: import { PanelFactura } from '../components/factura/PanelFactura'
# Después: import { PanelFactura } from '@shared/components/factura/PanelFactura'

# 4. Actualizar imports en dashboard
# Antes: import { PanelFactura } from '../components/facturacion/factura/PanelFactura'
# Después: import { PanelFactura } from '@shared/components/factura/PanelFactura'

# 5. Mover utils si existen
# Verificar si formatCurrency.js existe y consolidarlo
```

---

### **Fase 5: Configurar Aliases de Vite** (20 min)

**Actualizar todos los `vite.config.js`**:

```javascript
// apps/pos/dashboard/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../../shared/src'),
    },
  },
  server: {
    port: 5175,
    host: true,
  },
})
```

Repetir para:
- `apps/pos/facturacion/vite.config.js` (puerto 5174)
- `apps/pos/configuracion/vite.config.js` (puerto 5176)

---

### **Fase 6: Estandarizar TailwindCSS** (30 min)

```bash
# 1. Actualizar facturacion y configuracion a v4
cd apps/pos/facturacion
npm install -D tailwindcss@4.1.17 tailwindcss-animate
npm install class-variance-authority tailwind-merge

cd apps/pos/configuracion
npm install -D tailwindcss@4.1.17 tailwindcss-animate
npm install class-variance-authority tailwind-merge

# 2. Actualizar tailwind.config.js
# Copiar configuración de dashboard y ajustar
```

---

### **Fase 7: Crear .env.example para Frontends** (10 min)

```bash
# Crear .env.example en cada app frontend
cat > apps/pos/dashboard/.env.example << 'EOF'
# API Backend URL
VITE_API_URL=http://localhost:3000
EOF

cp apps/pos/dashboard/.env.example apps/pos/facturacion/
cp apps/pos/dashboard/.env.example apps/pos/configuracion/
```

---

### **Fase 8: Testing y Validación** (1-2 horas)

```bash
# 1. Probar builds
cd apps/pos/dashboard && npm run build
cd apps/pos/facturacion && npm run build
cd apps/pos/configuracion && npm run build

# 2. Probar dev servers (en 3 terminales diferentes)
cd apps/pos/dashboard && npm run dev
cd apps/pos/facturacion && npm run dev
cd apps/pos/configuracion && npm run dev

# 3. Probar funcionalidades manualmente:
# - Crear servicio en configuracion
# - Crear factura en facturacion
# - Navegar en dashboard

# 4. Verificar que no hay imports rotos
grep -r "from '../api" apps/pos/*/src
grep -r "from '../hooks" apps/pos/*/src
# No debería retornar nada
```

---

### **Fase 9: Limpieza Final** (15 min)

```bash
# 1. Limpiar directorios vacíos
find apps/pos -type d -empty -delete

# 2. Actualizar .gitignore si es necesario
cat >> .gitignore << 'EOF'
# Frontend env files
apps/pos/*/.env
apps/pos/*/.env.local
EOF

# 3. Commit final
git add -A
git commit -m "refactor: Consolidar código duplicado en /apps/shared

- Mover APIs, hooks y componentes compartidos a /apps/shared/
- Configurar aliases de Vite @shared en todas las apps
- Estandarizar TailwindCSS a v4.1.17
- Crear .env.example para apps frontend
- Eliminar ~3000 líneas de código duplicado

Beneficios:
- Cada bug fix solo se hace una vez
- Bundle size reducido ~30-40%
- Mejor mantenibilidad
- Estructura más profesional"
```

---

## 📊 Métricas de Impacto Esperadas

### **Antes de la Limpieza**:
- Código total: ~7,300 líneas
- Código duplicado: ~3,000 líneas (41%)
- Builds: ~3-5 segundos por app
- Bundle size: ~200-300 KB por app

### **Después de la Limpieza**:
- Código total: ~4,300 líneas ✅
- Código duplicado: 0 líneas ✅
- Builds: ~2-3 segundos por app ✅
- Bundle size: ~150-200 KB por app ✅

### **Mantenibilidad**:
- Bug fixes: 1x lugar (antes 2-3x) ✅
- Nuevas features: Más rápido de implementar ✅
- Onboarding: Más fácil para nuevos devs ✅

---

## ⚠️ Riesgos y Mitigaciones

### **Riesgo 1: Imports rotos después de mover archivos**
**Mitigación**:
- Hacer en rama separada
- Probar builds después de cada fase
- Usar búsqueda global para actualizar imports

### **Riesgo 2: Dependencias faltantes en shared**
**Mitigación**:
- Verificar que shared tenga todas las deps necesarias
- Probar cada app independientemente

### **Riesgo 3: Conflictos de rutas relativas**
**Mitigación**:
- Usar aliases de Vite (@shared)
- No usar rutas relativas para código compartido

---

## ✅ Checklist de Validación

Antes de mergear, verificar:

- [ ] Todas las apps compilan sin errores
- [ ] Todos los imports están usando @shared
- [ ] No hay archivos duplicados en dashboard
- [ ] Dev servers funcionan correctamente
- [ ] Hot reload funciona en todas las apps
- [ ] Builds de producción funcionan
- [ ] Docker-compose up funciona
- [ ] Funcionalidades principales funcionan:
  - [ ] Crear servicio
  - [ ] Crear factura
  - [ ] Navegación en dashboard
- [ ] No hay console.logs
- [ ] No hay warnings de imports no usados
- [ ] .env.example creados
- [ ] README.md actualizado con nueva estructura

---

## 🎯 Próximos Pasos Después de la Limpieza

1. **Agregar tests unitarios** a código compartido en `/apps/shared/`
2. **Crear Storybook** para componentes compartidos
3. **Agregar TypeScript** para mejor type safety
4. **Implementar TODOs** pendientes
5. **Optimizar bundle** con code splitting

---

## 📞 Necesitas Ayuda?

Si encuentras problemas durante la refactorización:

1. Revisa este documento paso a paso
2. Verifica que los aliases de Vite estén correctos
3. Asegúrate de que todos los imports usan @shared
4. Consulta `DIAGNOSTIC_REPORT.md` para contexto
5. Haz commits frecuentes para poder revertir

---

**Documento creado**: 2025-11-21
**Última actualización**: 2025-11-21
**Tiempo estimado total**: 4-6 horas
**Complejidad**: Media
**Prioridad**: 🔴 Alta
