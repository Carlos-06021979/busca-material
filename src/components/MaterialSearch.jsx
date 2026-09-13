import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Package, 
  MapPin, 
  Calendar, 
  Tag, 
  ArrowRightLeft, 
  MinusCircle, 
  PlusCircle, 
  AlertTriangle,
  Boxes,
  CheckCircle2
} from 'lucide-react';

export default function MaterialSearch({ 
  materials = [], 
  locations = [], 
  stock = [], 
  onOpenOperations 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Categorías únicas
  const categories = useMemo(() => {
    const set = new Set(materials.map(m => m.category).filter(Boolean));
    return ['ALL', ...Array.from(set)];
  }, [materials]);

  // Mapear stock enriquecido con material y ubicación
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

  // Filtrado de materiales
  const filteredMaterials = useMemo(() => {
    return materials.filter(mat => {
      // Búsqueda por texto (nombre, SKU o lote)
      const term = searchTerm.toLowerCase().trim();
      const matchesText = !term || 
        (mat.name && mat.name.toLowerCase().includes(term)) ||
        (mat.sku && mat.sku.toLowerCase().includes(term)) ||
        enrichedStock.some(s => s.material_id === mat.id && s.batch_number && s.batch_number.toLowerCase().includes(term));

      // Filtro por categoría
      const matchesCategory = selectedCategory === 'ALL' || mat.category === selectedCategory;

      // Filtro por ubicación
      const matchesLoc = selectedLocation === 'ALL' || enrichedStock.some(s => s.material_id === mat.id && s.location_id === selectedLocation);

      return matchesText && matchesCategory && matchesLoc;
    });
  }, [materials, enrichedStock, searchTerm, selectedCategory, selectedLocation]);

  // Cálculos estadísticos
  const totalStockQuantity = useMemo(() => {
    return enrichedStock.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0);
  }, [enrichedStock]);

  const getLocationBadgeClass = (type) => {
    switch (type?.toLowerCase()) {
      case 'nave': return 'badge-nave';
      case 'altillo': return 'badge-altillo';
      case 'carpa': return 'badge-carpa';
      case 'patio': return 'badge-patio';
      default: return 'badge-general';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Tarjetas de Métricas Rápidas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem' }}>
          <div style={{ background: 'rgba(58, 134, 255, 0.15)', padding: '0.8rem', borderRadius: '12px', color: 'var(--primary)' }}>
            <Boxes size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Materiales</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{materials.length} <span style={{ fontSize: '0.85rem', fontWeight: 400 }}>tipos</span></div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem' }}>
          <div style={{ background: 'rgba(0, 245, 212, 0.15)', padding: '0.8rem', borderRadius: '12px', color: 'var(--secondary)' }}>
            <Package size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Stock Total Acumulado</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--secondary)' }}>{totalStockQuantity.toLocaleString('es-ES')}</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem' }}>
          <div style={{ background: 'rgba(255, 190, 11, 0.15)', padding: '0.8rem', borderRadius: '12px', color: 'var(--warning)' }}>
            <MapPin size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Zonas de Almacén</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{locations.length} <span style={{ fontSize: '0.85rem', fontWeight: 400 }}>ubicaciones</span></div>
          </div>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros Avanzados */}
      <div className="glass-card" style={{ padding: '1.2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'center' }}>
          
          {/* Input Principal con icono */}
          <div style={{ gridColumn: 'span 2', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Escribe para buscar material, código SKU o Nº de lote (Ej: Cable, MAT-001, LOTE-2026)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.8rem', fontSize: '1.05rem', background: '#0e1738', borderColor: 'rgba(58, 134, 255, 0.3)' }}
            />
          </div>

          {/* Filtro por Ubicación */}
          <div>
            <select 
              className="form-select" 
              value={selectedLocation} 
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="ALL">📍 Todas las Ubicaciones (Naves, Carpas...)</option>
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} ({loc.type})
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Categoría */}
          <div>
            <select 
              className="form-select" 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="ALL">🏷️ Todas las Categorías</option>
              {categories.filter(c => c !== 'ALL').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Resultados de Materiales y Posiciones */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        {filteredMaterials.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
            <AlertTriangle size={42} style={{ marginBottom: '1rem', opacity: 0.6 }} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>No se encontraron materiales</h3>
            <p style={{ fontSize: '0.9rem' }}>Intenta ajustar el término de búsqueda o limpia los filtros seleccionados.</p>
          </div>
        ) : (
          filteredMaterials.map(material => {
            // Obtener registros de stock de este material
            const materialStockItems = enrichedStock.filter(s => s.material_id === material.id);
            const totalMatQty = materialStockItems.reduce((acc, curr) => acc + (parseFloat(curr.quantity) || 0), 0);
            const isLowStock = material.min_stock && totalMatQty <= material.min_stock;

            return (
              <div key={material.id} className="glass-card" style={{ padding: '1.5rem', borderLeft: isLowStock ? '4px solid var(--danger)' : '4px solid var(--primary)' }}>
                
                {/* Cabecera del Material */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem', paddingBottom: '0.8rem', borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{material.name}</h2>
                      <span className="badge badge-general" style={{ fontSize: '0.75rem' }}>{material.sku}</span>
                      {material.category && <span className="badge badge-nave">{material.category}</span>}
                    </div>
                    {material.description && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        {material.description}
                      </p>
                    )}
                  </div>

                  {/* Badges de Stock Total */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Stock Total</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: totalMatQty > 0 ? 'var(--secondary)' : 'var(--danger)' }}>
                      {totalMatQty} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-main)' }}>{material.unit || 'Unidades'}</span>
                    </div>
                    {isLowStock && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                        <AlertTriangle size={12} /> Stock por debajo del mínimo ({material.min_stock})
                      </div>
                    )}
                  </div>
                </div>

                {/* Lista de Ubicaciones Físicas donde se encuentra el material */}
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={14} color="var(--primary)" />
                    Ubicaciones físicas exactas ({materialStockItems.length} registros)
                  </div>

                  {materialStockItems.length === 0 ? (
                    <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '0.8rem 1rem', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      ⚠️ Este material no está ubicado en ninguna zona del almacén actualmente.
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0.8rem' }}>
                      {materialStockItems.map(stk => (
                        <div 
                          key={stk.id} 
                          style={{
                            background: 'rgba(15, 23, 42, 0.65)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '10px',
                            padding: '1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            justify: 'space-between',
                            gap: '0.8rem'
                          }}
                        >
                          <div>
                            {/* Nombre Ubicación y Tipo */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                              <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>
                                {stk.location?.name || 'Ubicación Almacén'}
                              </strong>
                              <span className={`badge ${getLocationBadgeClass(stk.location?.type)}`}>
                                {stk.location?.type || 'Zona'}
                              </span>
                            </div>

                            {/* Detalle Coordenadas Fila / Posición / Estantería */}
                            <div style={{ fontSize: '0.88rem', color: 'var(--secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                              📍 {stk.row_label || 'Fila'} — {stk.position_label || 'Posición'}
                              {stk.shelf_label && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({stk.shelf_label})</span>}
                            </div>

                            {/* Datos de Lote y Fechas */}
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Tag size={12} color="var(--warning)" />
                                <span>Lote: <strong style={{ color: 'var(--text-main)' }}>{stk.batch_number}</strong></span>
                              </div>
                              {stk.mfd_date && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                  <Calendar size={12} />
                                  <span>Fabricación: {stk.mfd_date}</span>
                                </div>
                              )}
                              {stk.entry_date && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                  <Calendar size={12} />
                                  <span>Entrada: {stk.entry_date}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Cantidad en este Sitio y Botones de Acción */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.6rem', borderTop: '1px dashed rgba(255, 255, 255, 0.08)' }}>
                            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                              {stk.quantity} <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)' }}>{material.unit}</span>
                            </div>

                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                              <button 
                                className="btn btn-secondary btn-sm"
                                title="Intercambiar / Trasladar a otra posición"
                                onClick={() => onOpenOperations('TRASLADO', stk)}
                                style={{ padding: '0.35rem 0.65rem' }}
                              >
                                <ArrowRightLeft size={14} color="var(--primary)" />
                                <span style={{ fontSize: '0.75rem' }}>Trasladar</span>
                              </button>

                              <button 
                                className="btn btn-danger btn-sm"
                                title="Registrar Salida de esta ubicación"
                                onClick={() => onOpenOperations('SALIDA', stk)}
                                style={{ padding: '0.35rem 0.65rem' }}
                              >
                                <MinusCircle size={14} />
                                <span style={{ fontSize: '0.75rem' }}>Salida</span>
                              </button>
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
