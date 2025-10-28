/**
 * Página de Gestión de Ferias
 */

import { useState } from 'react';
import type { Fair } from '../types';
import { useTranslation } from 'react-i18next';
import FairForm from '../components/FairForm';
import './FairsPage.css';

export default function FairsPage() {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [fairs, setFairs] = useState<Fair[]>([
    {
      id: '1',
      name: 'Feria Agroproductiva de Primavera 2025',
      description: 'Gran feria de productos agrícolas de temporada en la ciudad de Cuenca',
      location: 'Parque Central de Cuenca',
      address: 'Calle Gran Colombia y Benigno Malo',
      startDate: new Date('2025-11-01'),
      endDate: new Date('2025-11-03'),
      maxCapacity: 50,
      currentCapacity: 12,
      status: 'scheduled',
      productCategories: ['Frutas', 'Verduras', 'Hortalizas'],
      requirements: ['Certificado sanitario', 'RUC o RISE', 'Permiso municipal'],
    },
  ]);

  const handleSubmit = (fairData: Omit<Fair, 'id' | 'currentCapacity'>) => {
    const newFair: Fair = {
      ...fairData,
      id: Date.now().toString(),
      currentCapacity: 0,
    };
    setFairs([...fairs, newFair]);
    setShowForm(false);
    alert('✅ Feria creada exitosamente');
  };

  return (
    <div className="fairs-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span className="page-icon">🎪</span>
            {t('pages.fairs.title')}
          </h1>
          <p className="page-description">{t('pages.fairs.description')}</p>
        </div>
        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            {t('tables.stats.newFair')}
          </button>
        )}
      </div>

      {showForm ? (
        <FairForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
      ) : (
        <div className="fairs-grid">
          {fairs.map((fair) => (
            <div key={fair.id} className="fair-card">
              <div className="fair-header">
                <h3 className="fair-name">{fair.name}</h3>
                <span className={`fair-status status-${fair.status}`}>
                  {fair.status === 'scheduled' && `📅 ${t('forms.fair.scheduled')}`}
                  {fair.status === 'in-progress' && `🎪 ${t('forms.fair.inProgress')}`}
                  {fair.status === 'completed' && `✅ ${t('forms.fair.completed')}`}
                  {fair.status === 'cancelled' && `❌ ${t('forms.fair.cancelled')}`}
                </span>
              </div>
              <p className="fair-description">{fair.description}</p>
              <div className="fair-details">
                <div className="detail-item">
                  <strong>📍 {t('tables.fair.location')}:</strong> {fair.location}
                </div>
                <div className="detail-item">
                  <strong>📅 {t('tables.fair.dates')}:</strong>{' '}
                  {new Date(fair.startDate).toLocaleDateString('es-PE')} -{' '}
                  {new Date(fair.endDate).toLocaleDateString('es-PE')}
                </div>
                <div className="detail-item">
                  <strong>👥 {t('tables.fair.capacity')}:</strong> {fair.currentCapacity}/{fair.maxCapacity} stands
                </div>
                <div className="detail-item">
                  <strong>🏷️ {t('forms.fair.productCategories')}:</strong>
                  <div className="categories-tags">
                    {fair.productCategories.map((cat) => (
                      <span key={cat} className="category-tag">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
