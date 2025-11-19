-- Billtracky 2.0 - PostgreSQL Schema
-- Sistema POS para Lavanderías

-- =====================================================
-- MÓDULO: CONFIGURACIÓN
-- =====================================================

-- Tabla: Categorías de Servicios
CREATE TABLE IF NOT EXISTS categorias (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    color VARCHAR(7) NOT NULL CHECK (color ~ '^#[0-9A-F]{6}$'),
    descripcion VARCHAR(200),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Servicios
CREATE TABLE IF NOT EXISTS servicios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria_id VARCHAR(50) NOT NULL REFERENCES categorias(id) ON DELETE RESTRICT,
    precio DECIMAL(10, 2) NOT NULL CHECK (precio > 0),
    unidad VARCHAR(20) NOT NULL CHECK (unidad IN ('kg', 'unidad', 'metro', 'servicio')),
    descripcion VARCHAR(300),
    tiempo_estimado INTEGER CHECK (tiempo_estimado > 0), -- en minutos
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Métodos de Pago
CREATE TABLE IF NOT EXISTS metodos_pago (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('efectivo', 'tarjeta', 'transferencia', 'credito', 'otro')),
    requiere_referencia BOOLEAN DEFAULT false,
    icono VARCHAR(50) NOT NULL,
    comision DECIMAL(5, 2) DEFAULT 0 CHECK (comision >= 0 AND comision <= 100),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- MÓDULO: FACTURACIÓN
-- =====================================================

-- Tabla: Clientes
CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT,
    notas TEXT,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Facturas
CREATE TABLE IF NOT EXISTS facturas (
    id SERIAL PRIMARY KEY,
    numero_factura VARCHAR(20) UNIQUE NOT NULL,
    cliente_id INTEGER REFERENCES clientes(id) ON DELETE SET NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_entrega TIMESTAMP NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    itbis DECIMAL(10, 2) NOT NULL CHECK (itbis >= 0),
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
    metodo_pago_id VARCHAR(50) REFERENCES metodos_pago(id) ON DELETE SET NULL,
    referencia_pago VARCHAR(100),
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'pagada', 'cancelada')),
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Líneas de Factura (Items)
CREATE TABLE IF NOT EXISTS facturas_items (
    id SERIAL PRIMARY KEY,
    factura_id INTEGER NOT NULL REFERENCES facturas(id) ON DELETE CASCADE,
    servicio_id INTEGER REFERENCES servicios(id) ON DELETE SET NULL,
    nombre_servicio VARCHAR(100) NOT NULL, -- Guardamos el nombre por si el servicio se elimina
    precio_unitario DECIMAL(10, 2) NOT NULL CHECK (precio_unitario > 0),
    cantidad DECIMAL(10, 2) NOT NULL CHECK (cantidad > 0),
    unidad VARCHAR(20) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ÍNDICES para Optimización
-- =====================================================

-- Índices en Servicios
CREATE INDEX IF NOT EXISTS idx_servicios_categoria ON servicios(categoria_id);
CREATE INDEX IF NOT EXISTS idx_servicios_activo ON servicios(activo);
CREATE INDEX IF NOT EXISTS idx_servicios_nombre ON servicios(nombre);

-- Índices en Facturas
CREATE INDEX IF NOT EXISTS idx_facturas_cliente ON facturas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_facturas_fecha_creacion ON facturas(fecha_creacion);
CREATE INDEX IF NOT EXISTS idx_facturas_estado ON facturas(estado);
CREATE INDEX IF NOT EXISTS idx_facturas_numero ON facturas(numero_factura);

-- Índices en Items de Factura
CREATE INDEX IF NOT EXISTS idx_facturas_items_factura ON facturas_items(factura_id);
CREATE INDEX IF NOT EXISTS idx_facturas_items_servicio ON facturas_items(servicio_id);

-- Índices en Clientes
CREATE INDEX IF NOT EXISTS idx_clientes_nombre ON clientes(nombre);
CREATE INDEX IF NOT EXISTS idx_clientes_telefono ON clientes(telefono);

-- =====================================================
-- TRIGGERS para updated_at automático
-- =====================================================

-- Función para actualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
CREATE TRIGGER update_categorias_updated_at BEFORE UPDATE ON categorias
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_servicios_updated_at BEFORE UPDATE ON servicios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_metodos_pago_updated_at BEFORE UPDATE ON metodos_pago
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_facturas_updated_at BEFORE UPDATE ON facturas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DATOS INICIALES (Seeds)
-- =====================================================

-- Insertar Categorías por defecto
INSERT INTO categorias (id, nombre, color, descripcion, activo) VALUES
    ('lavado', 'Lavado', '#3B82F6', 'Servicios de lavado', true),
    ('planchado', 'Planchado', '#10B981', 'Servicios de planchado', true),
    ('tintoreria', 'Tintorería', '#8B5CF6', 'Limpieza en seco', true),
    ('especiales', 'Especiales', '#F59E0B', 'Servicios especiales', true),
    ('express', 'Express', '#EF4444', 'Servicios urgentes', true),
    ('reparacion', 'Reparación', '#6366F1', 'Arreglos y reparaciones', true)
ON CONFLICT (id) DO NOTHING;

-- Insertar Servicios por defecto
INSERT INTO servicios (nombre, categoria_id, precio, unidad, descripcion, tiempo_estimado, activo) VALUES
    ('Lavado Normal', 'lavado', 150.00, 'kg', 'Lavado estándar de ropa', 120, true),
    ('Lavado Express', 'lavado', 200.00, 'kg', 'Lavado rápido en 24h', 60, true),
    ('Planchado', 'planchado', 80.00, 'unidad', 'Planchado de prendas', 30, true),
    ('Tintorería', 'tintoreria', 250.00, 'unidad', 'Limpieza en seco', 180, true),
    ('Edredón Queen', 'especiales', 400.00, 'unidad', 'Lavado de edredón tamaño Queen', 240, true)
ON CONFLICT DO NOTHING;

-- Insertar Métodos de Pago por defecto
INSERT INTO metodos_pago (id, nombre, tipo, requiere_referencia, icono, comision, activo) VALUES
    ('efectivo', 'Efectivo', 'efectivo', false, 'Banknote', 0, true),
    ('tarjeta', 'Tarjeta', 'tarjeta', true, 'CreditCard', 2.5, true),
    ('transferencia', 'Transferencia', 'transferencia', true, 'ArrowRightLeft', 0, true),
    ('credito', 'Crédito', 'credito', false, 'Clock', 0, true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista: Servicios con Nombre de Categoría
CREATE OR REPLACE VIEW servicios_completos AS
SELECT
    s.id,
    s.nombre,
    s.categoria_id,
    c.nombre AS categoria_nombre,
    c.color AS categoria_color,
    s.precio,
    s.unidad,
    s.descripcion,
    s.tiempo_estimado,
    s.activo,
    s.created_at,
    s.updated_at
FROM servicios s
LEFT JOIN categorias c ON s.categoria_id = c.id;

-- Vista: Facturas con Detalles
CREATE OR REPLACE VIEW facturas_completas AS
SELECT
    f.id,
    f.numero_factura,
    f.cliente_id,
    c.nombre AS cliente_nombre,
    c.telefono AS cliente_telefono,
    f.fecha_creacion,
    f.fecha_entrega,
    f.subtotal,
    f.itbis,
    f.total,
    f.metodo_pago_id,
    mp.nombre AS metodo_pago_nombre,
    f.referencia_pago,
    f.estado,
    f.notas,
    f.created_at,
    f.updated_at
FROM facturas f
LEFT JOIN clientes c ON f.cliente_id = c.id
LEFT JOIN metodos_pago mp ON f.metodo_pago_id = mp.id;

-- =====================================================
-- COMENTARIOS DE DOCUMENTACIÓN
-- =====================================================

COMMENT ON TABLE categorias IS 'Categorías de servicios de lavandería';
COMMENT ON TABLE servicios IS 'Catálogo de servicios ofrecidos';
COMMENT ON TABLE metodos_pago IS 'Métodos de pago aceptados';
COMMENT ON TABLE clientes IS 'Base de datos de clientes';
COMMENT ON TABLE facturas IS 'Facturas generadas';
COMMENT ON TABLE facturas_items IS 'Líneas/items de cada factura';

COMMENT ON COLUMN servicios.tiempo_estimado IS 'Tiempo estimado del servicio en minutos';
COMMENT ON COLUMN metodos_pago.comision IS 'Porcentaje de comisión (0-100)';
COMMENT ON COLUMN facturas.numero_factura IS 'Número único de factura (formato: F-YYYYMMDD-NNNN)';
