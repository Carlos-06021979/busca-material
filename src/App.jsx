import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MaterialSearch from './components/MaterialSearch';
import AuditorView from './components/AuditorView';
import LocationManager from './components/LocationManager';
import HistoryLog from './components/HistoryLog';
import StockOperationsModal from './components/StockOperationsModal';
import AuthModal from './components/AuthModal';

import {
  fetchLocations,
  fetchMaterials,
  fetchStock,
  fetchMovements,
  fetchSystemLogs,
  getCurrentUser,
  setCurrentUser,
  saveLocation,
  saveMaterial,
  processStockIn,
  processStockOut,
  processStockTransfer,
  logSystemError
} from './services/store';

export default function App() {
  const [activeTab, setActiveTab] = useState('search');

  // Estado global de la aplicación
  const [locations, setLocations] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [stock, setStock] = useState([]);
  const [movements, setMovements] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  const [activeUser, setActiveUser] = useState(getCurrentUser());

  // Estado de modales
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOperationsModalOpen, setIsOperationsModalOpen] = useState(false);
  const [operationType, setOperationType] = useState('ENTRADA');
  const [selectedStockItem, setSelectedStockItem] = useState(null);

  const [loading, setLoading] = useState(true);

  // Cargar datos al iniciar
  const loadData = async () => {
    try {
      setLoading(true);
      const [locsData, matsData, stockData, movsData, logsData] = await Promise.all([
        fetchLocations(),
        fetchMaterials(),
        fetchStock(),
        fetchMovements(),
        fetchSystemLogs()
      ]);

      setLocations(locsData);
      setMaterials(matsData);
      setStock(stockData);
      setMovements(movsData);
      setSystemLogs(logsData);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      logSystemError('Error al inicializar la aplicación', err, activeUser?.name);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Abrir Modal de Operación
  const handleOpenOperationsModal = (type = 'ENTRADA', stockItem = null) => {
    setOperationType(type);
    setSelectedStockItem(stockItem);
    setIsOperationsModalOpen(true);
  };

  // Handlers para operaciones
  const handleStockIn = async (payload) => {
    await processStockIn(payload, activeUser);
    await loadData();
  };

  const handleStockOut = async (payload) => {
    await processStockOut(payload, activeUser);
    await loadData();
  };

  const handleStockTransfer = async (payload) => {
    await processStockTransfer(payload, activeUser);
    await loadData();
  };

  const handleSaveLocation = async (locData) => {
    await saveLocation(locData);
    await loadData();
  };

  const handleSaveMaterial = async (matData) => {
    const created = await saveMaterial(matData);
    await loadData();
    return created;
  };

  const handleSelectUser = (user) => {
    setCurrentUser(user);
    setActiveUser(user);
  };

  return (
    <div>
      <div className="container">
        
        {/* Navbar con control de pestañas y perfil */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeUser={activeUser}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenOperationsModal={(type) => handleOpenOperationsModal(type, null)}
        />

        {/* Vista principal según pestaña activa */}
        <main style={{ minHeight: '600px' }}>
          {loading ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <div className="animate-pulse-slow" style={{ fontSize: '1.2rem', color: 'var(--secondary)' }}>
                ⚡ Cargando inventario y ubicaciones de almacén...
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'search' && (
                <MaterialSearch
                  materials={materials}
                  locations={locations}
                  stock={stock}
                  onOpenOperations={handleOpenOperationsModal}
                />
              )}

              {activeTab === 'auditor' && (
                <AuditorView
                  materials={materials}
                  locations={locations}
                  stock={stock}
                />
              )}

              {activeTab === 'locations' && (
                <LocationManager
                  locations={locations}
                  stock={stock}
                  onSaveLocation={handleSaveLocation}
                />
              )}

              {activeTab === 'history' && (
                <HistoryLog
                  movements={movements}
                  systemLogs={systemLogs}
                />
              )}
            </>
          )}
        </main>

        {/* Modales */}
        <StockOperationsModal
          isOpen={isOperationsModalOpen}
          onClose={() => setIsOperationsModalOpen(false)}
          operationType={operationType}
          selectedStockItem={selectedStockItem}
          materials={materials}
          locations={locations}
          activeUser={activeUser}
          onStockIn={handleStockIn}
          onStockOut={handleStockOut}
          onStockTransfer={handleStockTransfer}
          onSaveMaterial={handleSaveMaterial}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          activeUser={activeUser}
          onSelectUser={handleSelectUser}
        />

        {/* Footer */}
        <footer style={{ marginTop: '3rem', padding: '1.5rem 0', textTransform: 'uppercase', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)' }}>
          Busca Material v1.0 • Sistema de Ubicación, Lotes y Trazabilidad de Almacén • Nitelmur
        </footer>

      </div>
    </div>
  );
}
