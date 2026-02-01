/**
 * Panel de Coordinador
 * Gestión de incidencias durante ferias
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import IncidentReportForm from '../components/IncidentReportForm';
import HelpButton from '../components/HelpButton';
import './CoordinatorPanelPage.css';

export default function CoordinatorPanelPage() {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (data: any) => {
    console.log('Incident reported:', data);
    setShowForm(false);
  };

  return (
    <div className="coordinator-panel-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span className="page-icon">🛡️</span>
            {t('pages.coordinatorPanel.title')}
          </h1>
          <p className="page-description">{t('pages.coordinatorPanel.description')}</p>
        </div>
        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            ⚠️ {t('incidentReport.reportButton')}
          </button>
        )}
      </div>

      {showForm ? (
        <div className="coordinator-content">
          <IncidentReportForm
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        </div>
      ) : (
        <div className="coordinator-info">
          <div className="info-card">
            <h2>📋 {t('pages.coordinatorPanel.features.title')}</h2>
            <ul>
              <li>⚠️ {t('pages.coordinatorPanel.features.incidents')}</li>
              <li>📸 {t('pages.coordinatorPanel.features.photos')}</li>
              <li>🚨 {t('pages.coordinatorPanel.features.priority')}</li>
              <li>📊 {t('pages.coordinatorPanel.features.tracking')}</li>
            </ul>
          </div>

          <div className="quick-action-card">
            <h3>⚡ {t('pages.coordinatorPanel.quickAction')}</h3>
            <p>{t('pages.coordinatorPanel.quickActionDesc')}</p>
            <button className="btn btn-primary btn-large" onClick={() => setShowForm(true)}>
              {t('incidentReport.reportButton')}
            </button>
          </div>
        </div>
      )}

      <HelpButton pageKey="coordinatorPanel" />
    </div>
  );
}
