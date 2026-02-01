/**
 * Página de Inscripciones
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import FairRegistrationForm from '../components/FairRegistrationForm';
import HelpButton from '../components/HelpButton';
import './RegistrationsPage.css';

export default function RegistrationsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [producers, setProducers] = useState<any[]>([]);
  const [fairs, setFairs] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Cargar productores
      const prodResponse = await fetch('http://localhost:3001/api/producers');
      if (prodResponse.ok) {
        const prodResult = await prodResponse.json();
        const prodData = prodResult.data || [];
        setProducers(prodData.map((p: any) => ({
          id: p.producer_id?.toString() || p.id,
          name: p.name || p.first_name || '',
          lastName: p.last_name || ''
        })));
      }
      
      // Cargar ferias
      const fairResponse = await fetch('http://localhost:3001/api/fairs');
      if (fairResponse.ok) {
        const fairResult = await fairResponse.json();
        const fairData = fairResult.data || [];
        setFairs(fairData.map((f: any) => ({
          id: f.fair_id?.toString() || f.id,
          name: f.name || '',
          startDate: new Date(f.start_date),
          currentCapacity: f.current_registrations || 0,
          maxCapacity: f.max_capacity || 0
        })));
      }

      // Cargar inscripciones
      const regResponse = await fetch('http://localhost:3001/api/registrations');
      if (regResponse.ok) {
        const regResult = await regResponse.json();
        const regData = regResult.data || [];
        setRegistrations(regData);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch('http://localhost:3001/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          producer_id: data.producerId,
          fair_id: data.fairId,
          products_to_sell: data.productsToSell || [],
          estimated_quantity: data.estimatedQuantity,
          status: 'pending'
        })
      });

      if (!response.ok) throw new Error('Error al registrar inscripción');

      await fetchData(); // Recargar datos

      setShowForm(false);
      alert('✅ Inscripción registrada exitosamente en la base de datos');
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al registrar inscripción');
    }
  };

  if (loading) {
    return (
      <div className="registrations-page">
        <div className="loading">⏳ Cargando datos...</div>
      </div>
    );
  }

  return (
    <div className="registrations-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span className="page-icon">📝</span>
            {t('pages.registrations.title')}
          </h1>
          <p className="page-description">{t('pages.registrations.description')}</p>
        </div>
        {!showForm && (user?.role === 'admin' || user?.role === 'coordinator' || user?.role === 'producer') && (
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
      ) : registrations.length > 0 ? (
        <div className="registrations-list">
          <h2>Inscripciones Registradas</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Productor</th>
                  <th>Feria</th>
                  <th>Productos a Vender</th>
                  <th>Cantidad Est.</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg: any) => {
                  const producer = producers.find(p => p.id === reg.producer_id?.toString());
                  const fair = fairs.find(f => f.id === reg.fair_id?.toString());
                  return (
                    <tr key={reg.registration_id}>
                      <td>{reg.registration_id}</td>
                      <td>{producer ? `${producer.name} ${producer.lastName}` : `ID: ${reg.producer_id}`}</td>
                      <td>{fair ? fair.name : `ID: ${reg.fair_id}`}</td>
                      <td>{Array.isArray(reg.products_to_sell) ? reg.products_to_sell.join(', ') : '-'}</td>
                      <td>{reg.estimated_quantity || '-'}</td>
                      <td>
                        <span className={`status-badge status-${reg.status}`}>
                          {reg.status === 'approved' ? '✅ Aprobado' : 
                           reg.status === 'pending' ? '⏳ Pendiente' : 
                           reg.status === 'rejected' ? '❌ Rechazado' : reg.status}
                        </span>
                      </td>
                      <td>{new Date(reg.registration_date).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h2>No hay inscripciones registradas</h2>
          <p>Haga clic en "Nueva Inscripción" para comenzar</p>
        </div>
      )}

      <HelpButton pageKey="registrations" />
    </div>
  );
}
