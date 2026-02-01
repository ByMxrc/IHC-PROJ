/**
 * Página de Gestión de Productores
 */

import { useState, useEffect } from 'react';
import type { Producer } from '../types';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import ProducerForm from '../components/ProducerForm';
import HelpButton from '../components/HelpButton';
import './ProducersPage.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export default function ProducersPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [producers, setProducers] = useState<Producer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducers();
  }, []);

  const fetchProducers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/producers`);
      if (!response.ok) throw new Error('Error al cargar productores');
      const result = await response.json();
      
      // Mapear datos de la BD al formato del frontend
      const producersData = result.data || [];
      const mappedProducers = producersData.map((p: any) => ({
        id: p.producer_id?.toString() || p.id,
        name: p.name || p.first_name || '',
        lastName: p.last_name || '',
        documentType: p.document_type || 'DNI',
        documentNumber: p.document_number || '',
        email: p.email || '',
        phone: p.phone || '',
        address: p.address || '',
        district: p.district || '',
        province: p.province || '',
        department: p.department || '',
        productType: p.product_types ? JSON.parse(p.product_types) : [],
        farmSize: parseFloat(p.farm_size) || 0,
        registrationDate: new Date(p.created_at || p.registration_date),
        status: p.status || 'active',
      }));
      
      setProducers(mappedProducers);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (producerData: Omit<Producer, 'id' | 'registrationDate'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/producers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: producerData.name,
          last_name: producerData.lastName,
          document_type: producerData.documentType,
          document_number: producerData.documentNumber,
          email: producerData.email,
          phone: producerData.phone,
          address: producerData.address,
          district: producerData.district,
          province: producerData.province,
          department: producerData.department,
          product_types: producerData.productType,
          farm_size: producerData.farmSize,
          status: producerData.status
        })
      });

      if (!response.ok) throw new Error('Error al crear productor');

      await fetchProducers();
      setShowForm(false);
      alert('✅ Productor inscrito exitosamente en la base de datos');
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al inscribir productor');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: { label: t('forms.producer.active'), class: 'status-active' },
      inactive: { label: t('forms.producer.inactive'), class: 'status-inactive' },
      pending: { label: t('forms.producer.pending'), class: 'status-pending' },
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  if (loading) {
    return (
      <div className="producers-page">
        <div className="loading">⏳ Cargando productores...</div>
      </div>
    );
  }

  // Filtrar solo productores activos si no hay usuario logueado
  const displayProducers = user ? producers : producers.filter(p => p.status === 'active');

  return (
    <div className="producers-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span className="page-icon">👨‍🌾</span>
            {t('pages.producers.title')}
          </h1>
          <p className="page-description">
            {t('pages.producers.description')}
          </p>
        </div>
        {!showForm && (user?.role === 'admin' || user?.role === 'coordinator') && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            {t('tables.stats.newProducer')}
          </button>
        )}
      </div>

      {showForm ? (
        <ProducerForm onSubmit={handleSubmit} onCancel={handleCancel} />
      ) : (
        <div className="producers-content">
          {user && (
            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-value">{producers.length}</div>
                <div className="stat-label">{t('tables.stats.totalProducers')}</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">
                  {producers.filter((p) => p.status === 'active').length}
                </div>
                <div className="stat-label">{t('tables.stats.active')}</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">
                  {producers.filter((p) => p.status === 'pending').length}
                </div>
                <div className="stat-label">{t('tables.stats.pending')}</div>
              </div>
            </div>
          )}

          <div className="producers-list">
            <h2 className="list-title">{t('pages.producers.title')}</h2>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t('tables.producer.name')}</th>
                    <th>{t('tables.producer.documentNumber')}</th>
                    <th>{t('tables.producer.email')}</th>
                    <th>{t('tables.producer.location')}</th>
                    <th>{t('tables.producer.productTypes')}</th>
                    <th>{t('tables.producer.farmSize')}</th>
                    {user && <th>{t('tables.producer.status')}</th>}
                  </tr>
                </thead>
                <tbody>
                  {displayProducers.map((producer) => (
                    <tr key={producer.id}>
                      <td>
                        <strong>
                          {producer.name} {producer.lastName}
                        </strong>
                      </td>
                      <td>
                        {producer.documentType}: {producer.documentNumber}
                      </td>
                      <td>
                        <div className="contact-info">
                          <div>📧 {producer.email}</div>
                          <div>📱 {producer.phone}</div>
                        </div>
                      </td>
                      <td>
                        {producer.district}, {producer.province}
                      </td>
                      <td>
                        <div className="product-tags">
                          {producer.productType.map((product) => (
                            <span key={product} className="product-tag">
                              {product}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>{producer.farmSize} ha</td>
                      {user && (
                        <td>
                          <span className={`status-badge ${getStatusBadge(producer.status).class}`}>
                            {getStatusBadge(producer.status).label}
                          </span>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <HelpButton pageKey="producers" />
    </div>
  );
}
