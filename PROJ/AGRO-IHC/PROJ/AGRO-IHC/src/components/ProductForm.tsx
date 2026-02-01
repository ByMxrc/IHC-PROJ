/**
 * Formulario de Catálogo de Productos (Productor)
 */

import { useState } from 'react';
import type { FormEvent } from 'react';
import './ProductForm.css';

interface ProductFormData {
  name: string;
  quantity: string;
  unit: string;
  price: string;
  category: string;
}

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
}

export default function ProductForm({ onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    quantity: '',
    unit: 'kg',
    price: '',
    category: 'vegetales'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del producto es requerido';
    }

    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = 'Ingrese una cantidad válida';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Ingrese un precio válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const total = formData.quantity && formData.price 
    ? (parseFloat(formData.quantity) * parseFloat(formData.price)).toFixed(2)
    : '0.00';

  return (
    <div className="product-form-overlay">
      <div className="product-form-modal">
        <div className="form-header">
          <h2>📦 Agregar Producto</h2>
          <button className="close-btn" onClick={onCancel} aria-label="Cerrar">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          {/* Nombre del Producto */}
          <div className="form-group">
            <label htmlFor="name">
              Nombre del Producto <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Tomates, Lechugas, Papas"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          {/* Categoría */}
          <div className="form-group">
            <label htmlFor="category">Categoría</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="vegetales">🥬 Vegetales</option>
              <option value="frutas">🍎 Frutas</option>
              <option value="tuberculos">🥔 Tubérculos</option>
              <option value="granos">🌾 Granos</option>
              <option value="hierbas">🌿 Hierbas</option>
              <option value="otros">📦 Otros</option>
            </select>
          </div>

          {/* Cantidad y Unidad */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quantity">
                Cantidad <span className="required">*</span>
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="0"
                step="0.01"
                min="0"
                className={errors.quantity ? 'error' : ''}
              />
              {errors.quantity && <span className="error-message">{errors.quantity}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="unit">Unidad</label>
              <select
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
              >
                <option value="kg">Kilogramos (kg)</option>
                <option value="unidad">Unidades</option>
                <option value="docena">Docenas</option>
                <option value="caja">Cajas</option>
                <option value="saco">Sacos</option>
              </select>
            </div>
          </div>

          {/* Precio */}
          <div className="form-group">
            <label htmlFor="price">
              Precio por {formData.unit} <span className="required">*</span>
            </label>
            <div className="input-with-prefix">
              <span className="prefix">S/</span>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={errors.price ? 'error' : ''}
              />
            </div>
            {errors.price && <span className="error-message">{errors.price}</span>}
          </div>

          {/* Valor Total Estimado */}
          <div className="total-display">
            <span>Valor Total Estimado:</span>
            <strong>S/ {total}</strong>
          </div>

          {/* Botones */}
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              💾 Guardar Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
