import React, { useState } from 'react';
import { X, UserCheck, Shield, Key, Database, UserPlus } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

export default function AuthModal({ isOpen, onClose, activeUser, onSelectUser }) {
  if (!isOpen) return null;

  const [customName, setCustomName] = useState('');
  const [customRole, setCustomRole] = useState('Operario Almacén');

  const presetUsers = [
    { name: 'Carlos Enguí', email: 'carlos@empresa.com', role: 'Administrador Almacén' },
    { name: 'Juan Pérez', email: 'juan.perez@empresa.com', role: 'Operario Almacén' },
    { name: 'María López', email: 'maria.lopez@empresa.com', role: 'Responsable Compras' },
    { name: 'Auditor Externo', email: 'auditoria@calidad.org', role: 'Auditor de Calidad' }
  ];

  const handleCustomUserSubmit = (e) => {
    e.preventDefault();
    if (!customName) return;
    onSelectUser({
      name: customName,
      email: `${customName.toLowerCase().replace(/\s+/g, '.')}@empresa.com`,
      role: customRole
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', paddingBottom: '0.8rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Shield size={24} color="var(--secondary)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Sesión de Usuario Operario</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ background: 'rgba(58, 134, 255, 0.1)', padding: '1rem', borderRadius: '10px', marginBottom: '1.2rem', border: '1px solid rgba(58, 134, 255, 0.25)' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Usuario Activo Registrando Movimientos:</div>
          <strong style={{ fontSize: '1.1rem', color: 'var(--secondary)' }}>{activeUser?.name}</strong>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
            Rol: {activeUser?.role} ({activeUser?.email})
          </div>
        </div>

        {/* Selección Rápida de Perfiles */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
            Seleccionar Operario Habitual
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {presetUsers.map((u, idx) => (
              <button
                key={idx}
                className="btn btn-secondary"
                onClick={() => { onSelectUser(u); onClose(); }}
                style={{
                  justifyContent: 'space-between',
                  background: activeUser?.name === u.name ? 'rgba(0, 245, 212, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                  borderColor: activeUser?.name === u.name ? 'var(--secondary)' : 'var(--border-color)'
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{u.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.role}</div>
                </div>
                {activeUser?.name === u.name && <UserCheck size={18} color="var(--secondary)" />}
              </button>
            ))}
          </div>
        </div>

        {/* Crear o escribir nombre de usuario personalizado */}
        <form onSubmit={handleCustomUserSubmit} style={{ paddingTop: '1rem', borderTop: '1px dashed var(--border-color)' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
            Ingresar Nuevo Nombre de Usuario
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Nombre y Apellidos"
              value={customName}
              onChange={e => setCustomName(e.target.value)}
              required
            />
            <select className="form-select" value={customRole} onChange={e => setCustomRole(e.target.value)}>
              <option value="Operario Almacén">Operario Almacén</option>
              <option value="Administrador Almacén">Administrador Almacén</option>
              <option value="Jefe de Turno">Jefe de Turno</option>
              <option value="Auditor de Calidad">Auditor de Calidad</option>
            </select>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <UserPlus size={16} /> Cambiar Usuario Activo
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
