import React from 'react';
import { 
  Truck,
  Grid,
  PackageSearch, 
  ClipboardCheck, 
  MapPin, 
  History, 
  PlusCircle, 
  Database, 
  User, 
  Layers 
} from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  activeUser, 
  onOpenAuthModal, 
  onOpenOperationsModal 
}) {
  const hasSupabase = isSupabaseConfigured();

  const navItems = [
    { id: 'operator', label: '🚜 Modo Maquinista (Táctil)', icon: Truck, isHighlight: true },
    { id: 'map', label: '🗺️ Plano 2D Almacén', icon: Grid },
    { id: 'search', label: '🔎 Buscador General', icon: PackageSearch },
    { id: 'auditor', label: '📋 Vista Auditoría', icon: ClipboardCheck },
    { id: 'locations', label: '⚙️ Ubicaciones', icon: MapPin },
    { id: 'history', label: '📜 Historial', icon: History }
  ];

  return (
    <header className="glass-card" style={{ borderRadius: '0 0 16px 16px', marginBottom: '1.5rem', padding: '1rem 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Logo & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #3a86ff 0%, #00f5d4 100%)',
            padding: '0.65rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(58, 134, 255, 0.4)'
          }}>
            <Layers size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0, background: 'linear-gradient(90deg, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Busca Material
              </h1>
              <span className={`badge ${hasSupabase ? 'badge-nave' : 'badge-carpa'}`} style={{ fontSize: '0.68rem' }}>
                <Database size={10} style={{ marginRight: '3px' }} />
                {hasSupabase ? 'Supabase Sync' : 'Local Storage Demo'}
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              Control Inteligente de Ubicaciones, Lotes y Trazabilidad
            </p>
          </div>
        </div>

        {/* Action Buttons & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <button 
            className="btn btn-success" 
            onClick={() => onOpenOperationsModal('ENTRADA')}
            style={{ fontWeight: '700' }}
          >
            <PlusCircle size={18} />
            <span>Operación de Stock</span>
          </button>

          {/* User Profile Trigger */}
          <button 
            className="btn btn-secondary" 
            onClick={onOpenAuthModal}
            title="Cambiar de usuario o ver sesión"
            style={{ padding: '0.5rem 0.9rem' }}
          >
            <User size={16} color="var(--secondary)" />
            <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: '700' }}>{activeUser?.name || 'Usuario'}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{activeUser?.role || 'Operario'}</div>
            </div>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <nav style={{ display: 'flex', gap: '0.5rem', marginTop: '1.2rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isHighlight = item.isHighlight;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="btn"
              style={{
                background: isActive 
                  ? (isHighlight 
                      ? 'linear-gradient(135deg, #00f5d4 0%, #3a86ff 100%)' 
                      : 'linear-gradient(135deg, rgba(58, 134, 255, 0.25) 0%, rgba(0, 245, 212, 0.15) 100%)') 
                  : (isHighlight ? 'rgba(0, 245, 212, 0.12)' : 'transparent'),
                color: isActive 
                  ? (isHighlight ? '#0b132b' : 'var(--secondary)') 
                  : (isHighlight ? 'var(--secondary)' : 'var(--text-muted)'),
                border: isActive 
                  ? (isHighlight ? '1px solid #00f5d4' : '1px solid var(--secondary)') 
                  : (isHighlight ? '1px dashed rgba(0, 245, 212, 0.5)' : '1px solid transparent'),
                borderRadius: '10px',
                padding: '0.6rem 1.1rem',
                fontSize: '0.88rem',
                fontWeight: isActive || isHighlight ? '800' : '500',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                boxShadow: isHighlight && isActive ? '0 0 15px rgba(0, 245, 212, 0.4)' : 'none'
              }}
            >
              <Icon size={17} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Navigation Bar Sticky Bottom para Dispositivos Móviles */}
      <div className="mobile-bottom-bar">
        <button 
          onClick={() => setActiveTab('operator')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'operator' ? 'var(--secondary)' : 'var(--text-muted)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            fontSize: '0.7rem',
            fontWeight: activeTab === 'operator' ? '800' : '500',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <Truck size={22} color={activeTab === 'operator' ? 'var(--secondary)' : 'var(--text-muted)'} />
          <span>Maquinista</span>
        </button>

        <button 
          onClick={() => setActiveTab('map')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'map' ? 'var(--secondary)' : 'var(--text-muted)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            fontSize: '0.7rem',
            fontWeight: activeTab === 'map' ? '800' : '500',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <Grid size={22} color={activeTab === 'map' ? 'var(--secondary)' : 'var(--text-muted)'} />
          <span>Plano 2D</span>
        </button>

        <button 
          onClick={() => onOpenOperationsModal('ENTRADA')}
          style={{
            background: 'linear-gradient(135deg, #38b000 0%, #15803d 100%)',
            border: 'none',
            borderRadius: '50%',
            width: '46px',
            height: '46px',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(56, 176, 0, 0.5)',
            transform: 'translateY(-10px)',
            cursor: 'pointer'
          }}
        >
          <PlusCircle size={26} />
        </button>

        <button 
          onClick={() => setActiveTab('search')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'search' ? 'var(--secondary)' : 'var(--text-muted)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            fontSize: '0.7rem',
            fontWeight: activeTab === 'search' ? '800' : '500',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <PackageSearch size={22} color={activeTab === 'search' ? 'var(--secondary)' : 'var(--text-muted)'} />
          <span>Buscador</span>
        </button>

        <button 
          onClick={() => setActiveTab('locations')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'locations' ? 'var(--secondary)' : 'var(--text-muted)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            fontSize: '0.7rem',
            fontWeight: activeTab === 'locations' ? '800' : '500',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <MapPin size={22} color={activeTab === 'locations' ? 'var(--secondary)' : 'var(--text-muted)'} />
          <span>Zonas</span>
        </button>
      </div>

    </header>
  );
}
