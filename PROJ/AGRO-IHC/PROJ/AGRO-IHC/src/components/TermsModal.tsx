/**
 * Modal de Términos y Condiciones
 * Se muestra en el primer login y requiere aceptación obligatoria
 * Incluye funcionalidad de descarga y lectura de voz
 */

import { useTTS } from '../hooks/useTTS';
import './TermsModal.css';

interface TermsModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export default function TermsModal({ isOpen, onAccept, onDecline }: TermsModalProps) {
  const { getButtonProps } = useTTS();

  if (!isOpen) return null;

  const handleDownload = () => {
    const termsText = `
TÉRMINOS Y CONDICIONES DE USO\nSistema de Gestión de Ferias Agroproductivas - AGRO-IHC\n\nÚltima actualización: ${new Date().toLocaleDateString('es-ES')}\n\n` +
      `1. ¿QUÉ ES ESTE SISTEMA?\n\n` +
      `AgroFeria es un sistema para organizar ferias agrícolas. Aquí puedes:\n` +
      `✓ Registrar productores y sus productos\n` +
      `✓ Inscribirte a ferias\n` +
      `✓ Organizar transporte\n` +
      `✓ Registrar tus ventas\n\n` +
      `Al usar este sistema, aceptas seguir estas reglas. Si no estás de acuerdo, no podrás usarlo.\n\n` +
      `2. TU CUENTA ES PERSONAL\n\n` +
      `Tu cuenta es solo para ti. Debes:\n` +
      `- Guardar tu contraseña en secreto (no la compartas con nadie)\n` +
      `- Escribir información verdadera\n` +
      `- No hacer cosas prohibidas o dañinas\n` +
      `- Respetar a otros usuarios\n` +
      `- Avisar si alguien más usa tu cuenta\n\n` +
      `3. PROTEGEMOS TU INFORMACIÓN\n\n` +
      `Tu información personal está segura con nosotros. Solo la usamos para que el sistema funcione. ` +
      `No la compartimos con otras personas.\n\n` +
      `4. EL SISTEMA ES SEGURO\n\n` +
      `Para protegerte, el sistema tiene:\n` +
      `- Se bloquea si alguien intenta entrar muchas veces con contraseña incorrecta\n` +
      `- Tu sesión se cierra automáticamente si no la usas\n` +
      `- Guardamos un registro de acciones importantes\n` +
      `- Tu información está cifrada (protegida)\n\n` +
      `5. PODEMOS HACER CAMBIOS\n\n` +
      `Podemos cambiar estas reglas cuando sea necesario. Si hacemos cambios importantes, ` +
      `te avisaremos y tendrás que aceptar las nuevas reglas.\n\n` +
      `6. PODEMOS BLOQUEAR TU CUENTA\n\n` +
      `Si no sigues estas reglas o haces algo malo, podemos bloquear tu cuenta para proteger ` +
      `a todos los usuarios.\n\n` +
      `7. EL SISTEMA PUEDE TENER ERRORES\n\n` +
      `Hacemos nuestro mejor esfuerzo, pero a veces pueden haber errores. No somos responsables ` +
      `si pierdes información por un error del sistema. Por eso, te recomendamos guardar tus datos importantes.\n\n` +
      `8. ¿TIENES PREGUNTAS?\n\n` +
      `Si tienes dudas sobre estas reglas, pregunta a tu coordinador o administrador del sistema. ` +
      `Ellos te pueden ayudar.\n\n` +
      `© 2025 Sistema de Gestión de Ferias Agroproductivas - AGRO-IHC\n` +
      `Todos los derechos reservados.`;

    const blob = new Blob([termsText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Terminos_y_Condiciones_AGRO_IHC_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="terms-modal-overlay">
      <div className="terms-modal">
        <h2 className="terms-title">📄 Términos y Condiciones de Uso</h2>
        
        <div className="terms-content">
          <section>
            <h3>1. ¿Qué es este sistema?</h3>
            <p>
              AgroFeria es un sistema para organizar ferias agrícolas. Aquí puedes:
            </p>
            <ul>
              <li>✅ Registrar productores y sus productos</li>
              <li>✅ Inscribirte a ferias</li>
              <li>✅ Organizar transporte</li>
              <li>✅ Registrar tus ventas</li>
            </ul>
            <p>
              Al usar este sistema, aceptas seguir estas reglas. Si no estás de acuerdo, 
              no podrás usarlo.
            </p>
          </section>

          <section>
            <h3>2. Tu cuenta es personal</h3>
            <p>Tu cuenta es solo para ti. Debes:</p>
            <ul>
              <li>🔒 Guardar tu contraseña en secreto (no la compartas con nadie)</li>
              <li>📝 Escribir información verdadera</li>
              <li>✋ No hacer cosas prohibidas o dañinas</li>
              <li>🤝 Respetar a otros usuarios</li>
              <li>⚠️ Avisar si alguien más usa tu cuenta</li>
            </ul>
          </section>

          <section>
            <h3>3. Protegemos tu información</h3>
            <p>
              Tu información personal está segura con nosotros. Solo la usamos 
              para que el sistema funcione. No la compartimos con otras personas.
            </p>
          </section>

          <section>
            <h3>4. El sistema es seguro</h3>
            <p>
              Para protegerte, el sistema tiene:
            </p>
            <ul>
              <li>🚫 Se bloquea si alguien intenta entrar muchas veces con contraseña incorrecta</li>
              <li>⏰ Tu sesión se cierra automáticamente si no la usas</li>
              <li>📋 Guardamos un registro de acciones importantes</li>
              <li>🔐 Tu información está cifrada (protegida)</li>
            </ul>
          </section>

          <section>
            <h3>5. Podemos hacer cambios</h3>
            <p>
              Podemos cambiar estas reglas cuando sea necesario. Si hacemos cambios 
              importantes, te avisaremos y tendrás que aceptar las nuevas reglas.
            </p>
          </section>

          <section>
            <h3>6. Podemos bloquear tu cuenta</h3>
            <p>
              Si no sigues estas reglas o haces algo malo, podemos bloquear tu cuenta 
              para proteger a todos los usuarios.
            </p>
          </section>

          <section>
            <h3>7. El sistema puede tener errores</h3>
            <p>
              Hacemos nuestro mejor esfuerzo, pero a veces pueden haber errores. 
              No somos responsables si pierdes información por un error del sistema.
              Por eso, te recomendamos guardar tus datos importantes.
            </p>
          </section>

          <section>
            <h3>8. ¿Tienes preguntas?</h3>
            <p>
              Si tienes dudas sobre estas reglas, pregunta a tu coordinador o 
              administrador del sistema. Ellos te pueden ayudar.
            </p>
          </section>

          <p className="terms-date">
            <strong>📅 Última actualización:</strong> 16 de noviembre de 2025<br />
            <strong>📌 Versión:</strong> 1.1
          </p>
        </div>

        <div className="terms-actions">
          <p className="terms-notice">
            ⚠️ Para usar el sistema, debes aceptar estas reglas
          </p>
          <div className="terms-buttons-row">
            <button
              className="btn-download"
              onClick={handleDownload}
              {...getButtonProps('Descargar términos y condiciones')}
            >
              📥 Descargar
            </button>
            <button
              className="btn-decline"
              onClick={onDecline}
              {...getButtonProps('No acepto, salir del sistema')}
            >
              ❌ No acepto (salir)
            </button>
            <button
              className="btn-accept"
              onClick={onAccept}
              {...getButtonProps('Acepto los términos y condiciones')}
            >
              ✓ Sí, acepto las reglas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
