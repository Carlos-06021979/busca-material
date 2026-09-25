import React, { useState } from 'react';
import { Warehouse, MapPin, Package, ArrowRightLeft, PlusCircle, MinusCircle, CheckCircle2, Box } from 'lucide-react';

export default function WarehouseMap({ 
  locations = [], 
  stock = [], 
  materials = [], 
  onSelectSlot, 
  onOpenOperations 
}) {
  const [selectedLocationId, setSelectedLocationId] = useState(locations[0]?.id || '');

  const activeLocation = locations.find(l => l.id === selectedLocationId) || locations[0];

  // Filtrar stock de la ubicación activa
  const locationStock = stock.filter(s => s.location_id === activeLocation?.id);

  // Mapear stock con material
  const enrichedLocationStock = locationStock.map(stk => {
    const mat = materials.find(m => m.id === stk.material_id) || {};
    return { ...stk, material: mat };
  });

  // Generar cuadrícula visual de estanterías/pasillos para la ubicación
  // Filas por defecto: Fila 1, Fila 2, Fila 3, Pasillo 4, Fila 5
  const defaultRows = ['Fila 1', 'Fila 2', 'Fila 3', 'Pasillo 4', 'Fila 5'];
  const defaultPositions = ['Posición A1', 'Posición A2', 'Posición B1', 'Posición B2', 'Posición C1', 'Posición C2'];

  // Agrupar por fila
  const getStockAt = (row, pos) => {
    return enrichedLocationStock.filter(s => {
      const matchRow = (s.row_label || '').toLowerCase().includes(row.toLowerCase().replace('fila ', '').replace('pasillo ', ''));
      const matchPos = (s.position_label || '').toLowerCase().includes(pos.toLowerCase().replace('posición ', '').replace('soporte ', ''));
      return matchRow || matchPos || (s.row_label === row && s.position_label === pos);
    });
  };

  const getZoneBadgeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'nave': return { bg: '#3a86ff', border: '#60a5fa', icon: '🏢' };
      case 'altillo': return { bg: '#00f5d4', border: '#5eead4', icon: '🪜' };
      case 'carpa': return { bg: '#ffbe0b', border: '#fde047', icon: '🎪' };
      case 'patio': return { bg: '#ff007f', border: '#f472b6', icon: '🏞️' };
      default: return { bg: '#94a3b8', border: '#cbd5e1', icon: '📦' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Selector de Zonas del Almacén con formato de Botones Gigantes Táctiles */}
      <div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.6rem', letterSpacing: '0.05em' }}>
          🗺️ Selecciona una Zona o Nave del Almacén para ver las Estanterías en 2D:
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.8rem' }}>
          {locations.map(loc => {
            const isSelected = loc.id === selectedLocationId;
            const style = getZoneBadgeColor(loc.type);
            const itemsCount = stock.filter(s => s.location_id === loc.id).length;

            return (
              <button
                key={loc.id}
                onClick={() => setSelectedLocationId(loc.id)}
                style={{
                  background: isSelected 
                    ? `linear-gradient(135deg, ${style.bg}33 0%, rgba(30, 41, 59, 0.9) 100%)` 
                    : 'rgba(15, 23, 42, 0.6)',
                  border: isSelected ? `2px solid ${style.bg}` : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '14px',
                  padding: '1rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? `0 0 20px ${style.bg}40` : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.5rem' }}>{style.icon}</span>
                  <span className="badge" style={{ background: `${style.bg}22`, color: style.border, border: `1px solid ${style.bg}44` }}>
                    {loc.type}
                  </span>
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: isSelected ? '#ffffff' : 'var(--text-main)' }}>
                  {loc.name}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {itemsCount} huecos con material
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Leyenda de la Cuadrícula */}
      {activeLocation && (
        <div className="glass-card" style={{ padding: '1.2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.2rem', paddingBottom: '0.8rem', borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '1.6rem' }}>{getZoneBadgeColor(activeLocation.type).icon}</span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                  Mapa Gráfico: {activeLocation.name} ({activeLocation.code})
                </h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                {activeLocation.description || 'Haz clic en cualquier estantería o hueco para depositar, mover o sacar material.'}
              </p>
            </div>

            {/* Leyenda de Colores */}
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', background: 'rgba(0,0,0,0.3)', padding: '0.6rem 1rem', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{ width: 14, height: 14, borderRadius: 4, background: '#38b000' }}></div>
                <span>Con Stock</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{ width: 14, height: 14, borderRadius: 4, background: '#ffbe0b' }}></div>
                <span>Stock Bajo</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{ width: 14, height: 14, borderRadius: 4, background: 'rgba(255,255,255,0.08)', border: '1px dashed #64748b' }}></div>
                <span>Hueco Libres</span>
              </div>
            </div>
          </div>

          {/* Renderizado de Racks / Cuadrícula de Estanterías */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {enrichedLocationStock.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                <Package size={40} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', opacity: 0.5 }} />
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>No hay mercancía en {activeLocation.name}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Esta nave o zona está vacía en este momento.
                </p>
                <button 
                  className="btn btn-success"
                  onClick={() => onOpenOperations('ENTRADA', null)}
                >
                  <PlusCircle size={18} /> Meter Primer Material Aquí
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {enrichedLocationStock.map(item => {
                  const isLow = item.material?.min_stock && item.quantity <= item.material.min_stock;
                  return (
                    <div 
                      key={item.id}
                      style={{
                        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)',
                        border: isLow ? '2px solid var(--warning)' : '1px solid var(--secondary)',
                        borderRadius: '14px',
                        padding: '1.1rem',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '0.8rem'
                      }}
                    >
                      <div>
                        {/* Indicadores de Ubicación Exacta */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span className="badge badge-nave" style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}>
                            📍 {item.row_label} • {item.position_label}
                          </span>
                          {item.shelf_label && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {item.shelf_label}
                            </span>
                          )}
                        </div>

                        {/* Nombre del Material y Lote */}
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
                          {item.material?.name || 'Material'}
                        </h4>
                        <div style={{ fontSize: '0.8rem', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                          <Box size={14} /> SKU: {item.material?.sku} | Lote: {item.batch_number}
                        </div>
                      </div>

                      {/* Cantidad y Acciones Directas del Maquinista */}
                      <div style={{ paddingTop: '0.8rem', borderTop: '1px dashed rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>CANTIDAD</div>
                          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--secondary)' }}>
                            {item.quantity} <span style={{ fontSize: '0.8rem', fontWeight: 400, color: '#ffffff' }}>{item.material?.unit}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button 
                            className="btn btn-secondary btn-sm" 
                            style={{ padding: '0.5rem 0.7rem', background: 'rgba(58, 134, 255, 0.2)', color: '#60a5fa' }}
                            title="Mover palet/material a otro sitio"
                            onClick={() => onOpenOperations('TRASLADO', item)}
                          >
                            <ArrowRightLeft size={16} />
                            <span>Mover</span>
                          </button>

                          <button 
                            className="btn btn-danger btn-sm"
                            style={{ padding: '0.5rem 0.7rem' }}
                            title="Sacar unidades de esta ubicación"
                            onClick={() => onOpenOperations('SALIDA', item)}
                          >
                            <MinusCircle size={16} />
                            <span>Sacar</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
