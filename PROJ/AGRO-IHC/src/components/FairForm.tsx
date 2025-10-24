/**
 * Formulario de Gestión de Ferias
 * ETAPA 3: Formularios funcionando al 70%
 */

import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import type { Fair } from '../types';
import { PROVINCIAS_ECUADOR, CANTONES_POR_PROVINCIA } from '../types';
import { 
  validateRequired, 
  validateFutureDate, 
  validateDateRange, 
  validatePositiveNumber,
  validateMinLength,
  validateNoSpecialSymbols,
} from '../utils/validation';
import './FairForm.css';

interface FairFormProps {
  onSubmit: (fair: Omit<Fair, 'id' | 'currentCapacity'>) => void;
  onCancel: () => void;
}

export default function FairForm({ onSubmit, onCancel }: FairFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    address: '',
    province: '',
    district: '',
    startDate: '',
    endDate: '',
    maxCapacity: '',
    status: 'scheduled' as 'scheduled' | 'in-progress' | 'completed' | 'cancelled',
    productCategories: [] as string[],
    requirements: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Frutas',
    'Verduras',
    'Hortalizas',
    'Tubérculos',
    'Granos',
    'Lácteos',
    'Carnes',
    'Huevos',
    'Miel',
    'Artesanías',
  ];

  // Cantones filtrados según la provincia seleccionada
  const availableDistricts = formData.province 
    ? CANTONES_POR_PROVINCIA[formData.province] || []
    : [];

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Si cambia la provincia, resetear el distrito
    if (name === 'province') {
      setFormData((prev) => ({ ...prev, [name]: value, district: '' }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCategoryChange = (category: string) => {
    setFormData((prev) => {
      const productCategories = prev.productCategories.includes(category)
        ? prev.productCategories.filter((c) => c !== category)
        : [...prev.productCategories, category];
      return { ...prev, productCategories };
    });

    if (errors.productCategories) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.productCategories;
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
      case 'name':
        if (!validateRequired(formData.name)) {
          error = 'El nombre de la feria es requerido';
        } else if (!validateMinLength(formData.name, 5)) {
          error = 'El nombre debe tener al menos 5 caracteres';
        }
        break;
      case 'description':
        if (!validateRequired(formData.description)) {
          error = 'La descripción es requerida';
        } else if (!validateMinLength(formData.description, 10)) {
          error = 'La descripción debe tener al menos 10 caracteres';
        }
        break;
      case 'location':
        if (!validateRequired(formData.location)) {
          error = 'La ubicación es requerida';
        } else if (!validateMinLength(formData.location, 3)) {
          error = 'La ubicación debe tener al menos 3 caracteres';
        }
        break;
      case 'address':
        if (!validateRequired(formData.address)) {
          error = 'La dirección es requerida';
        } else if (!validateMinLength(formData.address, 5)) {
          error = 'La dirección debe tener al menos 5 caracteres';
        } else if (!validateNoSpecialSymbols(formData.address)) {
          error = 'La dirección contiene caracteres no permitidos';
        }
        break;
      case 'province':
        if (!validateRequired(formData.province)) {
          error = 'La provincia es requerida';
        }
        break;
      case 'district':
        if (!validateRequired(formData.district)) {
          error = 'El cantón es requerido';
        }
        break;
      case 'startDate':
        if (!validateRequired(formData.startDate)) {
          error = 'La fecha de inicio es requerida';
        } else if (!validateFutureDate(new Date(formData.startDate))) {
          error = 'La fecha debe ser futura';
        }
        break;
      case 'endDate':
        if (!validateRequired(formData.endDate)) {
          error = 'La fecha de fin es requerida';
        } else if (!validateDateRange(new Date(formData.startDate), new Date(formData.endDate))) {
          error = 'La fecha de fin debe ser posterior a la de inicio';
        }
        break;
      case 'maxCapacity':
        if (!validateRequired(formData.maxCapacity)) {
          error = 'La capacidad máxima es requerida';
        } else if (!validatePositiveNumber(parseInt(formData.maxCapacity))) {
          error = 'Ingrese un número válido mayor a 0';
        }
        break;
      case 'productCategories':
        if (formData.productCategories.length === 0) {
          error = 'Seleccione al menos una categoría';
        }
        break;
      case 'requirements':
        if (!validateRequired(formData.requirements)) {
          error = 'Los requisitos son requeridos';
        } else if (!validateMinLength(formData.requirements, 5)) {
          error = 'Los requisitos deben tener al menos 5 caracteres';
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
    const fields = [
      'name',
      'description',
      'location',
      'address',
      'province',
      'district',
      'startDate',
      'endDate',
      'maxCapacity',
      'productCategories',
      'requirements',
    ];
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
      const fair: Omit<Fair, 'id' | 'currentCapacity'> = {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        address: formData.address,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        maxCapacity: parseInt(formData.maxCapacity),
        status: formData.status,
        productCategories: formData.productCategories,
        requirements: formData.requirements.split(',').map((r) => r.trim()),
      };

      setTimeout(() => {
        onSubmit(fair);
        setIsSubmitting(false);
      }, 500);
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="fair-form" onSubmit={handleSubmit} noValidate>
      <div className="form-header">
        <h2 className="form-title">Crear Nueva Feria</h2>
        <p className="form-description">
          Complete la información para programar una nueva feria agroproductiva.
        </p>
      </div>

      <fieldset className="form-section">
        <legend className="section-title">Información General</legend>

        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Nombre de la Feria <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className={`form-input ${touched.name && errors.name ? 'error' : ''}`}
            value={formData.name}
            onChange={handleInputChange}
            onBlur={() => handleBlur('name')}
            placeholder="Ej: Feria Agroproductiva de Primavera"
            aria-required="true"
          />
          {touched.name && errors.name && (
            <span className="error-message" role="alert">
              {errors.name}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Descripción <span className="required">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            className={`form-input form-textarea ${touched.description && errors.description ? 'error' : ''}`}
            value={formData.description}
            onChange={handleInputChange}
            onBlur={() => handleBlur('description')}
            placeholder="Describa el propósito y características de la feria..."
            rows={4}
            aria-required="true"
          />
          {touched.description && errors.description && (
            <span className="error-message" role="alert">
              {errors.description}
            </span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="province" className="form-label">
              Provincia <span className="required">*</span>
            </label>
            <select
              id="province"
              name="province"
              className={`form-input ${touched.province && errors.province ? 'error' : ''}`}
              value={formData.province}
              onChange={handleInputChange}
              onBlur={() => handleBlur('province')}
              aria-required="true"
            >
              <option value="">Seleccione una provincia...</option>
              {PROVINCIAS_ECUADOR.map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
            {touched.province && errors.province && (
              <span className="error-message" role="alert">
                {errors.province}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="district" className="form-label">
              Cantón <span className="required">*</span>
            </label>
            <select
              id="district"
              name="district"
              className={`form-input ${touched.district && errors.district ? 'error' : ''}`}
              value={formData.district}
              onChange={handleInputChange}
              onBlur={() => handleBlur('district')}
              disabled={!formData.province}
              aria-required="true"
            >
              <option value="">
                {formData.province ? 'Seleccione un cantón...' : 'Primero seleccione provincia'}
              </option>
              {availableDistricts.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
            {touched.district && errors.district && (
              <span className="error-message" role="alert">
                {errors.district}
              </span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="location" className="form-label">
              Lugar Específico <span className="required">*</span>
            </label>
            <input
              type="text"
              id="location"
              name="location"
              className={`form-input ${touched.location && errors.location ? 'error' : ''}`}
              value={formData.location}
              onChange={handleInputChange}
              onBlur={() => handleBlur('location')}
              placeholder="Ej: Parque Central, Plaza de Mercado"
              aria-required="true"
            />
            {touched.location && errors.location && (
              <span className="error-message" role="alert">
                {errors.location}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="address" className="form-label">
              Dirección Exacta <span className="required">*</span>
            </label>
            <input
              type="text"
              id="address"
              name="address"
              className={`form-input ${touched.address && errors.address ? 'error' : ''}`}
              value={formData.address}
              onChange={handleInputChange}
              onBlur={() => handleBlur('address')}
              placeholder="Calle, número, referencias"
              aria-required="true"
            />
            {touched.address && errors.address && (
              <span className="error-message" role="alert">
                {errors.address}
              </span>
            )}
          </div>
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend className="section-title">Fechas y Capacidad</legend>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate" className="form-label">
              Fecha de Inicio <span className="required">*</span>
            </label>
            <input
              type="datetime-local"
              id="startDate"
              name="startDate"
              className={`form-input ${touched.startDate && errors.startDate ? 'error' : ''}`}
              value={formData.startDate}
              onChange={handleInputChange}
              onBlur={() => handleBlur('startDate')}
              aria-required="true"
            />
            {touched.startDate && errors.startDate && (
              <span className="error-message" role="alert">
                {errors.startDate}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="endDate" className="form-label">
              Fecha de Fin <span className="required">*</span>
            </label>
            <input
              type="datetime-local"
              id="endDate"
              name="endDate"
              className={`form-input ${touched.endDate && errors.endDate ? 'error' : ''}`}
              value={formData.endDate}
              onChange={handleInputChange}
              onBlur={() => handleBlur('endDate')}
              aria-required="true"
            />
            {touched.endDate && errors.endDate && (
              <span className="error-message" role="alert">
                {errors.endDate}
              </span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="maxCapacity" className="form-label">
              Capacidad Máxima (stands) <span className="required">*</span>
            </label>
            <input
              type="number"
              id="maxCapacity"
              name="maxCapacity"
              className={`form-input ${touched.maxCapacity && errors.maxCapacity ? 'error' : ''}`}
              value={formData.maxCapacity}
              onChange={handleInputChange}
              onBlur={() => handleBlur('maxCapacity')}
              placeholder="0"
              min="1"
              aria-required="true"
            />
            {touched.maxCapacity && errors.maxCapacity && (
              <span className="error-message" role="alert">
                {errors.maxCapacity}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="status" className="form-label">
              Estado
            </label>
            <select
              id="status"
              name="status"
              className="form-input"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="scheduled">Programada</option>
              <option value="in-progress">En Progreso</option>
              <option value="completed">Completada</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend className="section-title">Categorías y Requisitos</legend>

        <div className="form-group">
          <label className="form-label">
            Categorías de Productos <span className="required">*</span>
          </label>
          <div className="checkbox-grid">
            {categories.map((category) => (
              <label key={category} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.productCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="checkbox-input"
                />
                <span className="checkbox-text">{category}</span>
              </label>
            ))}
          </div>
          {touched.productCategories && errors.productCategories && (
            <span className="error-message" role="alert">
              {errors.productCategories}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="requirements" className="form-label">
            Requisitos <span className="required">*</span>
          </label>
          <textarea
            id="requirements"
            name="requirements"
            className={`form-input form-textarea ${touched.requirements && errors.requirements ? 'error' : ''}`}
            value={formData.requirements}
            onChange={handleInputChange}
            onBlur={() => handleBlur('requirements')}
            placeholder="Requisitos separados por comas: Certificado sanitario, RUC, etc."
            rows={3}
            aria-required="true"
          />
          {touched.requirements && errors.requirements && (
            <span className="error-message" role="alert">
              {errors.requirements}
            </span>
          )}
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
          {isSubmitting ? 'Creando...' : 'Crear Feria'}
        </button>
      </div>
    </form>
  );
}
