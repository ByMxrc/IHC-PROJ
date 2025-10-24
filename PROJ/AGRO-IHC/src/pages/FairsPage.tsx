/**
 * Página de Gestión de Ferias
 */

import { useState } from 'react';
import type { Fair } from '../types';
import FairForm from '../components/FairForm';
import './FairsPage.css';

export default function FairsPage() {
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
            Gestión de Ferias
          </h1>
          <p className="page-description">Calendario y gestión de ferias agroproductivas</p>
        </div>
        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Nueva Feria
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
                  {fair.status === 'scheduled' && '📅 Programada'}
                  {fair.status === 'in-progress' && '🎪 En curso'}
                  {fair.status === 'completed' && '✅ Completada'}
                  {fair.status === 'cancelled' && '❌ Cancelada'}
                </span>
              </div>
              <p className="fair-description">{fair.description}</p>
              <div className="fair-details">
                <div className="detail-item">
                  <strong>📍 Ubicación:</strong> {fair.location}
                </div>
                <div className="detail-item">
                  <strong>📅 Fecha:</strong>{' '}
                  {new Date(fair.startDate).toLocaleDateString('es-PE')} -{' '}
                  {new Date(fair.endDate).toLocaleDateString('es-PE')}
                </div>
                <div className="detail-item">
                  <strong>👥 Capacidad:</strong> {fair.currentCapacity}/{fair.maxCapacity} stands
                </div>
                <div className="detail-item">
                  <strong>🏷️ Categorías:</strong>
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
