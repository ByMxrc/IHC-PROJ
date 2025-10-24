/**
 * Componente de Login Modal
 * ETAPA 3: DESARROLLO PROTOTIPO - Sistema de autenticación
 * ISO 9241-11: Usabilidad y experiencia de usuario
 */

import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { validateRequired, validateMinLength } from '../utils/validation';
import './LoginModal.css';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Limpiar formulario cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setFormData({ username: '', password: '' });
      setErrors({});
      setTouched({});
      setLoginError('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    if (loginError) {
      setLoginError('');
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, formData[field as keyof typeof formData]);
  };

  const validateField = (field: string, value: string): boolean => {
    let error = '';

    switch (field) {
      case 'username':
        if (!validateRequired(value)) {
          error = 'El usuario es requerido';
        } else if (!validateMinLength(value, 3)) {
          error = 'El usuario debe tener al menos 3 caracteres';
        }
        break;
      case 'password':
        if (!validateRequired(value)) {
          error = 'La contraseña es requerida';
        } else if (!validateMinLength(value, 6)) {
          error = 'La contraseña debe tener al menos 6 caracteres';
        }
        break;
    }

    if (error) {
      setErrors((prev) => ({ ...prev, [field]: error }));
      return false;
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      return true;
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;

    Object.keys(formData).forEach((field) => {
      const value = formData[field as keyof typeof formData];
      if (!validateField(field, value)) {
        isValid = false;
      }
    });

    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // Marcar todos los campos como touched
    setTouched({
      username: true,
      password: true,
    });

    // Validar
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const success = login(formData.username, formData.password);
      
      if (success) {
        onClose(); // Cerrar modal al iniciar sesión exitosamente
      } else {
        setLoginError('Usuario o contraseña incorrectos');
      }
    } catch (error) {
      setLoginError('Error al iniciar sesión. Intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-labelledby="login-modal-title">
      <div className="modal-content">
        <div className="modal-header">
          <h2 id="login-modal-title" className="modal-title">
            <span className="modal-icon">🔐</span>
            Iniciar Sesión
          </h2>
          <button 
            className="modal-close" 
            onClick={onClose}
            aria-label="Cerrar modal de login"
            type="button"
          >
            ✕
          </button>
        </div>

        <form className="login-modal-form" onSubmit={handleSubmit} noValidate>
          {loginError && (
            <div className="login-error-banner" role="alert">
              <span className="error-icon">⚠️</span>
              {loginError}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Usuario *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              onBlur={() => handleBlur('username')}
              className={`form-input ${touched.username && errors.username ? 'error' : ''}`}
              placeholder="Ingrese su usuario"
              required
              aria-required="true"
              aria-invalid={touched.username && errors.username ? 'true' : 'false'}
              aria-describedby={touched.username && errors.username ? 'username-error' : undefined}
            />
            {touched.username && errors.username && (
              <span id="username-error" className="error-message" role="alert">
                {errors.username}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onBlur={() => handleBlur('password')}
              className={`form-input ${touched.password && errors.password ? 'error' : ''}`}
              placeholder="Ingrese su contraseña"
              required
              aria-required="true"
              aria-invalid={touched.password && errors.password ? 'true' : 'false'}
              aria-describedby={touched.password && errors.password ? 'password-error' : undefined}
            />
            {touched.password && errors.password && (
              <span id="password-error" className="error-message" role="alert">
                {errors.password}
              </span>
            )}
          </div>

          <button 
            type="submit" 
            className="btn-login-modal"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>

          <div className="login-info">
            <span className="info-icon">ℹ️</span>
            <div className="info-content">
              <strong>Credenciales de prueba:</strong>
              Usuario: <code>admin</code> | Contraseña: <code>admin123</code>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
