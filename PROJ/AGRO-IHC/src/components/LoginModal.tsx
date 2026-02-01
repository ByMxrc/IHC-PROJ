/**
 * Componente de Login Modal
 * ETAPA 3: DESARROLLO PROTOTIPO - Sistema de autenticación
 * ISO 9241-11: Usabilidad y experiencia de usuario
 */

import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { validateRequired, validateMinLength } from '../utils/validation';
import { useTTS } from '../hooks/useTTS';
import PasswordRecovery from './PasswordRecovery';
import TermsModal from './TermsModal';
import './LoginModal.css';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAuth();
  const { t } = useTranslation();
  const { getButtonProps } = useTTS();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPasswordRecovery, setShowPasswordRecovery] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Limpiar formulario cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setFormData({ username: '', password: '' });
      setTermsAccepted(false);
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

    // Validar términos aceptados
    if (!termsAccepted) {
      setLoginError('⚠️ Debes aceptar los términos y condiciones para continuar');
      isValid = false;
    }

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
      const result = await login(formData.username, formData.password, rememberMe);
      
      if (result.success) {
        onClose(); // Cerrar modal al iniciar sesión exitosamente
      } else {
        setLoginError(result.message || 'Usuario o contraseña incorrectos');
      }
    } catch (error: any) {
      setLoginError(error.message || 'Error de conexión con el servidor');
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
            {t('login.title')}
          </h2>
          <button 
            className="modal-close" 
            onClick={onClose}
            aria-label={t('common.close')}
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
              {t('login.username')} *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              onBlur={() => handleBlur('username')}
              className={`form-input ${touched.username && errors.username ? 'error' : ''}`}
              placeholder={t('login.username')}
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
              {t('login.password')} *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onBlur={() => handleBlur('password')}
              className={`form-input ${touched.password && errors.password ? 'error' : ''}`}
              placeholder={t('login.password')}
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

          <div className="form-group-checkbox">
            <label className="checkbox-label-inline">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="checkbox-input"
              />
              <span className="checkbox-text">Recordar mi sesión por 30 días</span>
            </label>
          </div>

          <div className="form-group-checkbox">
            <label className="checkbox-label-inline">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="checkbox-input"
                required
              />
              <span className="checkbox-text">
                Acepto los{' '}
                <button
                  type="button"
                  className="terms-link-inline"
                  onClick={() => setShowTermsModal(true)}
                  {...getButtonProps('Ver términos y condiciones completos')}
                >
                  términos y condiciones
                </button>
                {' '}<span className="required">*</span>
              </span>
            </label>
          </div>

          <button 
            type="submit" 
            className="btn-login-modal"
            disabled={isSubmitting}
          >
            {isSubmitting ? '...' : t('login.submit')}
          </button>

          <div className="login-footer-links">
            <button 
              type="button"
              onClick={() => setShowPasswordRecovery(true)} 
              className="link-button"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </form>
      </div>

      {showPasswordRecovery && (
        <PasswordRecovery onClose={() => setShowPasswordRecovery(false)} />
      )}
      
      {/* Modal de Términos y Condiciones */}
      <TermsModal
        isOpen={showTermsModal}
        onAccept={() => {
          setTermsAccepted(true);
          setShowTermsModal(false);
          setLoginError('');
        }}
        onDecline={() => setShowTermsModal(false)}
      />
    </div>
  );
}
