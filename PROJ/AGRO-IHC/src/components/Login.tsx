/**
 * Componente de Login
 * ETAPA 3: DESARROLLO PROTOTIPO - Formulario de autenticación con parámetros de usabilidad
 * 
 * Parámetros de usabilidad implementados:
 * - Labels claros y descriptivos
 * - Validación en tiempo real
 * - Mensajes de error específicos
 * - Feedback visual inmediato
 * - Accesibilidad completa (ARIA)
 * - Responsive design
 */

import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { validateRequired, validateMinLength } from '../utils/validation';
import { useTTS } from '../hooks/useTTS';
import TermsModal from './TermsModal';
import './Login.css';

export default function Login() {
  const { login } = useAuth();
  const { getButtonProps, speakError } = useTTS();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  // Sistema de bloqueo temporal por intentos fallidos
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);

  // Efecto para leer errores en voz alta
  useEffect(() => {
    if (loginError) {
      speakError(loginError);
    }
  }, [loginError, speakError]);

  // Efecto para el temporizador de bloqueo
  useEffect(() => {
    if (blockTimeRemaining > 0) {
      const timer = setTimeout(() => {
        setBlockTimeRemaining(blockTimeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (blockTimeRemaining === 0 && isBlocked) {
      setIsBlocked(false);
      setFailedAttempts(0);
      setLoginError('');
    }
  }, [blockTimeRemaining, isBlocked]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Limpiar errores al editar
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
    validateField(field);
  };

  const validateField = (field: string): boolean => {
    let error = '';

    switch (field) {
      case 'username':
        if (!validateRequired(formData.username)) {
          error = 'Por favor, escribe tu nombre de usuario';
        } else if (!validateMinLength(formData.username, 3)) {
          error = 'Tu usuario debe tener al menos 3 letras o números';
        }
        break;
      case 'password':
        if (!validateRequired(formData.password)) {
          error = 'Por favor, escribe tu contraseña';
        } else if (!validateMinLength(formData.password, 6)) {
          error = 'Tu contraseña debe tener al menos 6 caracteres';
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
    const usernameValid = validateField('username');
    const passwordValid = validateField('password');
    
    // Validar términos aceptados
    if (!termsAccepted) {
      setLoginError('⚠️ Debes aceptar los términos y condiciones para continuar');
      return false;
    }
    
    return usernameValid && passwordValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Verificar si está bloqueado
    if (isBlocked) {
      return;
    }
    
    setIsSubmitting(true);
    setLoginError('');

    // Marcar todos los campos como touched
    setTouched({ username: true, password: true });

    if (validateForm()) {
      try {
        // Intentar login
        const result = await login(formData.username, formData.password, rememberMe);
        
        if (!result.success) {
          // Incrementar intentos fallidos
          const newFailedAttempts = failedAttempts + 1;
          setFailedAttempts(newFailedAttempts);
          
          if (newFailedAttempts >= 3) {
            // Bloquear después de 3 intentos fallidos
            setIsBlocked(true);
            setBlockTimeRemaining(60); // 60 segundos de bloqueo
            setLoginError('🚫 Has intentado entrar 3 veces con datos incorrectos. Espera 1 minuto antes de intentar otra vez.');
          } else {
            const remainingAttempts = 3 - newFailedAttempts;
            setLoginError(`❌ ${result.message || 'Usuario o contraseña incorrectos'}. Te quedan ${remainingAttempts} ${remainingAttempts === 1 ? 'intento' : 'intentos'}.`);
          }
          setIsSubmitting(false);
        } else {
          // Login exitoso - resetear intentos
          setFailedAttempts(0);
        }
        // Si es exitoso, el contexto se encargará de la redirección
      } catch (error: any) {
        setLoginError(error.message || 'Error de conexión con el servidor');
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">🌾</div>
          <h1 className="login-title">AgroFeria</h1>
          <p className="login-subtitle">Sistema de Gestión de Ferias Agroproductivas</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {isBlocked && (
            <div className="login-error-banner blocked-banner" role="alert">
              <span className="error-icon">🔒</span>
              <div>
                <strong>Cuenta bloqueada temporalmente</strong>
                <p>Espera {blockTimeRemaining} segundos antes de intentar nuevamente.</p>
              </div>
            </div>
          )}
          
          {loginError && !isBlocked && (
            <div className="login-error-banner" role="alert">
              <span className="error-icon">⚠️</span>
              {loginError}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Usuario
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className={`form-input ${touched.username && errors.username ? 'error' : ''}`}
              value={formData.username}
              onChange={handleInputChange}
              onBlur={() => handleBlur('username')}
              placeholder="Ingrese su usuario"
              autoComplete="username"
              aria-required="true"
              aria-invalid={touched.username && !!errors.username}
              aria-describedby={errors.username ? 'username-error' : undefined}
            />
            {touched.username && errors.username && (
              <span id="username-error" className="error-message" role="alert">
                {errors.username}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={`form-input ${touched.password && errors.password ? 'error' : ''}`}
              value={formData.password}
              onChange={handleInputChange}
              onBlur={() => handleBlur('password')}
              placeholder="Ingrese su contraseña"
              autoComplete="current-password"
              aria-required="true"
              aria-invalid={touched.password && !!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
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
            className="btn btn-login"
            disabled={isSubmitting || isBlocked}
            {...getButtonProps(isBlocked ? `Bloqueado ${blockTimeRemaining} segundos` : isSubmitting ? 'Iniciando sesión' : 'Iniciar Sesión')}
          >
            {isBlocked ? `🔒 Bloqueado (${blockTimeRemaining}s)` : isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

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

        <footer className="login-footer">
          <p>© 2025 Sistema de Gestión de Ferias Agroproductivas</p>
          <p className="login-footer-small">ISO 9241-11 & ISO 9241-210</p>
        </footer>
      </div>
    </div>
  );
}
