/**
 * Página de Gestión de Productores
 */

import { useState } from 'react';
import type { Producer } from '../types';
import { useTranslation } from 'react-i18next';
import ProducerForm from '../components/ProducerForm';
import './ProducersPage.css';

export default function ProducersPage() {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [producers, setProducers] = useState<Producer[]>([
    {
      id: '1',
      name: 'Juan',
      lastName: 'Pérez García',
      documentType: 'DNI',
      documentNumber: '12345678',
      email: 'juan.perez@email.com',
      phone: '987654321',
      address: 'Av. Los Agricultores 123',
      district: 'Cuenca',
      province: 'Azuay',
      department: 'Ecuador',
      productType: ['Frutas', 'Verduras'],
      farmSize: 5.5,
      registrationDate: new Date('2024-01-15'),
      status: 'active',
    },
  ]);

  const handleSubmit = (producerData: Omit<Producer, 'id' | 'registrationDate'>) => {
    const newProducer: Producer = {
      ...producerData,
      id: Date.now().toString(),
      registrationDate: new Date(),
    };
    setProducers([...producers, newProducer]);
    setShowForm(false);
    alert('✅ Productor inscrito exitosamente');
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
        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            {t('tables.stats.newProducer')}
          </button>
        )}
      </div>

      {showForm ? (
        <ProducerForm onSubmit={handleSubmit} onCancel={handleCancel} />
      ) : (
        <div className="producers-content">
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
                    <th>{t('tables.producer.status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {producers.map((producer) => (
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
                      <td>
                        <span className={`status-badge ${getStatusBadge(producer.status).class}`}>
                          {getStatusBadge(producer.status).label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
