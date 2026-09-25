import React, { useState, useMemo } from 'react';
import { 
  Truck, 
  Search, 
  Package, 
  MapPin, 
  ArrowRightLeft, 
  PlusCircle, 
  MinusCircle, 
  CheckCircle2, 
  CornerDownRight, 
  Tag, 
  Calendar,
  AlertTriangle,
  Compass,
  Boxes,
  Grid
} from 'lucide-react';
import WarehouseMap from './WarehouseMap';

export default function OperatorView({ 
  materials = [], 
  locations = [], 
  stock = [], 
  onOpenOperations 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZoneFilter, setSelectedZoneFilter] = useState('ALL');
  const [activeSubView, setActiveSubView] = useState('SEARCH'); // 'SEARCH' o 'MAP'

  // Mapear stock con datos de material y ubicación
  const enrichedStock = useMemo(() => {
    return stock.map(stk => {
      const mat = materials.find(m => m.id === stk.material_id) || stk.material || {};
      const loc = locations.find(l => l.id === stk.location_id) || stk.location || {};
      return {
        ...stk,
        material: mat,
        location: loc
      };
    });
  }, [stock, materials, locations]);

  // Filtrar según término de búsqueda y zona seleccionada
  const filteredStock = useMemo(() => {
    return enrichedStock.filter(stk => {
      const term = searchTerm.toLowerCase().trim();
      const matchesText = !term || 
        (stk.material?.name && stk.material.name.toLowerCase().includes(term)) ||
        (stk.material?.sku && stk.material.sku.toLowerCase().includes(term)) ||
        (stk.batch_number && stk.batch_number.toLowerCase().includes(term)) ||
        (stk.location?.name && stk.location.name.toLowerCase().includes(term)) ||
        (stk.row_label && stk.row_label.toLowerCase().includes(term)) ||
        (stk.position_label && stk.position_label.toLowerCase().includes(term));

      const matchesZone = selectedZoneFilter === 'ALL' || stk.location_id === selectedZoneFilter;

      return matchesText && matchesZone;
    });
  }, [enrichedStock, searchTerm, selectedZoneFilter]);

  const getZoneIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'nave': return '🏢';
      case 'altillo': return '🪜';
      case 'carpa': return '🎪';
      case 'patio': return '🏞️';
      default: return '📍';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
      
      {/* Banner de Bienvenida Modo Carretillero */}
      <div className="glass-card" style={{ 
        background: 'linear-gradient(135deg, rgba(58, 134, 255, 0.2) 0%, rgba(0, 245, 212, 0.15) 100%)',
        border: '1.5px solid var(--secondary)',
        padding: '1.4rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              background: 'var(--secondary)', 
              color: '#0b132b', 
              padding: '0.8rem', 
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(0, 245, 212, 0.5)'
            }}>
              <Truck size={36} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff' }}>
                  Modo Táctil Maquinista
                </h2>
                <span className="badge badge-nave" style={{ fontSize: '0.75rem', fontWeight: 800 }}>
                  ⚡ Interfaz Rápida
                </span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Diseñado para consultar y mover material en segundos desde la carretilla elevadora.
              </p>
            </div>
          </div>

          {/* Toggle de Subvistas: Buscador Táctil vs Mapa 2D */}
          <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.3rem', borderRadius: '12px' }}>
            <button 
              className={`btn btn-sm ${activeSubView === 'SEARCH' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveSubView('SEARCH')}
              style={{ fontWeight: 700, padding: '0.6rem 1rem' }}
            >
              <Search size={16} /> Buscador Rápido
            </button>
            <button 
              className={`btn btn-sm ${activeSubView === 'MAP' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveSubView('MAP')}
              style={{ fontWeight: 700, padding: '0.6rem 1rem' }}
            >
              <Grid size={16} /> Plano 2D Almacén
            </button>
          </div>
        </div>
      </div>

      {/* BOTONES GIGANTES DE ACCIÓN DIRECTA */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        
        {/* BOTÓN ENTRADA */}
        <button
          onClick={() => onOpenOperations('ENTRADA', null)}
          style={{
            background: 'linear-gradient(135deg, rgba(56, 176, 0, 0.25) 0%, rgba(21, 128, 61, 0.4) 100%)',
            border: '2px solid #38b000',
            borderRadius: '18px',
            padding: '1.3rem',
            color: '#ffffff',
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '1.2rem',
            transition: 'transform 0.15s ease, boxShadow 0.15s ease',
            boxShadow: '0 6px 20px rgba(56, 176, 0, 0.25)'
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <div style={{ background: '#38b000', padding: '0.8rem', borderRadius: '14px', color: '#fff' }}>
            <PlusCircle size={32} />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>📥 METER MATERIAL</div>
            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)' }}>Registrar entrada a estantería</div>
          </div>
        </button>

        {/* BOTÓN MOVER */}
        <button
          onClick={() => {
            if (enrichedStock.length > 0) {
              onOpenOperations('TRASLADO', enrichedStock[0]);
            } else {
              alert('No hay stock para trasladar');
            }
          }}
          style={{
            background: 'linear-gradient(135deg, rgba(58, 134, 255, 0.25) 0%, rgba(37, 99, 235, 0.4) 100%)',
            border: '2px solid #3a86ff',
            borderRadius: '18px',
            padding: '1.3rem',
            color: '#ffffff',
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '1.2rem',
            transition: 'transform 0.15s ease, boxShadow 0.15s ease',
            boxShadow: '0 6px 20px rgba(58, 134, 255, 0.25)'
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <div style={{ background: '#3a86ff', padding: '0.8rem', borderRadius: '14px', color: '#fff' }}>
            <ArrowRightLeft size={32} />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>🚚 MOVER PALET</div>
            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)' }}>Cambiar de sitio o estantería</div>
          </div>
        </button>

        {/* BOTÓN SACAR */}
        <button
          onClick={() => {
            if (enrichedStock.length > 0) {
              onOpenOperations('SALIDA', enrichedStock[0]);
            } else {
              alert('No hay stock disponible para retirar');
            }
          }}
          style={{
            background: 'linear-gradient(135deg, rgba(255, 0, 84, 0.25) 0%, rgba(185, 28, 28, 0.4) 100%)',
            border: '2px solid #ff0054',
            borderRadius: '18px',
            padding: '1.3rem',
            color: '#ffffff',
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '1.2rem',
            transition: 'transform 0.15s ease, boxShadow 0.15s ease',
            boxShadow: '0 6px 20px rgba(255, 0, 84, 0.25)'
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <div style={{ background: '#ff0054', padding: '0.8rem', borderRadius: '14px', color: '#fff' }}>
            <MinusCircle size={32} />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>📤 SACAR MATERIAL</div>
            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)' }}>Retirar para obra o camión</div>
          </div>
        </button>

      </div>

      {/* VISTA MAPA 2D */}
      {activeSubView === 'MAP' ? (
        <WarehouseMap 
          locations={locations}
          stock={stock}
          materials={materials}
          onOpenOperations={onOpenOperations}
        />
      ) : (
        /* VISTA BUSCADOR VISUAL Y CARJETAS PARA CARRETILLEROS */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          {/* Campo de Búsqueda Gigante Táctil */}
          <div className="glass-card" style={{ padding: '1.2rem' }}>
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <Search size={24} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)' }} />
              <input 
                type="text"
                className="form-control"
                placeholder="🔍 Toca aquí y busca: Cable, Perfil, Motor, Lote..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  paddingLeft: '3.5rem', 
                  fontSize: '1.2rem', 
                  paddingTop: '1rem', 
                  paddingBottom: '1rem',
                  borderRadius: '14px',
                  background: '#0a1128',
                  border: '2px solid rgba(0, 245, 212, 0.4)'
                }}
              />
            </div>

            {/* Chips de Filtrado Rápido por Zonas de Almacén */}
            <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '0.4rem' }}>
              <button 
                onClick={() => setSelectedZoneFilter('ALL')}
                style={{
                  background: selectedZoneFilter === 'ALL' ? 'var(--primary)' : 'rgba(255,255,255,0.06)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.5rem 1rem',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                📍 Todas las Naves ({enrichedStock.length})
              </button>

              {locations.map(loc => {
                const count = enrichedStock.filter(s => s.location_id === loc.id).length;
                const isSel = selectedZoneFilter === loc.id;
                return (
                  <button
                    key={loc.id}
                    onClick={() => setSelectedZoneFilter(loc.id)}
                    style={{
                      background: isSel ? 'var(--primary)' : 'rgba(255,255,255,0.06)',
                      color: isSel ? '#fff' : 'var(--text-muted)',
                      border: isSel ? '1px solid var(--secondary)' : '1px solid transparent',
                      borderRadius: '10px',
                      padding: '0.5rem 1rem',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <span>{getZoneIcon(loc.type)}</span>
                    <span>{loc.name}</span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* LISTADO DE TARJETAS VISUALES CON RUTA DE CARRETILLA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredStock.length === 0 ? (
              <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
                <AlertTriangle size={48} style={{ marginBottom: '1rem', color: 'var(--warning)' }} />
                <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.4rem' }}>No se encontraron coincidencias</h3>
                <p style={{ fontSize: '0.9rem' }}>Escribe otro material o borra el filtro de nave.</p>
              </div>
            ) : (
              filteredStock.map(stk => (
                <div 
                  key={stk.id}
                  className="glass-card"
                  style={{
                    padding: '1.4rem',
                    borderLeft: '6px solid var(--secondary)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}
                >
                  {/* Fila Superior: Nombre del Material y Lote */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff' }}>
                          {stk.material?.name || 'Material'}
                        </h3>
                        <span className="badge badge-nave" style={{ fontSize: '0.8rem' }}>
                          {stk.material?.sku}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <span style={{ color: 'var(--warning)', fontWeight: 600 }}>🏷️ Lote: {stk.batch_number}</span>
                        {stk.entry_date && <span>📅 Entrada: {stk.entry_date}</span>}
                      </div>
                    </div>

                    {/* Stock Grande */}
                    <div style={{ textAlign: 'right', background: 'rgba(0,0,0,0.3)', padding: '0.6rem 1.2rem', borderRadius: '12px' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>CANTIDAD DISPONIBLE</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--secondary)' }}>
                        {stk.quantity} <span style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 500 }}>{stk.material?.unit}</span>
                      </div>
                    </div>
                  </div>

                  {/* GUÍA DE NAVEGACIÓN GRÁFICA PARA EL MAQUINISTA (RUTA A SEGUIR) */}
                  <div style={{ 
                    background: 'rgba(15, 23, 42, 0.85)', 
                    border: '1.5px solid rgba(58, 134, 255, 0.4)', 
                    borderRadius: '12px', 
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem'
                  }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Compass size={16} /> Ruta Directa de Carretilla:
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem', fontSize: '1.05rem', fontWeight: 800 }}>
                      <div style={{ background: 'rgba(58, 134, 255, 0.25)', color: '#60a5fa', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(58, 134, 255, 0.4)' }}>
                        {getZoneIcon(stk.location?.type)} {stk.location?.name || 'Ubicación'}
                      </div>
                      <span style={{ color: 'var(--text-muted)' }}>➔</span>
                      <div style={{ background: 'rgba(0, 245, 212, 0.2)', color: 'var(--secondary)', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(0, 245, 212, 0.4)' }}>
                        📍 {stk.row_label || 'Pasillo'}
                      </div>
                      <span style={{ color: 'var(--text-muted)' }}>➔</span>
                      <div style={{ background: 'rgba(255, 190, 11, 0.2)', color: 'var(--warning)', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(255, 190, 11, 0.4)' }}>
                        📦 {stk.position_label || 'Posición'}
                      </div>
                      {stk.shelf_label && (
                        <>
                          <span style={{ color: 'var(--text-muted)' }}>➔</span>
                          <div style={{ background: 'rgba(241, 245, 249, 0.1)', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: '8px' }}>
                            {stk.shelf_label}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* BOTONES TÁCTILES RÁPIDOS PARA ESTE MATERIAL */}
                  <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => onOpenOperations('TRASLADO', stk)}
                      style={{ padding: '0.6rem 1.2rem', fontWeight: 700 }}
                    >
                      <ArrowRightLeft size={18} color="var(--primary)" />
                      <span>Mover a otra Posición</span>
                    </button>

                    <button 
                      className="btn btn-danger"
                      onClick={() => onOpenOperations('SALIDA', stk)}
                      style={{ padding: '0.6rem 1.2rem', fontWeight: 700 }}
                    >
                      <MinusCircle size={18} />
                      <span>Sacar Unidades</span>
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>

        </div>
      )}

    </div>
  );
}
