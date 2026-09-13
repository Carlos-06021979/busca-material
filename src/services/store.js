import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Datos Semilla para LocalStorage (cuando no hay Supabase conectado)
const SEED_LOCATIONS = [
  { id: 'loc-1', code: 'NAV-1', name: 'Nave 1 - Principal', type: 'Nave', description: 'Almacenamiento general de estructura y bobinas', is_active: true },
  { id: 'loc-2', code: 'ALT-1', name: 'Altillo 1 - Pañolería', type: 'Altillo', description: 'Altillo superior para material pequeño y repuestos', is_active: true },
  { id: 'loc-3', code: 'ALT-2', name: 'Altillo 2 - Recambios', type: 'Altillo', description: 'Zona de componentes eléctricos y neumática', is_active: true },
  { id: 'loc-4', code: 'CRP-1', name: 'Carpa 1 - Exterior', type: 'Carpa', description: 'Carpa climatizada para volumen alto y pallets', is_active: true },
  { id: 'loc-5', code: 'CRP-2', name: 'Carpa 2 - Taller', type: 'Carpa', description: 'Material listo para premontaje', is_active: true },
  { id: 'loc-6', code: 'PAT-1', name: 'Patio - Zona Norte', type: 'Patio', description: 'Perfilería, tubo de acero y bobinas pesadas', is_active: true }
];

const SEED_MATERIALS = [
  { id: 'mat-1', sku: 'MAT-001', name: 'Cable Cobre Unipolar 16mm', category: 'Electricidad', unit: 'Metros', min_stock: 100, description: 'Cable flexible de alta conductividad' },
  { id: 'mat-2', sku: 'MAT-002', name: 'Perfil de Aluminio 40x40', category: 'Estructura', unit: 'Metros', min_stock: 50, description: 'Perfil estructural anodizado' },
  { id: 'mat-3', sku: 'MAT-003', name: 'Motor Trifásico 5.5kW', category: 'Maquinaria', unit: 'Unidades', min_stock: 2, description: 'Motor industrial 400V 1500 rpm' },
  { id: 'mat-4', sku: 'MAT-004', name: 'Caja Registro Estanca IP65', category: 'Electricidad', unit: 'Unidades', min_stock: 20, description: 'Caja estanca ignífuga' },
  { id: 'mat-5', sku: 'MAT-005', name: 'Tornillo Allen M8x30 Inox', category: 'Tornillería', unit: 'Cajas', min_stock: 10, description: 'Caja de 100u A2 Inoxidable' }
];

const SEED_STOCK = [
  {
    id: 'stk-1',
    material_id: 'mat-1',
    location_id: 'loc-4', // Carpa 1
    row_label: 'Fila 2',
    position_label: 'Posición B4',
    shelf_label: 'Estantería 3',
    level_label: 'Nivel 1',
    batch_number: 'LOTE-2026-08',
    mfd_date: '2026-01-10',
    entry_date: '2026-02-01',
    exp_date: '2030-01-01',
    quantity: 350
  },
  {
    id: 'stk-2',
    material_id: 'mat-1',
    location_id: 'loc-2', // Altillo 1
    row_label: 'Fila 1',
    position_label: 'Posición A2',
    shelf_label: 'Estantería 1',
    level_label: 'Nivel 2',
    batch_number: 'LOTE-2026-09',
    mfd_date: '2026-02-15',
    entry_date: '2026-03-01',
    exp_date: '2030-01-01',
    quantity: 120
  },
  {
    id: 'stk-3',
    material_id: 'mat-2',
    location_id: 'loc-6', // Patio
    row_label: 'Pasillo 4',
    position_label: 'Soporte 12',
    shelf_label: 'Rack Exterior',
    level_label: 'Suelo',
    batch_number: 'LOTE-ALU-99',
    mfd_date: '2025-11-20',
    entry_date: '2025-12-05',
    exp_date: '',
    quantity: 210
  },
  {
    id: 'stk-4',
    material_id: 'mat-3',
    location_id: 'loc-1', // Nave 1
    row_label: 'Fila 5',
    position_label: 'Posición C1',
    shelf_label: 'Estantería Pesada',
    level_label: 'Nivel 1',
    batch_number: 'MOT-55-2026',
    mfd_date: '2026-01-05',
    entry_date: '2026-01-20',
    exp_date: '',
    quantity: 4
  },
  {
    id: 'stk-5',
    material_id: 'mat-4',
    location_id: 'loc-3', // Altillo 2
    row_label: 'Fila 3',
    position_label: 'Cajón 14',
    shelf_label: 'Estantería 2',
    level_label: 'Nivel 3',
    batch_number: 'IP65-BATCH-01',
    mfd_date: '2026-02-01',
    entry_date: '2026-02-10',
    exp_date: '',
    quantity: 45
  }
];

const SEED_MOVEMENTS = [
  {
    id: 'mov-1',
    movement_type: 'ENTRADA',
    material_id: 'mat-1',
    material_name: 'Cable Cobre Unipolar 16mm',
    source_location_name: '-',
    source_coords: '-',
    dest_location_name: 'Carpa 1 - Exterior',
    dest_coords: 'Fila 2 - Posición B4',
    batch_number: 'LOTE-2026-08',
    quantity: 350,
    user_name: 'Carlos Enguí (Admin)',
    remarks: 'Recepción pedido proveedor bobinas',
    created_at: '2026-02-01T10:30:00.000Z'
  },
  {
    id: 'mov-2',
    movement_type: 'TRASLADO',
    material_id: 'mat-1',
    material_name: 'Cable Cobre Unipolar 16mm',
    source_location_name: 'Carpa 1 - Exterior',
    source_coords: 'Fila 2 - Posición B4',
    dest_location_name: 'Altillo 1 - Pañolería',
    dest_coords: 'Fila 1 - Posición A2',
    batch_number: 'LOTE-2026-09',
    quantity: 120,
    user_name: 'Juan Pérez (Almacén)',
    remarks: 'Traslado para consumo rápido en pañolería',
    created_at: '2026-03-01T14:15:00.000Z'
  }
];

// Helpers para LocalStorage
const getLS = (key, fallback) => {
  try {
    const data = localStorage.getItem(`bm_${key}`);
    return data ? JSON.parse(data) : fallback;
  } catch (err) {
    console.error(`Error al leer de localStorage (${key}):`, err);
    return fallback;
  }
};

const setLS = (key, data) => {
  try {
    localStorage.setItem(`bm_${key}`, JSON.stringify(data));
  } catch (err) {
    console.error(`Error al guardar en localStorage (${key}):`, err);
  }
};

// Inicializar LocalStorage si está vacío
const initLS = () => {
  if (!localStorage.getItem('bm_locations')) setLS('locations', SEED_LOCATIONS);
  if (!localStorage.getItem('bm_materials')) setLS('materials', SEED_MATERIALS);
  if (!localStorage.getItem('bm_stock')) setLS('stock', SEED_STOCK);
  if (!localStorage.getItem('bm_movements')) setLS('movements', SEED_MOVEMENTS);
  if (!localStorage.getItem('bm_logs')) setLS('logs', []);
  if (!localStorage.getItem('bm_user')) setLS('user', { name: 'Carlos Enguí', email: 'carlos@empresa.com', role: 'Administrador' });
};

initLS();

export const getCurrentUser = () => getLS('user', { name: 'Carlos Enguí', email: 'carlos@empresa.com', role: 'Administrador' });
export const setCurrentUser = (user) => setLS('user', user);

// ==========================================
// OPERACIONES DE UBICACIONES
// ==========================================
export const fetchLocations = async () => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('locations').select('*').order('name');
      if (error) throw error;
      return data || [];
    } catch (err) {
      await logSystemError('Error al obtener ubicaciones de Supabase', err);
      return getLS('locations', SEED_LOCATIONS);
    }
  }
  return getLS('locations', SEED_LOCATIONS);
};

export const saveLocation = async (locationData) => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('locations').upsert(locationData).select();
      if (error) throw error;
      return data[0];
    } catch (err) {
      await logSystemError('Error al guardar ubicación en Supabase', err);
    }
  }
  
  // Fallback LocalStorage
  const locations = getLS('locations', SEED_LOCATIONS);
  let updated;
  if (locationData.id) {
    updated = locations.map(l => l.id === locationData.id ? { ...l, ...locationData } : l);
  } else {
    const newLoc = { ...locationData, id: `loc-${Date.now()}`, is_active: true };
    updated = [...locations, newLoc];
  }
  setLS('locations', updated);
  return locationData;
};

// ==========================================
// OPERACIONES DE MATERIALES
// ==========================================
export const fetchMaterials = async () => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('materials').select('*').order('name');
      if (error) throw error;
      return data || [];
    } catch (err) {
      await logSystemError('Error al obtener materiales de Supabase', err);
      return getLS('materials', SEED_MATERIALS);
    }
  }
  return getLS('materials', SEED_MATERIALS);
};

export const saveMaterial = async (materialData) => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('materials').upsert(materialData).select();
      if (error) throw error;
      return data[0];
    } catch (err) {
      await logSystemError('Error al guardar material en Supabase', err);
    }
  }

  const materials = getLS('materials', SEED_MATERIALS);
  let updated;
  if (materialData.id) {
    updated = materials.map(m => m.id === materialData.id ? { ...m, ...materialData } : m);
  } else {
    const newMat = { ...materialData, id: `mat-${Date.now()}` };
    updated = [...materials, newMat];
  }
  setLS('materials', updated);
  return materialData;
};

// ==========================================
// OPERACIONES DE INVENTARIO Y STOCK
// ==========================================
export const fetchStock = async () => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('inventory_stock')
        .select(`
          *,
          material:materials(*),
          location:locations(*)
        `);
      if (error) throw error;
      return data || [];
    } catch (err) {
      await logSystemError('Error al obtener stock de Supabase', err);
      return getLS('stock', SEED_STOCK);
    }
  }
  return getLS('stock', SEED_STOCK);
};

// ENTRADA DE MATERIAL
export const processStockIn = async (payload, activeUser) => {
  const { material_id, location_id, row_label, position_label, shelf_label, level_label, batch_number, mfd_date, entry_date, exp_date, quantity, remarks } = payload;
  
  const qty = parseFloat(quantity);
  if (isNaN(qty) || qty <= 0) throw new Error('La cantidad debe ser mayor que 0');

  const materials = await fetchMaterials();
  const locations = await fetchLocations();
  const mat = materials.find(m => m.id === material_id);
  const loc = locations.find(l => l.id === location_id);

  if (!mat || !loc) throw new Error('Material o Ubicación no válida');

  if (isSupabaseConfigured()) {
    try {
      // Buscar si ya existe la posición y lote
      const { data: existing } = await supabase
        .from('inventory_stock')
        .select('*')
        .match({
          material_id,
          location_id,
          row_label: row_label || 'Fila 1',
          position_label: position_label || 'Pos. 1',
          batch_number: batch_number || 'SIN LOTE'
        })
        .single();

      if (existing) {
        await supabase
          .from('inventory_stock')
          .update({ quantity: parseFloat(existing.quantity) + qty, updated_at: new Date().toISOString() })
          .eq('id', existing.id);
      } else {
        await supabase.from('inventory_stock').insert({
          material_id,
          location_id,
          row_label: row_label || 'Fila 1',
          position_label: position_label || 'Pos. 1',
          shelf_label: shelf_label || '',
          level_label: level_label || '',
          batch_number: batch_number || 'SIN LOTE',
          mfd_date: mfd_date || null,
          entry_date: entry_date || new Date().toISOString().split('T')[0],
          exp_date: exp_date || null,
          quantity: qty
        });
      }

      await recordMovement({
        movement_type: 'ENTRADA',
        material_id,
        material_name: mat.name,
        source_location_name: '-',
        source_coords: '-',
        dest_location_name: loc.name,
        dest_coords: `${row_label || 'Fila 1'} - ${position_label || 'Pos. 1'}`,
        batch_number: batch_number || 'SIN LOTE',
        quantity: qty,
        user_name: activeUser.name,
        remarks: remarks || 'Entrada manual de material'
      });

      return true;
    } catch (err) {
      await logSystemError('Error en proceso de entrada Supabase', err, activeUser.name);
    }
  }

  // LocalStorage Fallback
  const stockList = getLS('stock', SEED_STOCK);
  const index = stockList.findIndex(s => 
    s.material_id === material_id && 
    s.location_id === location_id && 
    s.row_label === (row_label || 'Fila 1') &&
    s.position_label === (position_label || 'Pos. 1') &&
    s.batch_number === (batch_number || 'SIN LOTE')
  );

  if (index >= 0) {
    stockList[index].quantity += qty;
  } else {
    stockList.push({
      id: `stk-${Date.now()}`,
      material_id,
      location_id,
      row_label: row_label || 'Fila 1',
      position_label: position_label || 'Pos. 1',
      shelf_label: shelf_label || '',
      level_label: level_label || '',
      batch_number: batch_number || 'SIN LOTE',
      mfd_date: mfd_date || '',
      entry_date: entry_date || new Date().toISOString().split('T')[0],
      exp_date: exp_date || '',
      quantity: qty
    });
  }

  setLS('stock', stockList);

  await recordMovement({
    movement_type: 'ENTRADA',
    material_id,
    material_name: mat.name,
    source_location_name: '-',
    source_coords: '-',
    dest_location_name: loc.name,
    dest_coords: `${row_label || 'Fila 1'} - ${position_label || 'Pos. 1'}`,
    batch_number: batch_number || 'SIN LOTE',
    quantity: qty,
    user_name: activeUser.name,
    remarks: remarks || 'Entrada de material'
  });

  return true;
};

// SALIDA DE MATERIAL
export const processStockOut = async (payload, activeUser) => {
  const { stock_id, quantity, remarks } = payload;
  const qty = parseFloat(quantity);
  if (isNaN(qty) || qty <= 0) throw new Error('La cantidad a retirar debe ser mayor a 0');

  const stockList = getLS('stock', SEED_STOCK);
  const stockItem = stockList.find(s => s.id === stock_id);
  if (!stockItem) throw new Error('Registro de stock no encontrado');
  if (stockItem.quantity < qty) throw new Error(`Stock insuficiente. Disponible: ${stockItem.quantity}`);

  const materials = await fetchMaterials();
  const locations = await fetchLocations();
  const mat = materials.find(m => m.id === stockItem.material_id);
  const loc = locations.find(l => l.id === stockItem.location_id);

  if (isSupabaseConfigured()) {
    try {
      if (stockItem.quantity === qty) {
        await supabase.from('inventory_stock').delete().eq('id', stock_id);
      } else {
        await supabase.from('inventory_stock').update({ quantity: stockItem.quantity - qty }).eq('id', stock_id);
      }

      await recordMovement({
        movement_type: 'SALIDA',
        material_id: stockItem.material_id,
        material_name: mat?.name || 'Material',
        source_location_name: loc?.name || 'Almacén',
        source_coords: `${stockItem.row_label} - ${stockItem.position_label}`,
        dest_location_name: '-',
        dest_coords: '-',
        batch_number: stockItem.batch_number,
        quantity: qty,
        user_name: activeUser.name,
        remarks: remarks || 'Salida de mercancía'
      });

      return true;
    } catch (err) {
      await logSystemError('Error en salida Supabase', err, activeUser.name);
    }
  }

  // LocalStorage
  if (stockItem.quantity === qty) {
    const updated = stockList.filter(s => s.id !== stock_id);
    setLS('stock', updated);
  } else {
    stockItem.quantity -= qty;
    setLS('stock', stockList);
  }

  await recordMovement({
    movement_type: 'SALIDA',
    material_id: stockItem.material_id,
    material_name: mat?.name || 'Material',
    source_location_name: loc?.name || 'Almacén',
    source_coords: `${stockItem.row_label} - ${stockItem.position_label}`,
    dest_location_name: '-',
    dest_coords: '-',
    batch_number: stockItem.batch_number,
    quantity: qty,
    user_name: activeUser.name,
    remarks: remarks || 'Salida de mercancía'
  });

  return true;
};

// TRASLADO DE MATERIAL ENTRE UBICACIONES
export const processStockTransfer = async (payload, activeUser) => {
  const { stock_id, target_location_id, target_row, target_position, quantity, remarks } = payload;
  const qty = parseFloat(quantity);
  if (isNaN(qty) || qty <= 0) throw new Error('Cantidad no válida');

  const stockList = getLS('stock', SEED_STOCK);
  const sourceStock = stockList.find(s => s.id === stock_id);
  if (!sourceStock) throw new Error('No se encontró el registro de stock origen');
  if (sourceStock.quantity < qty) throw new Error(`Stock disponible insuficiente (${sourceStock.quantity})`);

  const materials = await fetchMaterials();
  const locations = await fetchLocations();
  const mat = materials.find(m => m.id === sourceStock.material_id);
  const srcLoc = locations.find(l => l.id === sourceStock.location_id);
  const destLoc = locations.find(l => l.id === target_location_id);

  if (!destLoc) throw new Error('Seleccione la ubicación destino');

  // Registrar salida de origen
  await processStockOut({ stock_id, quantity: qty, remarks: `Traslado hacia ${destLoc.name}` }, activeUser);

  // Registrar entrada en destino
  await processStockIn({
    material_id: sourceStock.material_id,
    location_id: target_location_id,
    row_label: target_row || 'Fila 1',
    position_label: target_position || 'Pos. 1',
    shelf_label: sourceStock.shelf_label,
    level_label: sourceStock.level_label,
    batch_number: sourceStock.batch_number,
    mfd_date: sourceStock.mfd_date,
    entry_date: sourceStock.entry_date,
    exp_date: sourceStock.exp_date,
    quantity: qty,
    remarks: remarks || `Traslado desde ${srcLoc?.name || 'Origen'}`
  }, activeUser);

  // Registrar movimiento unificado de TRASLADO
  await recordMovement({
    movement_type: 'TRASLADO',
    material_id: sourceStock.material_id,
    material_name: mat?.name || 'Material',
    source_location_name: srcLoc?.name || 'Origen',
    source_coords: `${sourceStock.row_label} - ${sourceStock.position_label}`,
    dest_location_name: destLoc.name,
    dest_coords: `${target_row || 'Fila 1'} - ${target_position || 'Pos. 1'}`,
    batch_number: sourceStock.batch_number,
    quantity: qty,
    user_name: activeUser.name,
    remarks: remarks || 'Reubicación de material'
  });

  return true;
};

// ==========================================
// REGISTRO DE MOVIMIENTOS E HISTORIAL
// ==========================================
export const fetchMovements = async () => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('stock_movements').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      await logSystemError('Error al obtener movimientos de Supabase', err);
      return getLS('movements', SEED_MOVEMENTS);
    }
  }
  return getLS('movements', SEED_MOVEMENTS);
};

export const recordMovement = async (movData) => {
  const fullMov = {
    ...movData,
    id: `mov-${Date.now()}`,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured()) {
    try {
      await supabase.from('stock_movements').insert([movData]);
    } catch (err) {
      console.error('Error guardando movimiento en Supabase:', err);
    }
  }

  const movements = getLS('movements', SEED_MOVEMENTS);
  setLS('movements', [fullMov, ...movements]);
};

// ==========================================
// LOGS DEL SISTEMA Y ERRORES
// ==========================================
export const fetchSystemLogs = async () => {
  if (isSupabaseConfigured()) {
    try {
      const { data } = await supabase.from('system_logs').select('*').order('created_at', { ascending: false });
      return data || [];
    } catch (err) {
      return getLS('logs', []);
    }
  }
  return getLS('logs', []);
};

export const logSystemError = async (message, errorObj = null, userName = 'Sistema') => {
  const logItem = {
    id: `log-${Date.now()}`,
    log_type: 'ERROR',
    message,
    details: errorObj ? (errorObj.message || String(errorObj)) : null,
    user_name: userName,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured()) {
    try {
      await supabase.from('system_logs').insert([logItem]);
    } catch (e) {
      console.error('No se pudo enviar log a Supabase:', e);
    }
  }

  const logs = getLS('logs', []);
  setLS('logs', [logItem, ...logs]);
};
