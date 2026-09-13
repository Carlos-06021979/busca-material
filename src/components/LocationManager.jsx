import React, { useState } from 'react';
import { MapPin, Plus, Edit2, Check, AlertCircle, Building2, Warehouse } from 'lucide-react';

export default function LocationManager({ locations = [], stock = [], onSaveLocation }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('Nave');
  const [description, setDescription] = useState('');

  const handleEditClick = (loc) => {
    setEditingId(loc.id);
    setCode(loc.code);
    setName(loc.name);
    setType(loc.type);
    setDescription(loc.description || '');
    setShowAddForm(true);
  };

  const handleReset = () => {
    setEditingId(null);
    setCode('');
    setName('');
    setType('Nave');
    setDescription('');
    setShowAddForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !code) return;

    await onSaveLocation({
      id: editingId || undefined,
      code: code.toUpperCase(),
      name,
      type,
      description
    });

    handleReset();
  };

  const getBadgeClass = (t) => {
    switch (t?.toLowerCase()) {
      case 'nave': return 'badge-nave';
      case 'altillo': return 'badge-altillo';
      case 'carpa': return 'badge-carpa';
      case 'patio': return 'badge-patio';
      default: return 'badge-general';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Banner */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(255, 190, 11, 0.2)', padding: '0.8rem', borderRadius: '12px', color: 'var(--warning)' }}>
            <Warehouse size={32} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Gestión de Zonas y Ubicaciones del Almacén</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Crea o edita altillos, carpas, naves y zonas de patio para ubicar tu mercancía con precisión.
            </p>
          </div>
        </div>

        <button 
          className="btn btn-primary" 
          onClick={() => { handleReset(); setShowAddForm(!showAddForm); }}
        >
          <Plus size={18} />
          <span>{showAddForm ? 'Ocultar Formulario' : 'Nueva Ubicación'}</span>
        </button>
      </div>

      {/* Formulario Alta / Edición */}
      {showAddForm && (
        <form className="glass-card" onSubmit={handleSubmit} style={{ border: '1px solid var(--primary)' }}>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '1rem', color: 'var(--secondary)' }}>
            {editingId ? '✍️ Editar Ubicación Existente' : '➕ Alta de Nueva Ubicación o Zona'}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label className="form-label">Código Único *</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ej: NAV-2, ALT-3, CRP-3, PAT-2"
                value={code}
                onChange={e => setCode(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">Nombre Descriptivo *</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ej: Altillo 3 - Material Eléctrico"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">Tipo de Zona *</label>
              <select className="form-select" value={type} onChange={e => setType(e.target.value)}>
                <option value="Nave">Nave Industrial</option>
                <option value="Altillo">Altillo / Mezzanine</option>
                <option value="Carpa">Carpa Cubierta Exterior</option>
                <option value="Patio">Patio Exterior</option>
                <option value="Zona Especial">Zona Especial / Pañolería</option>
              </select>
            </div>

            <div>
              <label className="form-label">Descripción u Observaciones</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ej: Estanterías de carga pesada"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1.2rem' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleReset}>Cancelar</button>
            <button type="submit" className="btn btn-success btn-sm">
              <Check size={16} /> Guardar Ubicación
            </button>
          </div>
        </form>
      )}

      {/* Grilla de Ubicaciones Existentes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
        {locations.map(loc => {
          // Contar cuántos registros de stock hay en esta ubicación
          const itemsInLoc = stock.filter(s => s.location_id === loc.id);
          const totalUnitsInLoc = itemsInLoc.reduce((acc, curr) => acc + (parseFloat(curr.quantity) || 0), 0);

          return (
            <div key={loc.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                  <span className={`badge ${getBadgeClass(loc.type)}`}>{loc.type}</span>
                  <span className="badge badge-general" style={{ fontSize: '0.7rem' }}>{loc.code}</span>
                </div>

                <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '0.3rem' }}>{loc.name}</h3>
                {loc.description && (
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{loc.description}</p>
                )}
              </div>

              <div style={{ paddingTop: '0.8rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ocupación Actual</div>
                  <strong style={{ fontSize: '1rem', color: totalUnitsInLoc > 0 ? 'var(--secondary)' : 'var(--text-muted)' }}>
                    {itemsInLoc.length} ítems <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>({totalUnitsInLoc} uds)</span>
                  </strong>
                </div>

                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleEditClick(loc)}
                  title="Editar nombre o tipo de esta ubicación"
                >
                  <Edit2 size={14} color="var(--primary)" />
                  <span>Editar</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
