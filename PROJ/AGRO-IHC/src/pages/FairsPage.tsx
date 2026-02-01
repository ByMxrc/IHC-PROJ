/**
 * Página de Gestión de Ferias
 */

import { useState, useEffect } from 'react';
import type { Fair } from '../types';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import FairForm from '../components/FairForm';
import FairRegistrationForm from '../components/FairRegistrationForm';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
import HelpButton from '../components/HelpButton';
import './FairsPage.css';
import FairInfoModal from '../components/FairInfoModal';

export default function FairsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [showRegistration, setShowRegistration] = useState<{ open: boolean; fairId: string | null }>({ open: false, fairId: null });
  const [modalOpen, setModalOpen] = useState(false);
  const [fairs, setFairs] = useState<Fair[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFairs();
  }, []);

  const fetchFairs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/fairs`);
      if (!response.ok) throw new Error('Error al cargar ferias');
      const result = await response.json();
      console.log('API Response:', result);
      
      const fairsData = result.data || [];
      console.log('Fairs Data:', fairsData);
      const mappedFairs = fairsData.map((f: any) => ({
        id: f.fair_id?.toString() || f.id,
        name: f.name || '',
        description: f.description || '',
        location: f.location || '',
        address: f.address || '',
        startDate: new Date(f.start_date),
        endDate: new Date(f.end_date),
        maxCapacity: f.max_capacity || 0,
        currentCapacity: f.current_registrations || 0,
        status: f.status || 'scheduled',
        productCategories: Array.isArray(f.product_categories) ? f.product_categories : (f.product_categories ? JSON.parse(f.product_categories) : []),
        requirements: Array.isArray(f.requirements) ? f.requirements : (f.requirements ? JSON.parse(f.requirements) : []),
      }));
      
      console.log('Mapped Fairs:', mappedFairs);
      setFairs(mappedFairs);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (fairData: Omit<Fair, 'id' | 'currentCapacity'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/fairs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fairData.name,
          description: fairData.description,
          location: fairData.location,
          address: fairData.address,
          start_date: fairData.startDate,
          end_date: fairData.endDate,
          max_capacity: fairData.maxCapacity,
          status: fairData.status,
          product_categories: fairData.productCategories,
          requirements: fairData.requirements
        })
      });

      if (!response.ok) throw new Error('Error al crear feria');

      await fetchFairs();
      setShowForm(false);
      alert('✅ Feria creada exitosamente en la base de datos');
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al crear feria');
    }
  };

  if (loading) {
    return (
      <div className="fairs-page">
        <div className="loading">⏳ Cargando ferias...</div>
      </div>
    );
  }

  console.log('Current State:', { user: user?.role, showForm, fairs: fairs.length });

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
        {!showForm && (user?.role === 'admin' || user?.role === 'coordinator') && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            ➕ Nueva Feria
          </button>
        )}
      </div>

      {/* Productor solo ve la feria a la que está inscrito (simulado: la primera del array) */}
      {user?.role === 'producer' ? (
        <>
          <div className="fairs-grid">
            {fairs.slice(0, 1).map((fair) => (
              <div key={fair.id} className="fair-card" style={{ cursor: 'pointer' }} onClick={() => setModalOpen(true)}>
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
          <FairInfoModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            fair={fairs[0]}
          />
        </>
      ) : showForm && (user?.role === 'admin' || user?.role === 'coordinator') ? (
        <FairForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
      ) : showRegistration.open && showRegistration.fairId ? (
        <FairRegistrationForm
          producers={user ? [{ id: user.id, name: user.fullName || user.username, lastName: '' }] : []}
          fairs={fairs.filter(f => f.id === showRegistration.fairId)}
          onSubmit={() => { setShowRegistration({ open: false, fairId: null }); alert('✅ Inscripción enviada'); }}
          onCancel={() => setShowRegistration({ open: false, fairId: null })}
        />
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

      <HelpButton pageKey="fairs" />
    </div>
  );
}
