/**
 * Formulario de Post-venta de Feria
 * Permite a productores registrar ventas totales y feedback después de una feria
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTTS } from '../hooks/useTTS';
import './PostSaleForm.css';

interface Fair {
  id: number;
  name: string;
  date: string;
}

interface ProductSold {
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

interface PostSaleFormProps {
  registrationId?: number;
  fairId?: number;
  onSubmit: (data: PostSaleData) => void;
  onCancel: () => void;
}

interface PostSaleData {
  registrationId: number;
  productsSold: ProductSold[];
  incidents: string;
  satisfaction: number;
  futureNeeds: string;
  wouldParticipateAgain: boolean;
  paymentMethod: string;
}

export default function PostSaleForm({ registrationId, fairId, onSubmit, onCancel }: PostSaleFormProps) {
  const { t } = useTranslation();
  const { getInputProps, speakSuccess } = useTTS();

  const [fairs, setFairs] = useState<Fair[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<PostSaleData>({
    registrationId: registrationId || 0,
    productsSold: [{ name: '', quantity: 0, unit: 'kg', unitPrice: 0, total: 0 }],
    incidents: '',
    satisfaction: 5,
    futureNeeds: '',
    wouldParticipateAgain: true,
    paymentMethod: 'efectivo',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchFairs();
  }, []);

  const fetchFairs = async () => {
    try {
      setLoading(false);
      const res = await fetch('http://localhost:3000/api/fairs/past', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setFairs(data);
    } catch (error) {
      console.error('Error fetching fairs:', error);
      setLoading(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.registrationId) {
      newErrors.registrationId = 'ID de inscripción es requerido';
    }

    const validProducts = formData.productsSold.filter(p => p.name.trim());
    if (validProducts.length === 0) {
      newErrors.products = t('postSale.errors.productsRequired');
    }

    validProducts.forEach((product, index) => {
      if (product.quantity <= 0) {
        newErrors[`product_${index}_quantity`] = t('postSale.errors.quantityInvalid');
      }
      if (product.unitPrice <= 0) {
        newErrors[`product_${index}_price`] = t('postSale.errors.priceInvalid');
      }
      if (!product.unit.trim()) {
        newErrors[`product_${index}_unit`] = 'Unidad es requerida';
      }
    });

    if (!formData.paymentMethod.trim()) {
      newErrors.paymentMethod = 'Método de pago es requerido';
    }

    if (formData.futureNeeds.length > 500) {
      newErrors.futureNeeds = t('postSale.errors.futureNeedsTooLong');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      const dataToSubmit = {
        ...formData,
        productsSold: formData.productsSold.filter(p => p.name.trim()),
      };
      onSubmit(dataToSubmit);
      speakSuccess(t('postSale.success'));
    }
  };

  const addProduct = () => {
    setFormData({
      ...formData,
      productsSold: [...formData.productsSold, { name: '', quantity: 0, unit: 'kg', unitPrice: 0, total: 0 }]
    });
  };

  const removeProduct = (index: number) => {
    setFormData({
      ...formData,
      productsSold: formData.productsSold.filter((_, i) => i !== index)
    });
  };

  const updateProduct = (index: number, field: keyof ProductSold, value: string | number) => {
    const newProducts = [...formData.productsSold];
    newProducts[index] = { ...newProducts[index], [field]: value };
    
    // Calcular total automáticamente
    if (field === 'quantity' || field === 'unitPrice') {
      newProducts[index].total = newProducts[index].quantity * newProducts[index].unitPrice;
    }
    
    setFormData({ ...formData, productsSold: newProducts });
  };

  const totalSales = formData.productsSold.reduce((sum, p) => sum + (p.total || 0), 0);

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  return (
    <form className="post-sale-form" onSubmit={handleSubmit}>
      <h2>{t('postSale.title')}</h2>
      <p className="form-description">{t('postSale.description')}</p>

      {/* Selección de Inscripción */}
      <div className="form-group">
        <label htmlFor="registration">
          ID de Inscripción <span className="required">*</span>
        </label>
        <input
          type="number"
          id="registration"
          value={formData.registrationId || ''}
          onChange={(e) => setFormData({ ...formData, registrationId: parseInt(e.target.value) || 0 })}
          className={errors.registrationId ? 'error' : ''}
          placeholder="Ingrese el ID de inscripción"
          disabled={!!registrationId}
          min="1"
        />
        {errors.registrationId && <span className="error-message">{errors.registrationId}</span>}
      </div>

      {/* Productos Vendidos */}
      <div className="form-section">
        <h3>{t('postSale.productsSold')} <span className="required">*</span></h3>
        
        {formData.productsSold.map((product, index) => (
          <div key={index} className="product-row">
            <div className="product-fields">
              <div className="form-field">
                <label htmlFor={`product-name-${index}`}>
                  {t('postSale.productName')}
                </label>
                <input
                  type="text"
                  id={`product-name-${index}`}
                  value={product.name}
                  onChange={(e) => updateProduct(index, 'name', e.target.value)}
                  placeholder={t('postSale.productNamePlaceholder')}
                  maxLength={100}
                />
              </div>

              <div className="form-field">
                <label htmlFor={`product-quantity-${index}`}>
                  {t('postSale.quantity')}
                </label>
                <input
                  type="number"
                  id={`product-quantity-${index}`}
                  value={product.quantity || ''}
                  onChange={(e) => updateProduct(index, 'quantity', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.1"
                  className={errors[`product_${index}_quantity`] ? 'error' : ''}
                />
                {errors[`product_${index}_quantity`] && (
                  <span className="error-message">{errors[`product_${index}_quantity`]}</span>
                )}
              </div>

              <div className="form-field">
                <label htmlFor={`product-unit-${index}`}>
                  {t('postSale.unit')} <span className="required">*</span>
                </label>
                <select
                  id={`product-unit-${index}`}
                  value={product.unit || 'kg'}
                  onChange={(e) => updateProduct(index, 'unit', e.target.value)}
                  className={errors[`product_${index}_unit`] ? 'error' : ''}
                >
                  <option value="kg">kg</option>
                  <option value="lb">lb</option>
                  <option value="tonelada">tonelada</option>
                  <option value="arroba">arroba</option>
                  <option value="unidad">unidad</option>
                  <option value="caja">caja</option>
                  <option value="lote">lote</option>
                </select>
                {errors[`product_${index}_unit`] && (
                  <span className="error-message">{errors[`product_${index}_unit`]}</span>
                )}
              </div>

              <div className="form-field">
                <label htmlFor={`product-price-${index}`}>
                  {t('postSale.unitPrice')}
                </label>
                <input
                  type="number"
                  id={`product-price-${index}`}
                  value={product.unitPrice || ''}
                  onChange={(e) => updateProduct(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  className={errors[`product_${index}_price`] ? 'error' : ''}
                />
                {errors[`product_${index}_price`] && (
                  <span className="error-message">{errors[`product_${index}_price`]}</span>
                )}
              </div>

              <div className="form-field">
                <label>{t('postSale.total')}</label>
                <div className="total-display">
                  S/ {product.total.toFixed(2)}
                </div>
              </div>
            </div>

            {formData.productsSold.length > 1 && (
              <button
                type="button"
                className="remove-product-btn"
                onClick={() => removeProduct(index)}
                aria-label={t('common.remove')}
              >
                ✕
              </button>
            )}
          </div>
        ))}

        {errors.products && <span className="error-message">{errors.products}</span>}

        <button type="button" className="add-product-btn" onClick={addProduct}>
          + {t('postSale.addProduct')}
        </button>

        <div className="sales-summary">
          <strong>{t('postSale.totalSales')}:</strong> S/ {totalSales.toFixed(2)}
        </div>
      </div>

      {/* Método de Pago */}
      <div className="form-group">
        <label htmlFor="paymentMethod">
          Método de Pago <span className="required">*</span>
        </label>
        <select
          id="paymentMethod"
          value={formData.paymentMethod || 'efectivo'}
          onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
          className={errors.paymentMethod ? 'error' : ''}
        >
          <option value="efectivo">Efectivo</option>
          <option value="tarjeta">Tarjeta</option>
          <option value="transferencia">Transferencia Bancaria</option>
          <option value="cheque">Cheque</option>
          <option value="otro">Otro</option>
        </select>
        {errors.paymentMethod && <span className="error-message">{errors.paymentMethod}</span>}
      </div>

      {/* Incidencias */}
      <div className="form-group">
        <label htmlFor="incidents">
          {t('postSale.incidents')} {t('common.optional')}
        </label>
        <textarea
          id="incidents"
          value={formData.incidents}
          onChange={(e) => setFormData({ ...formData, incidents: e.target.value })}
          rows={4}
          maxLength={500}
          placeholder={t('postSale.incidentsPlaceholder')}
          {...getInputProps(t('postSale.incidents'))}
        />
        <span className="char-count">{formData.incidents.length}/500</span>
      </div>

      {/* Satisfacción */}
      <div className="form-group">
        <label htmlFor="satisfaction">
          {t('postSale.satisfaction')} <span className="required">*</span>
        </label>
        <div className="satisfaction-slider">
          <input
            type="range"
            id="satisfaction"
            min="1"
            max="10"
            value={formData.satisfaction}
            onChange={(e) => setFormData({ ...formData, satisfaction: parseInt(e.target.value) })}
          />
          <div className="satisfaction-value">
            <span className="satisfaction-number">{formData.satisfaction}</span>
            <span className="satisfaction-label">
              {formData.satisfaction <= 3 && t('postSale.satisfactionLevels.low')}
              {formData.satisfaction > 3 && formData.satisfaction <= 7 && t('postSale.satisfactionLevels.medium')}
              {formData.satisfaction > 7 && t('postSale.satisfactionLevels.high')}
            </span>
          </div>
        </div>
      </div>

      {/* Necesidades Futuras */}
      <div className="form-group">
        <label htmlFor="futureNeeds">
          {t('postSale.futureNeeds')} {t('common.optional')}
        </label>
        <textarea
          id="futureNeeds"
          value={formData.futureNeeds}
          onChange={(e) => setFormData({ ...formData, futureNeeds: e.target.value })}
          className={errors.futureNeeds ? 'error' : ''}
          rows={3}
          maxLength={500}
          placeholder={t('postSale.futureNeedsPlaceholder')}
          {...getInputProps(t('postSale.futureNeeds'))}
        />
        {errors.futureNeeds && <span className="error-message">{errors.futureNeeds}</span>}
        <span className="char-count">{formData.futureNeeds.length}/500</span>
      </div>

      {/* Participaría de Nuevo */}
      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.wouldParticipateAgain}
            onChange={(e) => setFormData({ ...formData, wouldParticipateAgain: e.target.checked })}
          />
          {t('postSale.wouldParticipateAgain')}
        </label>
      </div>

      {/* Botones */}
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-secondary">
          {t('common.cancel')}
        </button>
        <button type="submit" className="btn-primary">
          {t('postSale.submit')}
        </button>
      </div>
    </form>
  );
}
