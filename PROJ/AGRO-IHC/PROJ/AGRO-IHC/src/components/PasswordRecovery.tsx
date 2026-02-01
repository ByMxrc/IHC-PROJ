/**
 * Componente de Recuperación de Contraseña
 * Simulación de flujo de recuperación con validación de email y código
 */

import { useState } from 'react';
import type { FormEvent } from 'react';
import { validateEmail } from '../utils/validation';
import './PasswordRecovery.css';

interface PasswordRecoveryProps {
  onClose: () => void;
}

type Step = 'email' | 'code' | 'success';

export default function PasswordRecovery({ onClose }: PasswordRecoveryProps) {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [generatedCode] = useState(() => Math.floor(100000 + Math.random() * 900000).toString());

  const handleSendCode = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Por favor ingrese un correo electrónico válido');
      return;
    }

    // Simular envío de código
    console.log('📧 Código enviado a:', email);
    console.log('🔑 Código de recuperación:', generatedCode);
    alert(`Código simulado enviado: ${generatedCode}`);
    setStep('code');
  };

  const handleVerifyCode = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (code !== generatedCode) {
      setError('Código incorrecto. Intente nuevamente.');
      return;
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Simular cambio de contraseña
    console.log('✅ Contraseña actualizada para:', email);
    setStep('success');
  };

  return (
    <div className="password-recovery-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="password-recovery-modal">
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>

        {step === 'email' && (
          <form onSubmit={handleSendCode}>
            <div className="recovery-icon">🔐</div>
            <h2>Recuperar Contraseña</h2>
            <p className="recovery-description">
              Ingrese su correo electrónico y le enviaremos un código de verificación.
            </p>

            {error && (
              <div className="error-banner" role="alert">
                ⚠️ {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="form-input"
                required
              />
            </div>

            <button type="submit" className="btn-primary">
              Enviar Código
            </button>
          </form>
        )}

        {step === 'code' && (
          <form onSubmit={handleVerifyCode}>
            <div className="recovery-icon">📧</div>
            <h2>Verificar Código</h2>
            <p className="recovery-description">
              Ingrese el código de 6 dígitos enviado a <strong>{email}</strong>
            </p>

            {error && (
              <div className="error-banner" role="alert">
                ⚠️ {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="code">Código de Verificación</label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className="form-input code-input"
                maxLength={6}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">Nueva Contraseña</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita la contraseña"
                className="form-input"
                required
              />
            </div>

            <button type="submit" className="btn-primary">
              Verificar y Cambiar
            </button>
            <button type="button" className="btn-secondary" onClick={() => setStep('email')}>
              Volver
            </button>
          </form>
        )}

        {step === 'success' && (
          <div className="success-content">
            <div className="success-icon">✅</div>
            <h2>¡Contraseña Actualizada!</h2>
            <p className="success-description">
              Su contraseña ha sido cambiada exitosamente.
              Ya puede iniciar sesión con su nueva contraseña.
            </p>
            <button className="btn-primary" onClick={onClose}>
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
