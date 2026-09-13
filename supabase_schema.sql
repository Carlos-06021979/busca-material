-- ====================================================================
-- ESQUEMA COMPLETO DE BASE DE DATOS SUPABASE - BUSCA MATERIAL
-- ====================================================================
-- Instrucciones: Copia y ejecuta este script en el SQL Editor de tu panel de Supabase.

-- 1. Tabla de Ubicaciones del Almacén (Naves, Carpas, Altillos, Patio, etc.)
CREATE TABLE IF NOT EXISTS public.locations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'Nave', -- 'Nave', 'Altillo', 'Carpa', 'Patio', 'Zona Especial'
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla Maestra de Materiales
CREATE TABLE IF NOT EXISTS public.materials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(80) DEFAULT 'General',
    description TEXT,
    unit VARCHAR(20) DEFAULT 'Unidades', -- 'Unidades', 'Metros', 'Kg', 'Cajas', etc.
    min_stock NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla de Stock por Ubicación Específica y Lote
CREATE TABLE IF NOT EXISTS public.inventory_stock (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    material_id UUID REFERENCES public.materials(id) ON DELETE CASCADE,
    location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE,
    row_label VARCHAR(30) DEFAULT 'Fila 1',       -- Fila / Pasillo
    position_label VARCHAR(30) DEFAULT 'Pos. A1',  -- Posición / Hueco
    shelf_label VARCHAR(30) DEFAULT '',          -- Estantería (opcional)
    level_label VARCHAR(30) DEFAULT '',          -- Altura / Nivel (opcional)
    batch_number VARCHAR(80) NOT NULL DEFAULT 'SIN LOTE', -- Número de Lote
    mfd_date DATE,                                 -- Fecha de Fabricación
    entry_date DATE DEFAULT CURRENT_DATE,          -- Fecha de Entrada
    exp_date DATE,                                 -- Fecha de Caducidad
    quantity NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_stock_item UNIQUE (material_id, location_id, row_label, position_label, batch_number)
);

-- 4. Tabla Histórica de Movimientos (Trazabilidad y Auditoría por Usuario)
CREATE TABLE IF NOT EXISTS public.stock_movements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    movement_type VARCHAR(20) NOT NULL, -- 'ENTRADA', 'SALIDA', 'TRASLADO', 'AJUSTE'
    material_id UUID REFERENCES public.materials(id) ON DELETE CASCADE,
    material_name VARCHAR(150) NOT NULL,
    source_location_name VARCHAR(100),
    source_coords VARCHAR(100),
    dest_location_name VARCHAR(100),
    dest_coords VARCHAR(100),
    batch_number VARCHAR(80),
    quantity NUMERIC(12, 2) NOT NULL,
    user_name VARCHAR(100) NOT NULL DEFAULT 'Operario Almacén',
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabla de Registro de Errores y Auditoría del Sistema (System Logs)
CREATE TABLE IF NOT EXISTS public.system_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    log_type VARCHAR(30) NOT NULL DEFAULT 'ERROR', -- 'ERROR', 'WARN', 'AUDIT'
    message TEXT NOT NULL,
    details JSONB,
    user_name VARCHAR(100) DEFAULT 'Sistema',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- DATOS INICIALES DE EJEMPLO (SEED DATA)
-- ====================================================================

-- Ubicaciones iniciales
INSERT INTO public.locations (code, name, type, description) VALUES
('NAV-1', 'Nave 1 - Principal', 'Nave', 'Nave principal de almacenamiento pesado'),
('ALT-1', 'Altillo 1 - Componentes', 'Altillo', 'Altillo superior para pañolería y piezas pequeñas'),
('ALT-2', 'Altillo 2 - Repuestos', 'Altillo', 'Altillo de recambios y herramientas'),
('CRP-1', 'Carpa 1 - Exterior', 'Carpa', 'Carpa exterior cubierta para volumen'),
('CRP-2', 'Carpa 2 - Taller', 'Carpa', 'Carpa de material en preparación'),
('PAT-1', 'Patio - Zona Norte', 'Patio', 'Zona exterior acotada para tubería y perfiles')
ON CONFLICT (code) DO NOTHING;

-- Materiales iniciales
INSERT INTO public.materials (sku, name, category, unit, min_stock, description) VALUES
('MAT-001', 'Cable Cobre Unipolar 16mm', 'Electricidad', 'Metros', 100, 'Cable flexible de alta resistencia'),
('MAT-002', 'Perfil de Aluminio 40x40', 'Estructura', 'Metros', 50, 'Perfil ranurado para bastidores'),
('MAT-003', 'Motor Trifásico 5.5kW', 'Maquinaria', 'Unidades', 2, 'Motor industrial 400V 1500 rpm'),
('MAT-004', 'Caja Registro Estanca IP65', 'Electricidad', 'Unidades', 20, 'Caja de derivados sin conos'),
('MAT-005', 'Tornillo Allen M8x30 Inox', 'Tornillería', 'Cajas', 10, 'Cajas de 100 unidades inoxidable A2')
ON CONFLICT (sku) DO NOTHING;

-- Habilitar Row Level Security (RLS) opcional o deshabilitar para lectura/escritura anónima si se desea
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso público (Lectura y Escritura abiertas con clave anon)
CREATE POLICY "Permitir acceso público a ubicaciones" ON public.locations FOR ALL USING (true);
CREATE POLICY "Permitir acceso público a materiales" ON public.materials FOR ALL USING (true);
CREATE POLICY "Permitir acceso público a inventario" ON public.inventory_stock FOR ALL USING (true);
CREATE POLICY "Permitir acceso público a movimientos" ON public.stock_movements FOR ALL USING (true);
CREATE POLICY "Permitir acceso público a logs" ON public.system_logs FOR ALL USING (true);
