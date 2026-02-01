/**
 * Página de Transporte
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import HelpButton from '../components/HelpButton';
import './TransportPage.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface TransportRoute {
  route_id?: number;
  fair_id: number;
  registration_id: number;
  pickup_location: string;
  pickup_date: string;
  delivery_date: string;
  vehicle_type: string;
  driver_name: string;
  driver_phone: string;
  status: string;
}

export default function TransportPage() {
  const { t } = useTranslation();
  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/transport`);
      
      if (response.ok) {
        const data = await response.json();
        setRoutes(data);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al cargar rutas');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="transport-page">
        <div className="loading">⏳ Cargando rutas de transporte...</div>
      </div>
    );
  }
  
  return (
    <div className="transport-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span className="page-icon">🚚</span>
            {t('pages.transport.title')}
          </h1>
          <p className="page-description">{t('pages.transport.description')}</p>
        </div>
      </div>

      {error ? (
        <div className="info-card warning">
          <h2>⚠️ {error}</h2>
          <p>
            La tabla de transporte aún no existe en la base de datos. 
            Para habilitarla, se debe crear la tabla <code>transport_routes</code>.
          </p>
          <p>Características que incluirá:</p>
          <ul>
            <li>Rutas de transporte por feria</li>
            <li>Asignación de vehículos y conductores</li>
            <li>Seguimiento de estado</li>
            <li>Costos de transporte</li>
          </ul>
        </div>
      ) : (
        <div className="routes-list">
          {routes.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🚚</span>
              <h3>No hay rutas de transporte registradas</h3>
              <p>Agrega rutas para gestionar la logística</p>
            </div>
          ) : (
            routes.map((route) => (
              <div key={route.route_id} className="route-card">
                <h3>Ruta #{route.route_id}</h3>
                <p><strong>Recogida:</strong> {route.pickup_location}</p>
                <p><strong>Fecha:</strong> {new Date(route.pickup_date).toLocaleDateString('es-PE')}</p>
                <p><strong>Conductor:</strong> {route.driver_name} ({route.driver_phone})</p>
                <p><strong>Estado:</strong> <span className={`status-${route.status}`}>{route.status}</span></p>
              </div>
            ))
          )}
        </div>
      )}

      <HelpButton pageKey="transport" />
    </div>
  );
}
