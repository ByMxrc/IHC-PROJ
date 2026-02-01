/**
 * Página de Ventas
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import HelpButton from '../components/HelpButton';
import './SalesPage.css';

interface Sale {
  sale_id?: number;
  fair_id: number;
  producer_id: number;
  product_name: string;
  quantity_sold: number;
  unit_price: number;
  total_amount: number;
  sale_date?: string;
  fair_name?: string;
  producer_name?: string;
}

export default function SalesPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fair_id: '',
    product_name: '',
    quantity_sold: '',
    unit_price: '',
  });

  useEffect(() => {
    fetchSales();
  }, [user]);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const params = user?.role === 'producer' ? `?producer_id=${user.id}` : '';
      const response = await fetch(`http://localhost:3001/api/sales${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setSales(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const total = parseFloat(formData.quantity_sold) * parseFloat(formData.unit_price);
      
      const response = await fetch('http://localhost:3001/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fair_id: parseInt(formData.fair_id),
          producer_id: user?.id,
          product_name: formData.product_name,
          quantity_sold: parseFloat(formData.quantity_sold),
          unit_price: parseFloat(formData.unit_price),
          total_amount: total,
          sale_date: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error('Error al registrar venta');

      await fetchSales();
      setShowForm(false);
      setFormData({ fair_id: '', product_name: '', quantity_sold: '', unit_price: '' });
      alert('✅ Venta registrada exitosamente');
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al registrar venta');
    }
  };

  const totalSales = sales.reduce((sum, s) => sum + parseFloat(s.total_amount.toString()), 0).toFixed(2);

  if (loading) {
    return (
      <div className="sales-page">
        <div className="loading">⏳ Cargando ventas...</div>
      </div>
    );
  }
  
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
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancelar' : '+ Nueva Venta'}
        </button>
      </div>

      {/* Resumen */}
      <div className="sales-summary">
        <div className="summary-card">
          <span className="summary-icon">📊</span>
          <div>
            <div className="summary-value">{sales.length}</div>
            <div className="summary-label">Ventas Registradas</div>
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-icon">💵</span>
          <div>
            <div className="summary-value">S/ {totalSales}</div>
            <div className="summary-label">Total Vendido</div>
          </div>
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="sale-form">
          <h3>Registrar Nueva Venta</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Feria ID:</label>
              <input
                type="number"
                value={formData.fair_id}
                onChange={(e) => setFormData({...formData, fair_id: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Producto:</label>
              <input
                type="text"
                value={formData.product_name}
                onChange={(e) => setFormData({...formData, product_name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Cantidad Vendida:</label>
              <input
                type="number"
                step="0.01"
                value={formData.quantity_sold}
                onChange={(e) => setFormData({...formData, quantity_sold: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Precio Unitario (S/):</label>
              <input
                type="number"
                step="0.01"
                value={formData.unit_price}
                onChange={(e) => setFormData({...formData, unit_price: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Registrar Venta</button>
          </form>
        </div>
      )}

      {/* Lista de Ventas */}
      <div className="sales-list">
        {sales.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">💰</span>
            <h3>No hay ventas registradas</h3>
            <p>Comienza a registrar tus ventas</p>
          </div>
        ) : (
          <table className="sales-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unit.</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.sale_id}>
                  <td>{new Date(sale.sale_date || '').toLocaleDateString('es-PE')}</td>
                  <td>{sale.product_name}</td>
                  <td>{sale.quantity_sold}</td>
                  <td>S/ {sale.unit_price}</td>
                  <td className="total">S/ {sale.total_amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <HelpButton pageKey="sales" />
    </div>
  );
}
