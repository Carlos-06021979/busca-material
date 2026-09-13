import React, { useState, useEffect } from 'react';
import { 
  X, 
  PlusCircle, 
  MinusCircle, 
  ArrowRightLeft, 
  Package, 
  MapPin, 
  Tag, 
  Calendar, 
  CheckCircle,
  Plus
} from 'lucide-react';

export default function StockOperationsModal({ 
  isOpen, 
  onClose, 
  operationType = 'ENTRADA', // 'ENTRADA', 'SALIDA', 'TRASLADO'
  selectedStockItem = null,
  materials = [], 
  locations = [], 
  activeUser, 
  onStockIn, 
  onStockOut, 
  onStockTransfer,
  onSaveMaterial 
}) {
  if (!isOpen) return null;

  const [mode, setMode] = useState(operationType);

  // Form State Entrada
  const [materialId, setMaterialId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [rowLabel, setRowLabel] = useState('Fila 1');
  const [positionLabel, setPositionLabel] = useState('Posición A1');
  const [shelfLabel, setShelfLabel] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [mfdDate, setMfdDate] = useState('');
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [expDate, setExpDate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [remarks, setRemarks] = useState('');

  // Form State Traslado
  const [targetLocationId, setTargetLocationId] = useState('');
  const [targetRow, setTargetRow] = useState('Fila 1');
  const [targetPosition, setTargetPosition] = useState('Posición A1');

  // Estado para Crear Nuevo Material Rápidamente
  const [showNewMaterialForm, setShowNewMaterialForm] = useState(false);
  const [newMatSku, setNewMatSku] = useState('');
  const [newMatName, setNewMatName] = useState('');
  const [newMatCategory, setNewMatCategory] = useState('General');
  const [newMatUnit, setNewMatUnit] = useState('Unidades');
  const [newMatMinStock, setNewMatMinStock] = useState('10');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setMode(operationType);
    setErrorMsg('');

    if (selectedStockItem) {
      setMaterialId(selectedStockItem.material_id);
      setLocationId(selectedStockItem.location_id);
      setRowLabel(selectedStockItem.row_label || 'Fila 1');
      setPositionLabel(selectedStockItem.position_label || 'Posición A1');
      setBatchNumber(selectedStockItem.batch_number || '');
      setQuantity(selectedStockItem.quantity || '');
    } else {
      if (materials.length > 0) setMaterialId(materials[0].id);
      if (locations.length > 0) setLocationId(locations[0].id);
      setBatchNumber(`LOTE-${new Date().getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`);
    }
  }, [operationType, selectedStockItem, materials, locations, isOpen]);

  const handleCreateMaterial = async (e) => {
    e.preventDefault();
    if (!newMatName || !newMatSku) {
      setErrorMsg('Escriba el nombre y código del nuevo material');
      return;
    }

    try {
      setLoading(true);
      const created = await onSaveMaterial({
        sku: newMatSku.toUpperCase(),
        name: newMatName,
        category: newMatCategory,
        unit: newMatUnit,
        min_stock: parseFloat(newMatMinStock) || 0
      });

      if (created) {
        setMaterialId(created.id);
        setShowNewMaterialForm(false);
        setNewMatName('');
        setNewMatSku('');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error al crear material');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      setLoading(true);
      if (mode === 'ENTRADA') {
        if (!materialId || !locationId || !quantity) {
          throw new Error('Complete los campos obligatorios (Material, Ubicación y Cantidad)');
        }
        await onStockIn({
          material_id: materialId,
          location_id: locationId,
          row_label: rowLabel,
          position_label: positionLabel,
          shelf_label: shelfLabel,
          batch_number: batchNumber || 'SIN LOTE',
          mfd_date: mfdDate,
          entry_date: entryDate,
          exp_date: expDate,
          quantity: parseFloat(quantity),
          remarks
        });
      } else if (mode === 'SALIDA') {
        if (!selectedStockItem || !quantity) {
          throw new Error('Seleccione la posición e ingrese la cantidad a retirar');
        }
        await onStockOut({
          stock_id: selectedStockItem.id,
          quantity: parseFloat(quantity),
          remarks
        });
      } else if (mode === 'TRASLADO') {
        if (!selectedStockItem || !targetLocationId || !quantity) {
          throw new Error('Seleccione la ubicación de destino y la cantidad a mover');
        }
        await onStockTransfer({
          stock_id: selectedStockItem.id,
          target_location_id: targetLocationId,
          target_row: targetRow,
          target_position: targetPosition,
          quantity: parseFloat(quantity),
          remarks
        });
      }

      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Error al procesar la operación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Header Modal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', paddingBottom: '0.8rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {mode === 'ENTRADA' && <PlusCircle color="var(--success)" size={24} />}
            {mode === 'SALIDA' && <MinusCircle color="var(--danger)" size={24} />}
            {mode === 'TRASLADO' && <ArrowRightLeft color="var(--primary)" size={24} />}
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
              {mode === 'ENTRADA' && 'Entrada de Material a Ubicación'}
              {mode === 'SALIDA' && 'Salida / Retiro de Material'}
              {mode === 'TRASLADO' && 'Traslado entre Ubicaciones del Almacén'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.3rem' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs de cambio de modo */}
        {!selectedStockItem && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.2rem' }}>
            <button 
              className={`btn btn-sm ${mode === 'ENTRADA' ? 'btn-success' : 'btn-secondary'}`}
              onClick={() => setMode('ENTRADA')}
              style={{ flex: 1 }}
            >
              <PlusCircle size={15} /> Entrada
            </button>
          </div>
        )}

        {errorMsg && (
          <div style={{ background: 'rgba(255, 0, 84, 0.2)', border: '1px solid var(--danger)', color: '#f87171', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* MODO ENTRADA */}
        {mode === 'ENTRADA' && (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Selección de Material */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <label className="form-label">Material a Ingresar *</label>
                  <button 
                    type="button" 
                    onClick={() => setShowNewMaterialForm(!showNewMaterialForm)}
                    style={{ background: 'none', border: 'none', color: 'var(--secondary)', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                  >
                    <Plus size={12} /> {showNewMaterialForm ? 'Cancelar Nuevo' : 'Crear Nuevo Material'}
                  </button>
                </div>

                {showNewMaterialForm ? (
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '10px', border: '1px dashed var(--secondary)', marginBottom: '0.5rem' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '0.6rem' }}>Alta de Nuevo Material</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                      <input type="text" className="form-control" placeholder="SKU / Código (Ej: MAT-006)" value={newMatSku} onChange={e => setNewMatSku(e.target.value)} />
                      <input type="text" className="form-control" placeholder="Nombre del Material" value={newMatName} onChange={e => setNewMatName(e.target.value)} />
                      <input type="text" className="form-control" placeholder="Categoría (Ej: Electricidad)" value={newMatCategory} onChange={e => setNewMatCategory(e.target.value)} />
                      <select className="form-select" value={newMatUnit} onChange={e => setNewMatUnit(e.target.value)}>
                        <option value="Unidades">Unidades</option>
                        <option value="Metros">Metros</option>
                        <option value="Kg">Kg</option>
                        <option value="Cajas">Cajas</option>
                        <option value="Litros">Litros</option>
                      </select>
                    </div>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={handleCreateMaterial} style={{ marginTop: '0.6rem', width: '100%' }}>
                      Guardar y Seleccionar Material
                    </button>
                  </div>
                ) : (
                  <select className="form-select" value={materialId} onChange={e => setMaterialId(e.target.value)} required>
                    {materials.map(m => (
                      <option key={m.id} value={m.id}>{m.sku} - {m.name} ({m.unit || 'Uds'})</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Selección de Ubicación y Coordenadas */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div>
                  <label className="form-label">Ubicación Destino *</label>
                  <select className="form-select" value={locationId} onChange={e => setLocationId(e.target.value)} required>
                    {locations.map(l => (
                      <option key={l.id} value={l.id}>{l.name} ({l.type})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Fila / Pasillo</label>
                  <input type="text" className="form-control" placeholder="Ej: Fila 2" value={rowLabel} onChange={e => setRowLabel(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Posición / Hueco</label>
                  <input type="text" className="form-control" placeholder="Ej: Posición B4" value={positionLabel} onChange={e => setPositionLabel(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Estantería / Nivel (Opcional)</label>
                  <input type="text" className="form-control" placeholder="Ej: Estantería 3" value={shelfLabel} onChange={e => setShelfLabel(e.target.value)} />
                </div>
              </div>

              {/* Número de Lote y Fechas */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.8rem' }}>
                <div>
                  <label className="form-label">Número de Lote *</label>
                  <input type="text" className="form-control" placeholder="LOTE-XXX" value={batchNumber} onChange={e => setBatchNumber(e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">Fecha Fabricación</label>
                  <input type="date" className="form-control" value={mfdDate} onChange={e => setMfdDate(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Fecha Entrada</label>
                  <input type="date" className="form-control" value={entryDate} onChange={e => setEntryDate(e.target.value)} />
                </div>
              </div>

              {/* Cantidad y Observaciones */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.8rem' }}>
                <div>
                  <label className="form-label">Cantidad a Ingresar *</label>
                  <input type="number" step="any" min="0.01" className="form-control" placeholder="Ej: 100" value={quantity} onChange={e => setQuantity(e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">Notas / Observaciones</label>
                  <input type="text" className="form-control" placeholder="Ej: Pedido proveedor Nº 8492" value={remarks} onChange={e => setRemarks(e.target.value)} />
                </div>
              </div>

            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? 'Registrando...' : 'Confirmar Entrada de Stock'}
              </button>
            </div>
          </form>
        )}

        {/* MODO SALIDA */}
        {mode === 'SALIDA' && selectedStockItem && (
          <form onSubmit={handleSubmit}>
            <div style={{ background: 'rgba(255, 0, 84, 0.1)', padding: '1rem', borderRadius: '10px', marginBottom: '1.2rem', border: '1px solid rgba(255, 0, 84, 0.3)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Material a retirar:</div>
              <strong style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>{selectedStockItem.material?.name || 'Material'}</strong>
              <div style={{ fontSize: '0.82rem', color: 'var(--secondary)', marginTop: '0.2rem' }}>
                📍 {selectedStockItem.location?.name} ({selectedStockItem.row_label} - {selectedStockItem.position_label}) | Lote: {selectedStockItem.batch_number}
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '0.4rem', color: 'var(--danger)' }}>
                Stock Disponible en esta ubicación: {selectedStockItem.quantity}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Cantidad a Retirar *</label>
                <input 
                  type="number" 
                  step="any" 
                  max={selectedStockItem.quantity}
                  className="form-control" 
                  placeholder={`Máximo ${selectedStockItem.quantity}`}
                  value={quantity} 
                  onChange={e => setQuantity(e.target.value)} 
                  required 
                />
              </div>

              <div>
                <label className="form-label">Motivo de la Salida / Observaciones</label>
                <input type="text" className="form-control" placeholder="Ej: Envío a obra N-340 / Salida para taller" value={remarks} onChange={e => setRemarks(e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-danger" disabled={loading}>
                {loading ? 'Procesando...' : 'Confirmar Salida de Stock'}
              </button>
            </div>
          </form>
        )}

        {/* MODO TRASLADO */}
        {mode === 'TRASLADO' && selectedStockItem && (
          <form onSubmit={handleSubmit}>
            <div style={{ background: 'rgba(58, 134, 255, 0.1)', padding: '1rem', borderRadius: '10px', marginBottom: '1.2rem', border: '1px solid rgba(58, 134, 255, 0.3)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Origen del traslado:</div>
              <strong style={{ fontSize: '1.05rem' }}>{selectedStockItem.material?.name}</strong>
              <div style={{ fontSize: '0.82rem', color: 'var(--secondary)' }}>
                📍 Origen: {selectedStockItem.location?.name} ({selectedStockItem.row_label} - {selectedStockItem.position_label}) | Stock: {selectedStockItem.quantity}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Ubicación Destino *</label>
                <select className="form-select" value={targetLocationId} onChange={e => setTargetLocationId(e.target.value)} required>
                  <option value="">Seleccione nueva ubicación...</option>
                  {locations.filter(l => l.id !== selectedStockItem.location_id).map(l => (
                    <option key={l.id} value={l.id}>{l.name} ({l.type})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div>
                  <label className="form-label">Nueva Fila / Pasillo</label>
                  <input type="text" className="form-control" placeholder="Ej: Fila 1" value={targetRow} onChange={e => setTargetRow(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Nueva Posición</label>
                  <input type="text" className="form-control" placeholder="Ej: Posición A2" value={targetPosition} onChange={e => setTargetPosition(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.8rem' }}>
                <div>
                  <label className="form-label">Cantidad a Mover *</label>
                  <input type="number" step="any" max={selectedStockItem.quantity} className="form-control" value={quantity} onChange={e => setQuantity(e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">Observaciones</label>
                  <input type="text" className="form-control" placeholder="Ej: Reorganización de zonas" value={remarks} onChange={e => setRemarks(e.target.value)} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Moviendo...' : 'Ejecutar Traslado'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
