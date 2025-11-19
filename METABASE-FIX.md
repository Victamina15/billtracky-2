# Solución al Problema de Metabase

## 🔍 Problema Identificado

Metabase está fallando con errores de permisos al intentar crear directorios para su base de datos H2:

```
UnixException: Operation not permitted
FilePathDisk.createDirectory
Metabase Shutdown COMPLETE
```

**Estado actual:**
- Metabase se está apagando constantemente
- No puede crear/acceder a `/metabase-data/metabase.db`
- El servicio está reiniciándose en loop

## ✅ Solución: Usar PostgreSQL en lugar de H2

### Opción 1: Configurar desde EasyPanel (Recomendado)

1. **Accede a EasyPanel**
   - Ve a tu proyecto `app-pos-2`
   - Encuentra el servicio `metabase`

2. **Edita las Variables de Entorno**

   **Elimina:**
   ```
   MB_DB_FILE=/metabase-data/metabase.db
   ```

   **Agrega:**
   ```
   MB_DB_TYPE=postgres
   MB_DB_DBNAME=metabase
   MB_DB_PORT=5432
   MB_DB_USER=postgres
   MB_DB_PASS=1976
   MB_DB_HOST=app-pos-2_postgres-db
   ```

3. **Guarda y Despliega**
   - Click en "Save" o "Update"
   - EasyPanel reiniciará el servicio automáticamente
   - Metabase se conectará a PostgreSQL y creará su esquema

4. **Configura el Dominio (para acceso web)**
   - En EasyPanel, ve a la sección "Domains" del servicio Metabase
   - Agrega un dominio o subdominio (ej: `metabase.tudominio.com`)
   - O usa el dominio proporcionado por EasyPanel
   - Guarda y espera unos segundos

5. **Accede a Metabase**
   - Abre el dominio configurado en tu navegador
   - Primera vez: Configuración inicial de Metabase
   - Usuario admin: Define tu usuario y contraseña

### Opción 2: Acceso Interno (Si no necesitas acceso web público)

Si solo necesitas que Metabase funcione internamente para análisis:

1. **Configura PostgreSQL como arriba** (Opción 1, pasos 1-3)
2. **No configures dominio público**
3. **Accede vía Port Forward:**
   ```bash
   # Desde tu máquina local
   ssh -L 3000:localhost:3000 root@82.197.65.255
   ```

   Luego abre en tu navegador: `http://localhost:3000`

## 📋 Variables de Entorno Completas para Metabase

```env
# Configuración General
PORT=80
MB_SITE_NAME=Billtracky
MB_APPLICATION_NAME=Billtracky

# PostgreSQL Database (NUEVO)
MB_DB_TYPE=postgres
MB_DB_DBNAME=metabase
MB_DB_PORT=5432
MB_DB_USER=postgres
MB_DB_PASS=1976
MB_DB_HOST=app-pos-2_postgres-db

# Opcional: Configuración adicional
MB_EMOJI_IN_LOGS=false
```

## ✨ Ventajas de Usar PostgreSQL

1. **✅ Más Robusto**: PostgreSQL es más estable que H2
2. **✅ Sin Problemas de Permisos**: No necesita escribir en volúmenes locales
3. **✅ Mejor Rendimiento**: Optimizado para producción
4. **✅ Backups Fáciles**: Se incluye en el backup de PostgreSQL
5. **✅ Escalable**: Soporta múltiples réplicas de Metabase

## 🔧 Verificación Post-Configuración

Después de aplicar los cambios, verifica que Metabase esté funcionando:

```bash
# Conectarse al servidor
ssh root@82.197.65.255

# Ver logs de Metabase
docker service logs app-pos-2_metabase --tail 50

# Deberías ver:
# "Metabase Initialization COMPLETE"
# "Metabase app database migrations completed successfully"
```

## 🌐 Configuración de Dominio en EasyPanel

Una vez que Metabase esté funcionando:

1. **Opción A: Subdominio propio**
   - Si tienes dominio: `metabase.tudominio.com`
   - Agrega registro DNS tipo A apuntando a `82.197.65.255`
   - En EasyPanel, agrega el dominio al servicio

2. **Opción B: Dominio de EasyPanel**
   - EasyPanel te proporcionará un dominio automático
   - Ejemplo: `app-pos-2-metabase.easypanel.host`

## 📊 Configuración Inicial de Metabase

Al acceder por primera vez:

1. **Información de la Organización**
   - Nombre: Billtracky
   - Idioma: Español

2. **Cuenta de Administrador**
   - Email: tu-email@ejemplo.com
   - Nombre: Tu nombre
   - Contraseña: (elige una segura)

3. **Conectar Base de Datos (opcional)**
   - Para analizar datos de Billtracky:
   - Tipo: PostgreSQL
   - Host: `app-pos-2_postgres-db`
   - Puerto: `5432`
   - Database: `app-pos-2`
   - Usuario: `postgres`
   - Contraseña: `1976`

## 🚨 Si Algo Sale Mal

### Metabase no inicia después de los cambios

```bash
# Ver los logs completos
docker service logs app-pos-2_metabase --follow

# Reiniciar el servicio manualmente
docker service update --force app-pos-2_metabase
```

### Error de conexión a PostgreSQL

Verifica que PostgreSQL esté corriendo:
```bash
docker ps | grep postgres-db
docker service logs app-pos-2_postgres-db --tail 50
```

### No puedo acceder vía web

1. Verifica que el dominio esté configurado en EasyPanel
2. Verifica que Metabase esté corriendo: `docker ps | grep metabase`
3. Verifica los logs: `docker service logs app-pos-2_metabase`

---

**Siguiente paso:** Una vez que Metabase funcione, continuaremos con la integración de PostgreSQL para los módulos CONFIGURACIÓN y FACTURACIÓN.
