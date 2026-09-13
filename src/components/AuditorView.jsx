import React, { useState, useMemo } from 'react';
import { 
  ClipboardCheck, 
  Printer, 
  Download, 
  Filter, 
  Search, 
  Building, 
  Calendar, 
  Tag, 
  CheckCircle 
} from 'lucide-react';

export default function AuditorView({ materials = [], locations = [], stock = [] }) {
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [selectedMaterial, setSelectedMaterial] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Stock enriquecido para auditoría
  const auditRows = useMemo(() => {
    return stock.map(stk => {
      const mat = materials.find(m => m.id === stk.material_id) || stk.material || {};
      const loc = locations.find(l => l.id === stk.location_id) || stk.location || {};
      return {
        ...stk,
        materialName: mat.name || 'Sin Nombre',
        materialSku: mat.sku || 'N/A',
        materialUnit: mat.unit || 'Uds',
        locationName: loc.name || 'Sin Ubicación',
        locationType: loc.type || 'Nave',
        coords: `${stk.row_label || ''} / ${stk.position_label || ''} ${stk.shelf_label ? `(${stk.shelf_label})` : ''}`
      };
    });
  }, [stock, materials, locations]);

  // Filtrado dinámico
  const filteredAuditRows = useMemo(() => {
    return auditRows.filter(row => {
      const matchesLoc = selectedLocation === 'ALL' || row.location_id === selectedLocation;
      const matchesMat = selectedMaterial === 'ALL' || row.material_id === selectedMaterial;
      const term = searchTerm.toLowerCase().trim();
      const matchesText = !term || 
        row.materialName.toLowerCase().includes(term) || 
        row.materialSku.toLowerCase().includes(term) || 
        row.batch_number.toLowerCase().includes(term) ||
        row.locationName.toLowerCase().includes(term);

      return matchesLoc && matchesMat && matchesText;
    });
  }, [auditRows, selectedLocation, selectedMaterial, searchTerm]);

  // Exportar a CSV
  const exportToCSV = () => {
    const headers = ['SKU', 'Material', 'Ubicacion', 'Tipo', 'Coordenadas', 'Cantidad', 'Unidad', 'Lote', 'Fecha Fabricacion', 'Fecha Entrada', 'Fecha Caducidad'];
    const rows = filteredAuditRows.map(r => [
      `"${r.materialSku}"`,
      `"${r.materialName}"`,
      `"${r.locationName}"`,
      `"${r.locationType}"`,
      `"${r.coords}"`,
      r.quantity,
      `"${r.materialUnit}"`,
      `"${r.batch_number}"`,
      `"${r.mfd_date || ''}"`,
      `"${r.entry_date || ''}"`,
      `"${r.exp_date || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Informe_Auditoria_Almacen_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Banner Auditoría */}
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(28, 37, 65, 0.9) 0%, rgba(58, 134, 255, 0.15) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(0, 245, 212, 0.2)', padding: '0.8rem', borderRadius: '12px', color: 'var(--secondary)' }}>
              <ClipboardCheck size={32} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Informe de Auditoría y Verificación de Stock</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Vista detallada para inspecciones externas, desglose de lotes y localización por zonas del almacén.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <button className="btn btn-secondary" onClick={exportToCSV}>
              <Download size={16} color="var(--secondary)" />
              <span>Exportar Excel / CSV</span>
            </button>
            <button className="btn btn-primary" onClick={handlePrint}>
              <Printer size={16} />
              <span>Imprimir Informe</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filtros Auditoría */}
      <div className="glass-card" style={{ padding: '1.2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          
          <div>
            <label className="form-label">Filtrar por Zona / Sitio</label>
            <select className="form-select" value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
              <option value="ALL">Todas las Ubicaciones ({locations.length})</option>
              {locations.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Filtrar por Material Específico</label>
            <select className="form-select" value={selectedMaterial} onChange={(e) => setSelectedMaterial(e.target.value)}>
              <option value="ALL">Todos los Materiales ({materials.length})</option>
              {materials.map(m => (
                <option key={m.id} value={m.id}>{m.sku} - {m.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Búsqueda rápida auditoría</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Buscar por lote, SKU o posición..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

        </div>
      </div>

      {/* Tabla Imprimible de Auditoría */}
      <div className="glass-card" style={{ padding: '1rem' }}>
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Material</th>
                <th>Ubicación Almacén</th>
                <th>Coordenadas (Fila/Pos)</th>
                <th>Cantidad</th>
                <th>Nº de Lote</th>
                <th>Fecha Fab.</th>
                <th>Fecha Entrada</th>
              </tr>
            </thead>
            <tbody>
              {filteredAuditRows.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No hay registros de inventario que coincidan con la selección de auditoría.
                  </td>
                </tr>
              ) : (
                filteredAuditRows.map(row => (
                  <tr key={row.id}>
                    <td>
                      <span className="badge badge-general">{row.materialSku}</span>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--text-main)' }}>{row.materialName}</strong>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Building size={14} color="var(--primary)" />
                        <span>{row.locationName}</span>
                      </div>
                    </td>
                    <td>
                      <code style={{ background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: 'var(--secondary)' }}>
                        {row.coords}
                      </code>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--secondary)', fontSize: '1.05rem' }}>{row.quantity}</strong>{' '}
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{row.materialUnit}</span>
                    </td>
                    <td>
                      <span className="badge badge-carpa">
                        <Tag size={11} style={{ marginRight: '3px' }} />
                        {row.batch_number}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {row.mfd_date || '-'}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {row.entry_date || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', padding: '0.5rem 0.5rem 0', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
          <div>Mostrando <strong>{filteredAuditRows.length}</strong> posiciones de stock registradas.</div>
          <div>Verificación de recuento inventariado</div>
        </div>
      </div>

    </div>
  );
}
