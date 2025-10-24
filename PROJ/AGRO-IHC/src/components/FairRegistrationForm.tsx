/**
 * Formulario de Inscripción a Ferias
 * ETAPA 3: Formularios con parámetros de usabilidad al 70%
 */

import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import type { Registration } from '../types';
import { validateRequired, validatePositiveNumber, validateMinLength } from '../utils/validation';
import './FairRegistrationForm.css';

interface FairRegistrationFormProps {
  producers: Array<{ id: string; name: string; lastName: string }>;
  fairs: Array<{ id: string; name: string; startDate: Date; currentCapacity: number; maxCapacity: number }>;
  onSubmit: (registration: Omit<Registration, 'id' | 'registrationDate'>) => void;
  onCancel: () => void;
}

export default function FairRegistrationForm({
  producers,
  fairs,
  onSubmit,
  onCancel,
}: FairRegistrationFormProps) {
  const [formData, setFormData] = useState({
    producerId: '',
    fairId: '',
    productsToSell: '',
    estimatedQuantity: '',
    needsTransport: false,
    status: 'pending' as 'pending' | 'approved' | 'rejected' | 'cancelled',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: string): boolean => {
    let error = '';

    switch (field) {
      case 'producerId':
        if (!validateRequired(formData.producerId)) {
          error = 'Seleccione un productor';
        }
        break;
      case 'fairId':
        if (!validateRequired(formData.fairId)) {
          error = 'Seleccione una feria';
        } else {
          const selectedFair = fairs.find((f) => f.id === formData.fairId);
          if (selectedFair && selectedFair.currentCapacity >= selectedFair.maxCapacity) {
            error = 'La feria seleccionada está llena';
          }
        }
        break;
      case 'productsToSell':
        if (!validateRequired(formData.productsToSell)) {
          error = 'Ingrese los productos a vender';
        } else if (!validateMinLength(formData.productsToSell, 3)) {
          error = 'Ingrese al menos un producto válido (mínimo 3 caracteres)';
        }
        break;
      case 'estimatedQuantity':
        if (!validateRequired(formData.estimatedQuantity)) {
          error = 'Ingrese la cantidad estimada';
        } else if (!validatePositiveNumber(parseFloat(formData.estimatedQuantity))) {
          error = 'Ingrese un valor válido mayor a 0';
        }
        break;
    }

    if (error) {
      setErrors((prev) => ({ ...prev, [field]: error }));
      return false;
    }
    return true;
  };

  const validateForm = (): boolean => {
    const fields = ['producerId', 'fairId', 'productsToSell', 'estimatedQuantity'];
    let isValid = true;
    fields.forEach((field) => {
      if (!validateField(field)) {
        isValid = false;
      }
    });
    return isValid;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    if (validateForm()) {
      const registration: Omit<Registration, 'id' | 'registrationDate'> = {
        producerId: formData.producerId,
        fairId: formData.fairId,
        productsToSell: formData.productsToSell.split(',').map((p) => p.trim()),
        estimatedQuantity: parseFloat(formData.estimatedQuantity),
        needsTransport: formData.needsTransport,
        status: formData.status,
      };

      setTimeout(() => {
        onSubmit(registration);
        setIsSubmitting(false);
      }, 500);
    } else {
      setIsSubmitting(false);
    }
  };

  const selectedFair = fairs.find((f) => f.id === formData.fairId);

  return (
    <form className="fair-registration-form" onSubmit={handleSubmit} noValidate>
      <div className="form-header">
        <h2 className="form-title">Inscripción a Feria</h2>
        <p className="form-description">
          Complete el formulario para inscribirse a una feria agroproductiva.
        </p>
      </div>

      <fieldset className="form-section">
        <legend className="section-title">Información de Inscripción</legend>

        <div className="form-group">
          <label htmlFor="producerId" className="form-label">
            Productor <span className="required">*</span>
          </label>
          <select
            id="producerId"
            name="producerId"
            className={`form-input ${touched.producerId && errors.producerId ? 'error' : ''}`}
            value={formData.producerId}
            onChange={handleInputChange}
            onBlur={() => handleBlur('producerId')}
            aria-required="true"
            aria-invalid={touched.producerId && !!errors.producerId}
          >
            <option value="">Seleccione un productor...</option>
            {producers.map((producer) => (
              <option key={producer.id} value={producer.id}>
                {producer.name} {producer.lastName}
              </option>
            ))}
          </select>
          {touched.producerId && errors.producerId && (
            <span className="error-message" role="alert">
              {errors.producerId}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="fairId" className="form-label">
            Feria <span className="required">*</span>
          </label>
          <select
            id="fairId"
            name="fairId"
            className={`form-input ${touched.fairId && errors.fairId ? 'error' : ''}`}
            value={formData.fairId}
            onChange={handleInputChange}
            onBlur={() => handleBlur('fairId')}
            aria-required="true"
            aria-invalid={touched.fairId && !!errors.fairId}
          >
            <option value="">Seleccione una feria...</option>
            {fairs.map((fair) => (
              <option
                key={fair.id}
                value={fair.id}
                disabled={fair.currentCapacity >= fair.maxCapacity}
              >
                {fair.name} - {new Date(fair.startDate).toLocaleDateString('es-PE')}
                {fair.currentCapacity >= fair.maxCapacity ? ' (LLENO)' : ''}
              </option>
            ))}
          </select>
          {touched.fairId && errors.fairId && (
            <span className="error-message" role="alert">
              {errors.fairId}
            </span>
          )}
          {selectedFair && (
            <div className="info-message">
              📍 {selectedFair.name} - Capacidad: {selectedFair.currentCapacity}/{selectedFair.maxCapacity}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="productsToSell" className="form-label">
            Productos a Vender <span className="required">*</span>
          </label>
          <textarea
            id="productsToSell"
            name="productsToSell"
            className={`form-input form-textarea ${touched.productsToSell && errors.productsToSell ? 'error' : ''}`}
            value={formData.productsToSell}
            onChange={handleInputChange}
            onBlur={() => handleBlur('productsToSell')}
            placeholder="Ej: Papas, Tomates, Lechugas (separados por comas)"
            rows={3}
            aria-required="true"
            aria-invalid={touched.productsToSell && !!errors.productsToSell}
          />
          {touched.productsToSell && errors.productsToSell && (
            <span className="error-message" role="alert">
              {errors.productsToSell}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="estimatedQuantity" className="form-label">
            Cantidad Estimada (kg) <span className="required">*</span>
          </label>
          <input
            type="number"
            id="estimatedQuantity"
            name="estimatedQuantity"
            className={`form-input ${touched.estimatedQuantity && errors.estimatedQuantity ? 'error' : ''}`}
            value={formData.estimatedQuantity}
            onChange={handleInputChange}
            onBlur={() => handleBlur('estimatedQuantity')}
            placeholder="0.0"
            step="0.1"
            min="0"
            aria-required="true"
            aria-invalid={touched.estimatedQuantity && !!errors.estimatedQuantity}
          />
          {touched.estimatedQuantity && errors.estimatedQuantity && (
            <span className="error-message" role="alert">
              {errors.estimatedQuantity}
            </span>
          )}
        </div>

        <div className="form-group">
          <label className="checkbox-label-block">
            <input
              type="checkbox"
              name="needsTransport"
              checked={formData.needsTransport}
              onChange={handleInputChange}
              className="checkbox-input"
            />
            <span className="checkbox-text">
              🚚 Requiero servicio de transporte
            </span>
          </label>
          <p className="help-text">
            Si necesita ayuda con el transporte de sus productos, marque esta opción.
          </p>
        </div>
      </fieldset>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Inscribiendo...' : 'Inscribirse a Feria'}
        </button>
      </div>
    </form>
  );
}
