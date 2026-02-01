/**
 * Formulario de Registro de Nuevos Usuarios
 * Solo accesible para administradores
 */

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTTS } from '../hooks/useTTS';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcuts';
import TermsModal from './TermsModal';
import './UserRegistration.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

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
    role: user?.role === 'producer' ? 'producer' : 'user',
    termsAccepted: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showTermsModal, setShowTermsModal] = useState(false);
  const { getButtonProps } = useTTS();

  // Keyboard shortcuts - Ctrl+S to save, Escape to reset
  useKeyboardShortcut('s', () => {
    if (!loading) {
      const form = document.querySelector('form');
      if (form) form.requestSubmit();
    }
  }, { ctrl: true });

  useKeyboardShortcut('Escape', () => {
    if (!loading) {
      setFormData({
        username: '',
        email: '',
        fullName: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'producer',
        termsAccepted: false
      });
      setErrors({});
      setSuccessMessage('');
    }
  });

  // Permitir registro para admin y producer
  if (!user || (user.role !== 'admin' && user.role !== 'producer')) {
    return (
      <div className="user-registration-page">
        <div className="access-denied">
          <div className="denied-icon">🚫</div>
          <h2>Acceso Denegado</h2>
          <p>Solo administradores y productores pueden registrar nuevos usuarios</p>
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
      newErrors.username = 'Por favor, escribe un nombre de usuario';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Tu usuario debe tener al menos 3 letras o números';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Usa solo letras, números y el guión bajo (_)';
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = 'Por favor, escribe tu correo electrónico';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Por favor, escribe un correo válido (ejemplo: tu@email.com)';
    }

    // Full Name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Por favor, escribe tu nombre completo';
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = 'Tu nombre debe tener al menos 3 letras';
    }

    // Phone (opcional pero si se ingresa debe ser válido)
    if (formData.phone && !/^\d{9,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Por favor, escribe un teléfono válido (entre 9 y 15 números)';
    }

    // Password
    if (!formData.password) {
      newErrors.password = 'Por favor, crea una contraseña';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Tu contraseña debe tener al menos 8 caracteres';
    } else {
      const hasUpperCase = /[A-Z]/.test(formData.password);
      const hasLowerCase = /[a-z]/.test(formData.password);
      const hasNumber = /\d/.test(formData.password);
      
      if (!hasUpperCase || !hasLowerCase || !hasNumber) {
        newErrors.password = 'Tu contraseña debe tener mayúsculas (A), minúsculas (a) y números (1)';
      }
    }

    // Confirm Password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no son iguales. Por favor, escríbela igual que arriba';
    }

    // Terms
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'Para continuar, debes aceptar los términos y condiciones';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
            phone: formData.phone || null,
            role: formData.role
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Error al registrar usuario');
        }

        const newUser = await response.json();
        console.log('Usuario creado:', newUser);

        setSuccessMessage(`✅ ¡Listo! El usuario "${formData.username}" se registró correctamente en la base de datos.`);
        
        // Limpiar formulario después de mostrar mensaje
        setTimeout(() => {
          setFormData({
            username: '',
            email: '',
            fullName: '',
            phone: '',
            password: '',
            confirmPassword: '',
            role: user?.role === 'producer' ? 'producer' : 'user',
            termsAccepted: false,
          });
          setSuccessMessage('');
        }, 5000);
      } catch (error) {
        console.error('Error al registrar usuario:', error);
        alert(`❌ Error: ${error instanceof Error ? error.message : 'No se pudo registrar el usuario'}`);
      } finally {
        setLoading(false);
      }
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
              <div className="input-with-icon">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={errors.username ? 'error' : formData.username && !errors.username && formData.username.length >= 3 ? 'valid' : ''}
                  placeholder="usuario123"
                  autoComplete="off"
                />
                {formData.username && !errors.username && formData.username.length >= 3 && (
                  <span className="validation-icon success">✓</span>
                )}
                {errors.username && (
                  <span className="validation-icon error">✗</span>
                )}
              </div>
              {errors.username && <span className="error-message">{errors.username}</span>}
              <small className="input-hint">✏️ Ejemplo: juan_perez o productor123 (al menos 3 letras o números)</small>
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Email <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : formData.email && !errors.email && /\S+@\S+\.\S+/.test(formData.email) ? 'valid' : ''}
                  placeholder="usuario@email.com"
                  autoComplete="off"
                />
                {formData.email && !errors.email && /\S+@\S+\.\S+/.test(formData.email) && (
                  <span className="validation-icon success">✓</span>
                )}
                {errors.email && (
                  <span className="validation-icon error">✗</span>
                )}
              </div>
              {errors.email && <span className="error-message">{errors.email}</span>}
              <small className="input-hint">📧 Usa tu correo personal: tuNombre@gmail.com</small>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fullName">
                Nombre Completo <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={errors.fullName ? 'error' : formData.fullName && !errors.fullName && formData.fullName.length >= 3 ? 'valid' : ''}
                  placeholder="Juan Pérez García"
                />
                {formData.fullName && !errors.fullName && formData.fullName.length >= 3 && (
                  <span className="validation-icon success">✓</span>
                )}
                {errors.fullName && (
                  <span className="validation-icon error">✗</span>
                )}
              </div>
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              <small className="input-hint">👤 Escribe tu nombre y apellidos completos</small>
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
              <small className="input-hint">📱 Escribe solo números (ejemplo: 987654321). Este campo es opcional</small>
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
              <small className="input-hint">🔒 Tu contraseña debe tener: 8 o más caracteres + mayúsculas (A) + minúsculas (a) + números (1). Ejemplo: MiClave2025</small>
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
              <small className="input-hint">♻️ Escribe exactamente la misma contraseña de arriba</small>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Rol y Permisos</h3>
          <div className="form-group">
            <label htmlFor="role">
              Rol del Usuario <span className="required">*</span>
            </label>
            {user?.role === 'producer' ? (
              <input
                type="text"
                id="role"
                name="role"
                value="Productor - Gestión de producción y ventas"
                disabled
                className="role-select"
              />
            ) : (
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
            )}
            <div className="role-info">
              {formData.role === 'user' && (
                <p>
                  <strong>👤 Usuario:</strong> Puede ver información general y participar en ferias
                </p>
              )}
              {formData.role === 'producer' && (
                <p>
                  <strong>👨‍🌾 Productor:</strong> Puede registrar productos, inscribirse en ferias y ver estadísticas de ventas
                </p>
              )}
              {formData.role === 'coordinator' && (
                <p>
                  <strong>👔 Coordinador:</strong> Puede crear ferias, aprobar inscripciones y gestionar logística
                </p>
              )}
              {formData.role === 'admin' && (
                <p>
                  <strong>🔑 Administrador:</strong> Acceso completo al sistema, incluyendo gestión de usuarios
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
                <button
                  type="button"
                  className="terms-link"
                  onClick={() => setShowTermsModal(true)}
                  {...getButtonProps('Ver términos y condiciones completos')}
                >
                  términos y condiciones
                </button>{' '}
                del sistema{' '}
                <span className="required">*</span>
              </span>
            </label>
            {errors.termsAccepted && (
              <span className="error-message">{errors.termsAccepted}</span>
            )}
          </div>
        </div>

        {/* Modal de Términos y Condiciones */}
        <TermsModal
          isOpen={showTermsModal}
          onAccept={() => {
            setFormData(prev => ({ ...prev, termsAccepted: true }));
            setShowTermsModal(false);
            if (errors.termsAccepted) {
              setErrors(prev => ({ ...prev, termsAccepted: '' }));
            }
          }}
          onDecline={() => setShowTermsModal(false)}
        />

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
