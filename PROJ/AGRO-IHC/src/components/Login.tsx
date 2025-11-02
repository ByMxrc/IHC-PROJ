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

import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { validateRequired, validateMinLength } from '../utils/validation';
import './Login.css';

export default function Login() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

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
          error = 'El usuario es requerido';
        } else if (!validateMinLength(formData.username, 3)) {
          error = 'El usuario debe tener al menos 3 caracteres';
        }
        break;
      case 'password':
        if (!validateRequired(formData.password)) {
          error = 'La contraseña es requerida';
        } else if (!validateMinLength(formData.password, 6)) {
          error = 'La contraseña debe tener al menos 6 caracteres';
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
    return usernameValid && passwordValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError('');

    // Marcar todos los campos como touched
    setTouched({ username: true, password: true });

    if (validateForm()) {
      try {
        // Intentar login
        const result = await login(formData.username, formData.password, rememberMe);
        
        if (!result.success) {
          setLoginError(result.message || 'Usuario o contraseña incorrectos');
          setIsSubmitting(false);
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
          {loginError && (
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

          <button
            type="submit"
            className="btn btn-login"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <footer className="login-footer">
          <p>© 2025 Sistema de Gestión de Ferias Agroproductivas</p>
          <p className="login-footer-small">ISO 9241-11 & ISO 9241-210</p>
        </footer>
      </div>
    </div>
  );
}
