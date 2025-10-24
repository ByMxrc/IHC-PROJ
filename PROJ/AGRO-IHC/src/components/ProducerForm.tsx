/**
 * Formulario de Inscripción de Productores
 * ETAPA 3: DESARROLLO PROTOTIPO - Diseño formularios con parámetros de usabilidad
 * 
 * Parámetros de usabilidad implementados:
 * - Labels claros y descriptivos
 * - Validación en tiempo real con feedback
 * - Mensajes de error específicos y útiles
 * - Indicadores de campos requeridos
 * - Agrupación lógica de campos
 * - Accesibilidad completa (ARIA)
 * - Confirmación de envío
 * - Prevención de errores
 * 
 * Funcionalidad: 70% implementado
 */

import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import type { Producer } from '../types';
import { PROVINCIAS_ECUADOR, CANTONES_POR_PROVINCIA } from '../types';
import {
  validateEmail,
  validatePhone,
  validateDNI,
  validateRUC,
  validateRequired,
  validatePositiveNumber,
  validateMinLength,
  validateOnlyLetters,
  validateNoSpecialSymbols,
} from '../utils/validation';
import './ProducerForm.css';

interface ProducerFormProps {
  onSubmit: (producer: Omit<Producer, 'id' | 'registrationDate'>) => void;
  onCancel: () => void;
}

export default function ProducerForm({ onSubmit, onCancel }: ProducerFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    documentType: 'DNI' as 'DNI' | 'RUC' | 'CE',
    documentNumber: '',
    email: '',
    phone: '',
    address: '',
    district: '',
    province: '',
    department: '',
    productType: [] as string[],
    farmSize: '',
    status: 'pending' as 'active' | 'inactive' | 'pending',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tipos de productos disponibles
  const productTypes = [
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

  // Manejo de cambios en campos de texto
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Si cambia la provincia, resetear el distrito
    if (name === 'province') {
      setFormData((prev) => ({ ...prev, [name]: value, district: '' }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    // Limpiar error al editar
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Manejo de checkbox para tipos de producto
  const handleProductTypeChange = (product: string) => {
    setFormData((prev) => {
      const productType = prev.productType.includes(product)
        ? prev.productType.filter((p) => p !== product)
        : [...prev.productType, product];
      return { ...prev, productType };
    });
    
    if (errors.productType) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.productType;
        return newErrors;
      });
    }
  };

  // Manejo de blur para validación
  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  // Validación de campo individual
  const validateField = (field: string): boolean => {
    let error = '';

    switch (field) {
      case 'name':
        if (!validateRequired(formData.name)) {
          error = 'El nombre es requerido';
        } else if (!validateMinLength(formData.name, 2)) {
          error = 'El nombre debe tener al menos 2 caracteres';
        } else if (!validateOnlyLetters(formData.name)) {
          error = 'El nombre solo puede contener letras';
        }
        break;
      case 'lastName':
        if (!validateRequired(formData.lastName)) {
          error = 'El apellido es requerido';
        } else if (!validateMinLength(formData.lastName, 2)) {
          error = 'El apellido debe tener al menos 2 caracteres';
        } else if (!validateOnlyLetters(formData.lastName)) {
          error = 'El apellido solo puede contener letras';
        }
        break;
      case 'documentNumber':
        if (!validateRequired(formData.documentNumber)) {
          error = 'El número de documento es requerido';
        } else if (formData.documentType === 'DNI' && !validateDNI(formData.documentNumber)) {
          error = 'DNI debe tener 8 dígitos';
        } else if (formData.documentType === 'RUC' && !validateRUC(formData.documentNumber)) {
          error = 'RUC debe tener 11 dígitos';
        }
        break;
      case 'email':
        if (!validateRequired(formData.email)) {
          error = 'El email es requerido';
        } else if (!validateEmail(formData.email)) {
          error = 'Email inválido';
        }
        break;
      case 'phone':
        if (!validateRequired(formData.phone)) {
          error = 'El teléfono es requerido';
        } else if (!validatePhone(formData.phone)) {
          error = 'Teléfono debe tener 9 dígitos';
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
      case 'district':
        if (!validateRequired(formData.district)) {
          error = 'El cantón es requerido';
        }
        break;
      case 'province':
        if (!validateRequired(formData.province)) {
          error = 'La provincia es requerida';
        }
        break;
      case 'department':
        if (!validateRequired(formData.department)) {
          error = 'El país es requerido';
        }
        break;
      case 'productType':
        if (formData.productType.length === 0) {
          error = 'Seleccione al menos un tipo de producto';
        }
        break;
      case 'farmSize':
        if (!validateRequired(formData.farmSize)) {
          error = 'El tamaño del terreno es requerido';
        } else if (!validatePositiveNumber(parseFloat(formData.farmSize))) {
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

  // Validación del formulario completo
  const validateForm = (): boolean => {
    const fields = [
      'name',
      'lastName',
      'documentNumber',
      'email',
      'phone',
      'address',
      'district',
      'province',
      'department',
      'productType',
      'farmSize',
    ];

    let isValid = true;
    fields.forEach((field) => {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  };

  // Manejo de envío del formulario
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Marcar todos los campos como touched
    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    if (validateForm()) {
      const producer: Omit<Producer, 'id' | 'registrationDate'> = {
        ...formData,
        farmSize: parseFloat(formData.farmSize),
      };

      // Simular proceso de envío
      setTimeout(() => {
        onSubmit(producer);
        setIsSubmitting(false);
      }, 500);
    } else {
      setIsSubmitting(false);
      // Focus en el primer campo con error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        document.querySelector<HTMLElement>(`[name="${firstErrorField}"]`)?.focus();
      }
    }
  };

  return (
    <form className="producer-form" onSubmit={handleSubmit} noValidate>
      <div className="form-header">
        <h2 className="form-title">Inscripción de Productor</h2>
        <p className="form-description">
          Complete todos los campos marcados con (*) para inscribirse como productor agrícola.
        </p>
      </div>

      {/* Sección: Datos Personales */}
      <fieldset className="form-section">
        <legend className="section-title">Datos Personales</legend>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Nombre <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={`form-input ${touched.name && errors.name ? 'error' : ''}`}
              value={formData.name}
              onChange={handleInputChange}
              onBlur={() => handleBlur('name')}
              aria-required="true"
              aria-invalid={touched.name && !!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {touched.name && errors.name && (
              <span id="name-error" className="error-message" role="alert">
                {errors.name}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="lastName" className="form-label">
              Apellido <span className="required">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className={`form-input ${touched.lastName && errors.lastName ? 'error' : ''}`}
              value={formData.lastName}
              onChange={handleInputChange}
              onBlur={() => handleBlur('lastName')}
              aria-required="true"
              aria-invalid={touched.lastName && !!errors.lastName}
              aria-describedby={errors.lastName ? 'lastName-error' : undefined}
            />
            {touched.lastName && errors.lastName && (
              <span id="lastName-error" className="error-message" role="alert">
                {errors.lastName}
              </span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="documentType" className="form-label">
              Tipo de Documento <span className="required">*</span>
            </label>
            <select
              id="documentType"
              name="documentType"
              className="form-input"
              value={formData.documentType}
              onChange={handleInputChange}
              aria-required="true"
            >
              <option value="DNI">DNI</option>
              <option value="RUC">RUC</option>
              <option value="CE">Carné de Extranjería</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="documentNumber" className="form-label">
              Número de Documento <span className="required">*</span>
            </label>
            <input
              type="text"
              id="documentNumber"
              name="documentNumber"
              className={`form-input ${touched.documentNumber && errors.documentNumber ? 'error' : ''}`}
              value={formData.documentNumber}
              onChange={handleInputChange}
              onBlur={() => handleBlur('documentNumber')}
              placeholder={formData.documentType === 'DNI' ? '12345678' : formData.documentType === 'RUC' ? '12345678901' : ''}
              aria-required="true"
              aria-invalid={touched.documentNumber && !!errors.documentNumber}
              aria-describedby={errors.documentNumber ? 'documentNumber-error' : undefined}
            />
            {touched.documentNumber && errors.documentNumber && (
              <span id="documentNumber-error" className="error-message" role="alert">
                {errors.documentNumber}
              </span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Correo Electrónico <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${touched.email && errors.email ? 'error' : ''}`}
              value={formData.email}
              onChange={handleInputChange}
              onBlur={() => handleBlur('email')}
              placeholder="correo@ejemplo.com"
              aria-required="true"
              aria-invalid={touched.email && !!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {touched.email && errors.email && (
              <span id="email-error" className="error-message" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Teléfono <span className="required">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className={`form-input ${touched.phone && errors.phone ? 'error' : ''}`}
              value={formData.phone}
              onChange={handleInputChange}
              onBlur={() => handleBlur('phone')}
              placeholder="987654321"
              aria-required="true"
              aria-invalid={touched.phone && !!errors.phone}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
            />
            {touched.phone && errors.phone && (
              <span id="phone-error" className="error-message" role="alert">
                {errors.phone}
              </span>
            )}
          </div>
        </div>
      </fieldset>

      {/* Sección: Ubicación */}
      <fieldset className="form-section">
        <legend className="section-title">Ubicación</legend>

        <div className="form-group">
          <label htmlFor="address" className="form-label">
            Dirección <span className="required">*</span>
          </label>
          <input
            type="text"
            id="address"
            name="address"
            className={`form-input ${touched.address && errors.address ? 'error' : ''}`}
            value={formData.address}
            onChange={handleInputChange}
            onBlur={() => handleBlur('address')}
            placeholder="Av. Principal 123"
            aria-required="true"
            aria-invalid={touched.address && !!errors.address}
            aria-describedby={errors.address ? 'address-error' : undefined}
          />
          {touched.address && errors.address && (
            <span id="address-error" className="error-message" role="alert">
              {errors.address}
            </span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="department" className="form-label">
              País <span className="required">*</span>
            </label>
            <select
              id="department"
              name="department"
              className={`form-input ${touched.department && errors.department ? 'error' : ''}`}
              value={formData.department}
              onChange={handleInputChange}
              onBlur={() => handleBlur('department')}
              aria-required="true"
              aria-invalid={touched.department && !!errors.department}
              aria-describedby={errors.department ? 'department-error' : undefined}
            >
              <option value="">Seleccione...</option>
              <option value="Ecuador">Ecuador</option>
            </select>
            {touched.department && errors.department && (
              <span id="department-error" className="error-message" role="alert">
                {errors.department}
              </span>
            )}
          </div>

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
              aria-invalid={touched.province && !!errors.province}
              aria-describedby={errors.province ? 'province-error' : undefined}
            >
              <option value="">Seleccione...</option>
              {PROVINCIAS_ECUADOR.map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
            {touched.province && errors.province && (
              <span id="province-error" className="error-message" role="alert">
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
              aria-invalid={touched.district && !!errors.district}
              aria-describedby={errors.district ? 'district-error' : undefined}
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
              <span id="district-error" className="error-message" role="alert">
                {errors.district}
              </span>
            )}
          </div>
        </div>
      </fieldset>

      {/* Sección: Información de Producción */}
      <fieldset className="form-section">
        <legend className="section-title">Información de Producción</legend>

        <div className="form-group">
          <label className="form-label">
            Tipos de Productos <span className="required">*</span>
          </label>
          <div className="checkbox-grid" role="group" aria-label="Tipos de productos">
            {productTypes.map((product) => (
              <label key={product} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.productType.includes(product)}
                  onChange={() => handleProductTypeChange(product)}
                  className="checkbox-input"
                />
                <span className="checkbox-text">{product}</span>
              </label>
            ))}
          </div>
          {touched.productType && errors.productType && (
            <span className="error-message" role="alert">
              {errors.productType}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="farmSize" className="form-label">
            Tamaño del Terreno (hectáreas) <span className="required">*</span>
          </label>
          <input
            type="number"
            id="farmSize"
            name="farmSize"
            className={`form-input ${touched.farmSize && errors.farmSize ? 'error' : ''}`}
            value={formData.farmSize}
            onChange={handleInputChange}
            onBlur={() => handleBlur('farmSize')}
            placeholder="0.0"
            step="0.1"
            min="0"
            aria-required="true"
            aria-invalid={touched.farmSize && !!errors.farmSize}
            aria-describedby={errors.farmSize ? 'farmSize-error' : undefined}
          />
          {touched.farmSize && errors.farmSize && (
            <span id="farmSize-error" className="error-message" role="alert">
              {errors.farmSize}
            </span>
          )}
        </div>
      </fieldset>

      {/* Botones de acción */}
      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Inscribir Productor'}
        </button>
      </div>
    </form>
  );
}
