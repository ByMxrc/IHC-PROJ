/**
 * Página de Transporte
 */

import { useTranslation } from 'react-i18next';
import './TransportPage.css';

export default function TransportPage() {
  const { t } = useTranslation();
  
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

      <div className="info-card">
        <h2>🚧 En Desarrollo</h2>
        <p>
          El módulo de logística de transporte está en desarrollo. Permitirá gestionar:
        </p>
        <ul>
          <li>Rutas de transporte</li>
          <li>Asignación de vehículos</li>
          <li>Seguimiento en tiempo real</li>
          <li>Costos de transporte</li>
        </ul>
      </div>
    </div>
  );
}
