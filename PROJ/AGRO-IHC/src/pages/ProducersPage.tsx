/**
 * Página de Gestión de Productores
 */

import { useState } from 'react';
import type { Producer } from '../types';
import ProducerForm from '../components/ProducerForm';
import './ProducersPage.css';

export default function ProducersPage() {
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
      district: 'San Juan',
      province: 'Lima',
      department: 'Lima',
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
      active: { label: 'Activo', class: 'status-active' },
      inactive: { label: 'Inactivo', class: 'status-inactive' },
      pending: { label: 'Pendiente', class: 'status-pending' },
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  return (
    <div className="producers-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span className="page-icon">👨‍🌾</span>
            Gestión de Productores
          </h1>
          <p className="page-description">
            Administre el registro de productores agrícolas del sistema
          </p>
        </div>
        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Nuevo Productor
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
              <div className="stat-label">Total Productores</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {producers.filter((p) => p.status === 'active').length}
              </div>
              <div className="stat-label">Activos</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {producers.filter((p) => p.status === 'pending').length}
              </div>
              <div className="stat-label">Pendientes</div>
            </div>
          </div>

          <div className="producers-list">
            <h2 className="list-title">Lista de Productores</h2>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Documento</th>
                    <th>Contacto</th>
                    <th>Ubicación</th>
                    <th>Productos</th>
                    <th>Hectáreas</th>
                    <th>Estado</th>
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
