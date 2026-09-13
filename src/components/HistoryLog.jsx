import React, { useState } from 'react';
import { History, AlertTriangle, ArrowRight, User, Calendar, Tag, ShieldAlert } from 'lucide-react';

export default function HistoryLog({ movements = [], systemLogs = [] }) {
  const [subTab, setSubTab] = useState('movements'); // 'movements' | 'logs'
  const [filterType, setFilterType] = useState('ALL');

  const filteredMovements = movements.filter(m => {
    if (filterType === 'ALL') return true;
    return m.movement_type === filterType;
  });

  const getMovementBadgeClass = (type) => {
    switch (type) {
      case 'ENTRADA': return 'badge-entrada';
      case 'SALIDA': return 'badge-salida';
      case 'TRASLADO': return 'badge-traslado';
      default: return 'badge-general';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Subtabs Selector */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className={`btn ${subTab === 'movements' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSubTab('movements')}
          >
            <History size={16} />
            <span>Historial de Movimientos ({movements.length})</span>
          </button>

          <button 
            className={`btn ${subTab === 'logs' ? 'btn-danger' : 'btn-secondary'}`}
            onClick={() => setSubTab('logs')}
          >
            <ShieldAlert size={16} />
            <span>Registro de Fallos / System Logs ({systemLogs.length})</span>
          </button>
        </div>

        {subTab === 'movements' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Filtrar Tipo:</span>
            <select className="form-select" value={filterType} onChange={e => setFilterType(e.target.value)} style={{ width: 'auto', padding: '0.4rem 0.8rem' }}>
              <option value="ALL">Todos los Movimientos</option>
              <option value="ENTRADA">🟢 Entradas</option>
              <option value="SALIDA">🔴 Salidas</option>
              <option value="TRASLADO">🔄 Traslados</option>
            </select>
          </div>
        )}
      </div>

      {/* SUBTAB MOVIMIENTOS */}
      {subTab === 'movements' && (
        <div className="glass-card" style={{ padding: '1rem' }}>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Fecha / Hora</th>
                  <th>Operación</th>
                  <th>Material</th>
                  <th>Origen</th>
                  <th>Destino</th>
                  <th>Lote</th>
                  <th>Cantidad</th>
                  <th>Usuario Operario</th>
                  <th>Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredMovements.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                      No hay registros de movimientos grabados en el historial aún.
                    </td>
                  </tr>
                ) : (
                  filteredMovements.map(mov => (
                    <tr key={mov.id}>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {new Date(mov.created_at).toLocaleString('es-ES')}
                      </td>
                      <td>
                        <span className={`badge ${getMovementBadgeClass(mov.movement_type)}`}>
                          {mov.movement_type}
                        </span>
                      </td>
                      <td>
                        <strong style={{ color: 'var(--text-main)' }}>{mov.material_name}</strong>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>
                        {mov.source_location_name !== '-' ? (
                          <div>
                            <div style={{ fontWeight: 600 }}>{mov.source_location_name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{mov.source_coords}</div>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>-</span>
                        )}
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>
                        {mov.dest_location_name !== '-' ? (
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--secondary)' }}>{mov.dest_location_name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{mov.dest_coords}</div>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>-</span>
                        )}
                      </td>
                      <td>
                        <span className="badge badge-general" style={{ fontSize: '0.72rem' }}>
                          {mov.batch_number}
                        </span>
                      </td>
                      <td>
                        <strong style={{ fontSize: '1.05rem', color: 'var(--secondary)' }}>{mov.quantity}</strong>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                          <User size={13} color="var(--primary)" />
                          <span>{mov.user_name}</span>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {mov.remarks || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB REGISTRO DE FALLOS Y ERRORES */}
      {subTab === 'logs' && (
        <div className="glass-card" style={{ padding: '1.2rem' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--danger)', marginBottom: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} />
            Auditoría de Fallos y Eventos del Sistema (System Logs)
          </div>

          {systemLogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
              🟢 Excelente. No se han detectado errores ni fallos en la aplicación.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {systemLogs.map(log => (
                <div 
                  key={log.id} 
                  style={{
                    background: 'rgba(255, 0, 84, 0.08)',
                    border: '1px solid rgba(255, 0, 84, 0.3)',
                    borderRadius: '10px',
                    padding: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>{new Date(log.created_at).toLocaleString('es-ES')}</span>
                    <span>Usuario: <strong>{log.user_name}</strong></span>
                  </div>
                  <strong style={{ color: '#f87171', fontSize: '0.95rem' }}>{log.message}</strong>
                  {log.details && (
                    <pre style={{ background: '#0a0f24', padding: '0.5rem', borderRadius: '6px', fontSize: '0.78rem', color: '#cbd5e1', marginTop: '0.4rem', overflowX: 'auto' }}>
                      {typeof log.details === 'object' ? JSON.stringify(log.details, null, 2) : log.details}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
