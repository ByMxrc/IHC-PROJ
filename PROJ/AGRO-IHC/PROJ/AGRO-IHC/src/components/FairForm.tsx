/**
 * Formulario de Gestión de Ferias
 * ETAPA 3: Formularios funcionando al 70%
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { FormEvent, ChangeEvent } from 'react';
import type { Fair } from '../types';
import { useTTS } from '../hooks/useTTS';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcuts';
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
  const { t } = useTranslation();
  const { getButtonProps } = useTTS();
  
  // Atajos de teclado
  useKeyboardShortcut('s', () => {
    const form = document.querySelector('form');
    if (form) form.requestSubmit();
  }, { ctrl: true });
  
  useKeyboardShortcut('Escape', onCancel);
  
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
    t('categories.fruits'),
    t('categories.vegetables'),
    t('categories.greens'),
    t('categories.tubers'),
    t('categories.grains'),
    t('categories.dairy'),
    t('categories.meat'),
    t('categories.eggs'),
    t('categories.honey'),
    t('categories.crafts'),
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
          error = t('forms.validation.fairNameRequired');
        } else if (!validateMinLength(formData.name, 5)) {
          error = t('forms.validation.fairNameMinLength');
        }
        break;
      case 'description':
        if (!validateRequired(formData.description)) {
          error = t('forms.validation.descriptionRequired');
        } else if (!validateMinLength(formData.description, 10)) {
          error = t('forms.validation.descriptionMinLength');
        }
        break;
      case 'location':
        if (!validateRequired(formData.location)) {
          error = t('forms.validation.locationRequired');
        } else if (!validateMinLength(formData.location, 3)) {
          error = t('forms.validation.locationMinLength');
        }
        break;
      case 'address':
        if (!validateRequired(formData.address)) {
          error = t('forms.validation.addressRequired');
        } else if (!validateMinLength(formData.address, 5)) {
          error = t('forms.validation.addressMinLength');
        } else if (!validateNoSpecialSymbols(formData.address)) {
          error = t('forms.validation.addressInvalidChars');
        }
        break;
      case 'province':
        if (!validateRequired(formData.province)) {
          error = t('forms.validation.provinceRequired');
        }
        break;
      case 'district':
        if (!validateRequired(formData.district)) {
          error = t('forms.validation.districtRequired');
        }
        break;
      case 'startDate':
        if (!validateRequired(formData.startDate)) {
          error = t('forms.validation.startDateRequired');
        } else if (!validateFutureDate(new Date(formData.startDate))) {
          error = t('forms.validation.startDateFuture');
        }
        break;
      case 'endDate':
        if (!validateRequired(formData.endDate)) {
          error = t('forms.validation.endDateRequired');
        } else if (!validateDateRange(new Date(formData.startDate), new Date(formData.endDate))) {
          error = t('forms.validation.endDateAfterStart');
        }
        break;
      case 'maxCapacity':
        if (!validateRequired(formData.maxCapacity)) {
          error = t('forms.validation.capacityRequired');
        } else if (!validatePositiveNumber(parseInt(formData.maxCapacity))) {
          error = t('forms.validation.capacityInvalid');
        }
        break;
      case 'productCategories':
        if (formData.productCategories.length === 0) {
          error = t('forms.validation.categoriesRequired');
        }
        break;
      case 'requirements':
        if (!validateRequired(formData.requirements)) {
          error = t('forms.validation.requirementsRequired');
        } else if (!validateMinLength(formData.requirements, 5)) {
          error = t('forms.validation.requirementsMinLength');
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
        <h2 className="form-title">{t('forms.fair.title')}</h2>
        <p className="form-description">
          {t('forms.fair.formDescription')}
        </p>
      </div>

      <fieldset className="form-section">
        <legend className="section-title">{t('forms.fair.generalInfo')}</legend>

        <div className="form-group">
          <label htmlFor="name" className="form-label">
            {t('forms.fair.name')} <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className={`form-input ${touched.name && errors.name ? 'error' : ''}`}
            value={formData.name}
            onChange={handleInputChange}
            onBlur={() => handleBlur('name')}
            placeholder={t('forms.fair.namePlaceholder')}
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
            {t('forms.fair.description')} <span className="required">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            className={`form-input form-textarea ${touched.description && errors.description ? 'error' : ''}`}
            value={formData.description}
            onChange={handleInputChange}
            onBlur={() => handleBlur('description')}
            placeholder={t('forms.fair.descriptionPlaceholder')}
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
              {t('forms.fair.province')} <span className="required">*</span>
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
              <option value="">{t('forms.producer.selectProvince')}</option>
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
              {t('forms.fair.district')} <span className="required">*</span>
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
                {formData.province ? t('forms.producer.selectDistrict') : t('forms.producer.selectProvince')}
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
              {t('forms.fair.location')} <span className="required">*</span>
            </label>
            <input
              type="text"
              id="location"
              name="location"
              className={`form-input ${touched.location && errors.location ? 'error' : ''}`}
              value={formData.location}
              onChange={handleInputChange}
              onBlur={() => handleBlur('location')}
              placeholder={t('forms.fair.locationPlaceholder')}
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
              {t('forms.fair.address')} <span className="required">*</span>
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
        <legend className="section-title">{t('forms.fair.dateCapacity')}</legend>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate" className="form-label">
              {t('forms.fair.startDate')} <span className="required">*</span>
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
              {t('forms.fair.endDate')} <span className="required">*</span>
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
              {t('forms.fair.maxCapacity')} <span className="required">*</span>
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
              {t('forms.fair.statusLabel')}
            </label>
            <select
              id="status"
              name="status"
              className="form-input"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="scheduled">{t('forms.fair.scheduled')}</option>
              <option value="in-progress">{t('forms.fair.inProgress')}</option>
              <option value="completed">{t('forms.fair.completed')}</option>
              <option value="cancelled">{t('forms.fair.cancelled')}</option>
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend className="section-title">{t('forms.fair.categoriesRequirements')}</legend>

        <div className="form-group">
          <label className="form-label">
            {t('forms.fair.productCategories')} <span className="required">*</span>
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
            {t('forms.fair.requirements')} <span className="required">*</span>
          </label>
          <textarea
            id="requirements"
            name="requirements"
            className={`form-input form-textarea ${touched.requirements && errors.requirements ? 'error' : ''}`}
            value={formData.requirements}
            onChange={handleInputChange}
            onBlur={() => handleBlur('requirements')}
            placeholder={t('forms.fair.requirementsPlaceholder')}
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
          {...getButtonProps(t('common.cancel'))}
        >
          {t('common.cancel')}
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
          {...getButtonProps(isSubmitting ? t('common.loading') : t('common.save'))}
        >
          {isSubmitting ? t('common.loading') : t('common.save')}
        </button>
      </div>
    </form>
  );
}
