/**
 * Página de Gestión de Productos
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ProductForm from '../components/ProductForm';
import HelpButton from '../components/HelpButton';
import './ProductsPage.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface Product {
  product_id?: number;
  producer_id?: number;
  product_name: string;
  quantity: string;
  unit: string;
  unit_price: string;
  created_at?: string;
  updated_at?: string;
}

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = user?.role === 'producer' ? `?producer_id=${user.id}` : '';
      const response = await fetch(`${API_BASE_URL}/products${params}`);
      
      if (!response.ok) throw new Error('Error al cargar productos');
      
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (formData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          producer_id: user?.id,
          product_name: formData.name,
          quantity: formData.quantity,
          unit: formData.unit,
          unit_price: formData.price
        })
      });

      if (!response.ok) throw new Error('Error al crear producto');

      await fetchProducts();
      setShowForm(false);
      alert('✅ Producto agregado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al agregar producto');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) throw new Error('Error al eliminar producto');

        await fetchProducts();
        alert('🗑️ Producto eliminado');
      } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al eliminar producto');
      }
    }
  };

  const totalValue = products.reduce((sum, p) => 
    sum + (parseFloat(p.quantity) * parseFloat(p.unit_price)), 0
  ).toFixed(2);

  if (loading) {
    return (
      <div className="products-page">
        <div className="loading">⏳ Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span className="page-icon">📦</span>
            Mis Productos
          </h1>
          <p className="page-description">
            Gestiona tu catálogo de productos disponibles para las ferias
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          ➕ Agregar Producto
        </button>
      </div>

      {/* Resumen */}
      <div className="products-summary">
        <div className="summary-card">
          <span className="summary-icon">📦</span>
          <div>
            <div className="summary-value">{products.length}</div>
            <div className="summary-label">Productos</div>
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-icon">💰</span>
          <div>
            <div className="summary-value">S/ {totalValue}</div>
            <div className="summary-label">Valor Total</div>
          </div>
        </div>
      </div>

      {/* Lista de Productos */}
      <div className="products-list">
        {products.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📦</span>
            <h3>No hay productos registrados</h3>
            <p>Agrega tu primer producto para comenzar</p>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              ➕ Agregar Producto
            </button>
          </div>
        ) : (
          products.map(product => {
            const total = (parseFloat(product.quantity) * parseFloat(product.unit_price)).toFixed(2);
            return (
              <div key={product.product_id} className="product-card">
                <div className="product-header">
                  <div className="product-title">
                    <span className="product-category-icon">📦</span>
                    <h3>{product.product_name}</h3>
                  </div>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteProduct(product.product_id!)}
                    aria-label="Eliminar producto"
                  >
                    🗑️
                  </button>
                </div>

                <div className="product-details">
                  <div className="product-info">
                    <span className="info-label">Cantidad:</span>
                    <span className="info-value">{product.quantity} {product.unit}</span>
                  </div>
                  <div className="product-info">
                    <span className="info-label">Precio:</span>
                    <span className="info-value">S/ {product.unit_price} / {product.unit}</span>
                  </div>
                  <div className="product-info highlight">
                    <span className="info-label">Total:</span>
                    <span className="info-value">S/ {total}</span>
                  </div>
                </div>

                <div className="product-footer">
                  <span className="product-date">
                    📅 {new Date(product.created_at || '').toLocaleDateString('es-PE')}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Formulario */}
      {showForm && (
        <ProductForm
          onSubmit={handleAddProduct}
          onCancel={() => setShowForm(false)}
        />
      )}

      <HelpButton pageKey="products" />
    </div>
  );
}
