/**
 * Página de Perfil de Usuario
 * Permite ver y editar la información del usuario
 */

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import HelpButton from '../components/HelpButton';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    role: user?.role || 'user',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es requerido';
    }

    if (formData.phone && !/^\d{9,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Teléfono inválido (9-15 dígitos)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordChange = () => {
    const newErrors: Record<string, string> = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Ingrese su contraseña actual';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'Ingrese una nueva contraseña';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      newErrors.newPassword = 'La nueva contraseña debe ser diferente a la actual';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = () => {
    if (validateForm()) {
      // Aquí se enviaría la actualización al backend
      console.log('Guardar perfil:', formData);
      
      // Simular actualización en localStorage (demo)
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setIsEditing(false);
      alert('✅ Perfil actualizado exitosamente');
    }
  };

  const handleChangePassword = () => {
    if (validatePasswordChange()) {
      // Aquí se enviaría el cambio de contraseña al backend
      console.log('Cambiar contraseña');
      
      setShowPasswordChange(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      alert('✅ Contraseña actualizada exitosamente');
    }
  };

  const handleDeleteAccount = () => {
    // Aquí se enviaría la solicitud de eliminación al backend
    console.log('Eliminar cuenta');
    logout();
    alert('⚠️ Cuenta eliminada');
  };

  const getRoleBadge = (role: string) => {
    const badges = {
      admin: { label: 'Administrador', class: 'role-admin' },
      coordinator: { label: 'Coordinador', class: 'role-coordinator' },
      producer: { label: 'Productor', class: 'role-producer' },
      user: { label: 'Usuario', class: 'role-user' },
    };
    return badges[role as keyof typeof badges] || badges.user;
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1 className="page-title">
          <span className="page-icon">👤</span>
          Mi Perfil
        </h1>
        <p className="page-description">Gestiona tu información personal y configuración de cuenta</p>
      </div>

      <div className="profile-content">
        {/* Vista de Perfil */}
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              <span className="avatar-icon">👤</span>
            </div>
            <div className="profile-info">
              <h2 className="profile-name">{formData.fullName || formData.username}</h2>
              <span className={`role-badge ${getRoleBadge(formData.role).class}`}>
                {getRoleBadge(formData.role).label}
              </span>
            </div>
            {!isEditing && (
              <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                ✏️ Editar Perfil
              </button>
            )}
          </div>

          {isEditing ? (
            /* Formulario de Edición */
            <div className="profile-form">
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
                  />
                  {errors.username && <span className="error-message">{errors.username}</span>}
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
                </div>
              </div>

              <div className="form-actions">
                <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                  Cancelar
                </button>
                <button className="btn btn-primary" onClick={handleSaveProfile}>
                  💾 Guardar Cambios
                </button>
              </div>
            </div>
          ) : (
            /* Vista de Información */
            <div className="profile-details">
              <div className="detail-row">
                <div className="detail-item">
                  <span className="detail-label">Nombre de Usuario:</span>
                  <span className="detail-value">{formData.username}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{formData.email}</span>
                </div>
              </div>

              <div className="detail-row">
                <div className="detail-item">
                  <span className="detail-label">Nombre Completo:</span>
                  <span className="detail-value">{formData.fullName || 'No especificado'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Teléfono:</span>
                  <span className="detail-value">{formData.phone || 'No especificado'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cambio de Contraseña */}
        <div className="security-card">
          <div className="card-header">
            <h3>🔒 Seguridad de la Cuenta</h3>
          </div>

          {!showPasswordChange ? (
            <div className="security-actions">
              <p>Mantén tu cuenta segura actualizando tu contraseña regularmente</p>
              <button
                className="btn btn-outline"
                onClick={() => setShowPasswordChange(true)}
              >
                🔑 Cambiar Contraseña
              </button>
            </div>
          ) : (
            <div className="password-form">
              <div className="form-group">
                <label htmlFor="currentPassword">
                  Contraseña Actual <span className="required">*</span>
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className={errors.currentPassword ? 'error' : ''}
                />
                {errors.currentPassword && (
                  <span className="error-message">{errors.currentPassword}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">
                  Nueva Contraseña <span className="required">*</span>
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className={errors.newPassword ? 'error' : ''}
                />
                {errors.newPassword && (
                  <span className="error-message">{errors.newPassword}</span>
                )}
                <small className="input-hint">Mínimo 8 caracteres</small>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  Confirmar Nueva Contraseña <span className="required">*</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className={errors.confirmPassword ? 'error' : ''}
                />
                {errors.confirmPassword && (
                  <span className="error-message">{errors.confirmPassword}</span>
                )}
              </div>

              <div className="form-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowPasswordChange(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                    });
                    setErrors({});
                  }}
                >
                  Cancelar
                </button>
                <button className="btn btn-primary" onClick={handleChangePassword}>
                  🔒 Actualizar Contraseña
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Zona de Peligro */}
        <div className="danger-zone">
          <div className="card-header">
            <h3>⚠️ Zona de Peligro</h3>
          </div>

          <div className="danger-content">
            <div className="danger-info">
              <h4>Eliminar Cuenta</h4>
              <p>
                Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, estés seguro.
              </p>
            </div>

            {!showDeleteConfirm ? (
              <button
                className="btn btn-danger"
                onClick={() => setShowDeleteConfirm(true)}
              >
                🗑️ Eliminar Cuenta
              </button>
            ) : (
              <div className="delete-confirm">
                <p className="confirm-text">
                  <strong>¿Estás absolutamente seguro?</strong>
                  <br />
                  Esta acción no se puede deshacer.
                </p>
                <div className="confirm-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancelar
                  </button>
                  <button className="btn btn-danger-solid" onClick={handleDeleteAccount}>
                    Sí, Eliminar mi Cuenta
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <HelpButton pageKey="profile" />
    </div>
  );
}
