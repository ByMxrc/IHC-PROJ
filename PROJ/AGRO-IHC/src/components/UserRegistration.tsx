/**
 * Formulario de Registro de Nuevos Usuarios
 * Solo accesible para administradores
 */

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './UserRegistration.css';

interface UserFormData {
  username: string;
  email: string;
  fullName: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: 'admin' | 'coordinator' | 'producer' | 'user';
  termsAccepted: boolean;
}

export default function UserRegistration() {
  const { user } = useAuth();
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    email: '',
    fullName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    termsAccepted: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Verificar que el usuario es admin
  if (user?.role !== 'admin') {
    return (
      <div className="user-registration-page">
        <div className="access-denied">
          <div className="denied-icon">🚫</div>
          <h2>Acceso Denegado</h2>
          <p>Solo los administradores pueden registrar nuevos usuarios</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Username
    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Mínimo 3 caracteres';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Solo letras, números y guión bajo';
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Full Name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es requerido';
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = 'Mínimo 3 caracteres';
    }

    // Phone (opcional pero si se ingresa debe ser válido)
    if (formData.phone && !/^\d{9,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Teléfono inválido (9-15 dígitos)';
    }

    // Password
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mínimo 8 caracteres';
    } else {
      const hasUpperCase = /[A-Z]/.test(formData.password);
      const hasLowerCase = /[a-z]/.test(formData.password);
      const hasNumber = /\d/.test(formData.password);
      
      if (!hasUpperCase || !hasLowerCase || !hasNumber) {
        newErrors.password = 'Debe contener mayúsculas, minúsculas y números';
      }
    }

    // Confirm Password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Terms
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'Debe aceptar los términos y condiciones';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Aquí se enviaría al backend
      console.log('Registrar usuario:', {
        ...formData,
        password: '***',
        confirmPassword: '***',
      });

      // Simular registro exitoso
      setSuccessMessage(`✅ Usuario "${formData.username}" registrado exitosamente con rol de ${formData.role}`);
      
      // Limpiar formulario después de 2 segundos
      setTimeout(() => {
        setFormData({
          username: '',
          email: '',
          fullName: '',
          phone: '',
          password: '',
          confirmPassword: '',
          role: 'user',
          termsAccepted: false,
        });
        setSuccessMessage('');
      }, 3000);
    }
  };

  const getPasswordStrength = (password: string): string => {
    if (password.length === 0) return '';
    if (password.length < 8) return 'weak';
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const strength = [hasUpperCase, hasLowerCase, hasNumber, hasSpecial].filter(Boolean).length;
    
    if (strength <= 2) return 'weak';
    if (strength === 3) return 'medium';
    return 'strong';
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="user-registration-page">
      <div className="page-header">
        <h1 className="page-title">
          <span className="page-icon">👥</span>
          Registro de Nuevos Usuarios
        </h1>
        <p className="page-description">
          Crea cuentas para nuevos usuarios del sistema (solo administradores)
        </p>
      </div>

      {successMessage && (
        <div className="success-banner">
          {successMessage}
        </div>
      )}

      <form className="user-registration-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3 className="section-title">Información de la Cuenta</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="username">
                Nombre de Usuario <span className="required">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={errors.username ? 'error' : ''}
                placeholder="usuario123"
                autoComplete="off"
              />
              {errors.username && <span className="error-message">{errors.username}</span>}
              <small className="input-hint">Mínimo 3 caracteres, solo letras, números y guión bajo</small>
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
                placeholder="usuario@email.com"
                autoComplete="off"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fullName">
                Nombre Completo <span className="required">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={errors.fullName ? 'error' : ''}
                placeholder="Juan Pérez García"
              />
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Teléfono</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={errors.phone ? 'error' : ''}
                placeholder="987654321"
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
              <small className="input-hint">9-15 dígitos (opcional)</small>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Seguridad</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">
                Contraseña <span className="required">*</span>
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={errors.password ? 'error' : ''}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
              {passwordStrength && (
                <div className={`password-strength strength-${passwordStrength}`}>
                  <div className="strength-bar"></div>
                  <span className="strength-label">
                    {passwordStrength === 'weak' && 'Débil'}
                    {passwordStrength === 'medium' && 'Media'}
                    {passwordStrength === 'strong' && 'Fuerte'}
                  </span>
                </div>
              )}
              <small className="input-hint">Mínimo 8 caracteres con mayúsculas, minúsculas y números</small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                Confirmar Contraseña <span className="required">*</span>
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={errors.confirmPassword ? 'error' : ''}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Rol y Permisos</h3>

          <div className="form-group">
            <label htmlFor="role">
              Rol del Usuario <span className="required">*</span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="role-select"
            >
              <option value="user">Usuario - Acceso básico al sistema</option>
              <option value="producer">Productor - Gestión de producción y ventas</option>
              <option value="coordinator">Coordinador - Gestión de ferias y eventos</option>
              <option value="admin">Administrador - Acceso completo al sistema</option>
            </select>

            <div className="role-info">
              {formData.role === 'user' && (
                <p>
                  <strong>👤 Usuario:</strong> Puede ver información general y participar en
                  ferias
                </p>
              )}
              {formData.role === 'producer' && (
                <p>
                  <strong>👨‍🌾 Productor:</strong> Puede registrar productos, inscribirse en
                  ferias y ver estadísticas de ventas
                </p>
              )}
              {formData.role === 'coordinator' && (
                <p>
                  <strong>👔 Coordinador:</strong> Puede crear ferias, aprobar inscripciones y
                  gestionar logística
                </p>
              )}
              {formData.role === 'admin' && (
                <p>
                  <strong>🔑 Administrador:</strong> Acceso completo al sistema, incluyendo
                  gestión de usuarios
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="terms-checkbox">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleInputChange}
                className="checkbox-input"
              />
              <span className="checkbox-text">
                Acepto que el usuario deberá cumplir con los{' '}
                <strong>términos y condiciones</strong> del sistema{' '}
                <span className="required">*</span>
              </span>
            </label>
            {errors.termsAccepted && (
              <span className="error-message">{errors.termsAccepted}</span>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setFormData({
                username: '',
                email: '',
                fullName: '',
                phone: '',
                password: '',
                confirmPassword: '',
                role: 'user',
                termsAccepted: false,
              });
              setErrors({});
            }}
          >
            Limpiar Formulario
          </button>
          <button type="submit" className="btn btn-primary">
            👥 Registrar Usuario
          </button>
        </div>
      </form>
    </div>
  );
}
