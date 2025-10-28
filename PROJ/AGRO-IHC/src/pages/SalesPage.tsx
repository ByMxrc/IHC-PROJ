/**
 * Página de Ventas
 */

import { useTranslation } from 'react-i18next';
import './SalesPage.css';

export default function SalesPage() {
  const { t } = useTranslation();
  
  return (
    <div className="sales-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span className="page-icon">💰</span>
            {t('pages.sales.title')}
          </h1>
          <p className="page-description">{t('pages.sales.description')}</p>
        </div>
      </div>

      <div className="info-card">
        <h2>🚧 En Desarrollo</h2>
        <p>
          El módulo de comercialización permitirá registrar y analizar las ventas realizadas en cada feria.
        </p>
      </div>
    </div>
  );
}
