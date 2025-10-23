/**
 * Página de Inscripciones
 */

import { useState } from 'react';
import FairRegistrationForm from '../components/FairRegistrationForm';
import './RegistrationsPage.css';

export default function RegistrationsPage() {
  const [showForm, setShowForm] = useState(false);

  // Datos de ejemplo
  const producers = [
    { id: '1', name: 'Juan', lastName: 'Pérez García' },
    { id: '2', name: 'María', lastName: 'López Torres' },
  ];

  const fairs = [
    {
      id: '1',
      name: 'Feria Agroproductiva de Primavera',
      startDate: new Date('2025-11-01'),
      currentCapacity: 12,
      maxCapacity: 50,
    },
  ];

  const handleSubmit = (data: any) => {
    console.log('Inscripción:', data);
    setShowForm(false);
    alert('✅ Inscripción registrada exitosamente');
  };

  return (
    <div className="registrations-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span className="page-icon">📝</span>
            Inscripciones a Ferias
          </h1>
          <p className="page-description">Gestión de inscripciones de productores a ferias</p>
        </div>
        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Nueva Inscripción
          </button>
        )}
      </div>

      {showForm ? (
        <FairRegistrationForm
          producers={producers}
          fairs={fairs}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h2>No hay inscripciones registradas</h2>
          <p>Haga clic en "Nueva Inscripción" para comenzar</p>
        </div>
      )}
    </div>
  );
}
