/**
 * Modal de Términos y Condiciones
 * Se muestra en el primer login y requiere aceptación obligatoria
 */

import './TermsModal.css';

interface TermsModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export default function TermsModal({ isOpen, onAccept, onDecline }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="terms-modal-overlay">
      <div className="terms-modal">
        <h2 className="terms-title">📄 Términos y Condiciones de Uso</h2>
        
        <div className="terms-content">
          <section>
            <h3>1. Aceptación de Términos</h3>
            <p>
              Al utilizar el Sistema de Gestión de Ferias Agroproductivas (AgroFeria),
              usted acepta estar sujeto a estos Términos y Condiciones. Si no está de
              acuerdo, no debe utilizar el sistema.
            </p>
          </section>

          <section>
            <h3>2. Uso del Sistema</h3>
            <p>
              El sistema está diseñado para la gestión y organización de ferias
              agroproductivas, facilitando el registro de productores, inscripción a
              ferias, gestión de transporte y seguimiento de ventas.
            </p>
            <ul>
              <li>El acceso está restringido a usuarios autorizados</li>
              <li>Cada usuario es responsable de su cuenta y credenciales</li>
              <li>El sistema está protegido por medidas de seguridad</li>
            </ul>
          </section>

          <section>
            <h3>3. Responsabilidades del Usuario</h3>
            <p>Como usuario del sistema, usted se compromete a:</p>
            <ul>
              <li>Mantener la confidencialidad de sus credenciales de acceso</li>
              <li>Proporcionar información veraz y actualizada</li>
              <li>No utilizar el sistema para fines ilícitos o no autorizados</li>
              <li>Respetar los derechos de otros usuarios</li>
              <li>Notificar cualquier uso no autorizado de su cuenta</li>
            </ul>
          </section>

          <section>
            <h3>4. Protección de Datos Personales</h3>
            <p>
              Nos comprometemos a proteger su información personal de acuerdo con
              nuestra Política de Privacidad y las leyes aplicables de protección de
              datos. Sus datos serán utilizados únicamente para los fines del sistema.
            </p>
          </section>

          <section>
            <h3>5. Seguridad</h3>
            <p>
              El sistema implementa medidas de seguridad que incluyen:
            </p>
            <ul>
              <li>Bloqueo temporal después de intentos fallidos de login</li>
              <li>Sesiones con expiración automática</li>
              <li>Registro de auditoría de acciones importantes</li>
              <li>Encriptación de datos sensibles</li>
            </ul>
          </section>

          <section>
            <h3>6. Propiedad Intelectual</h3>
            <p>
              Todos los derechos de propiedad intelectual del sistema, incluyendo
              el código fuente, diseño, y contenido, pertenecen a sus respectivos
              propietarios y están protegidos por las leyes de propiedad intelectual.
            </p>
          </section>

          <section>
            <h3>7. Limitación de Responsabilidad</h3>
            <p>
              El sistema se proporciona "tal cual" y no garantizamos que esté libre
              de errores o que funcione sin interrupciones. No somos responsables por
              daños indirectos, incidentales o consecuentes derivados del uso del sistema.
            </p>
          </section>

          <section>
            <h3>8. Modificaciones</h3>
            <p>
              Nos reservamos el derecho de modificar estos términos en cualquier momento.
              Se notificará a los usuarios de cambios significativos y se requerirá
              una nueva aceptación.
            </p>
          </section>

          <section>
            <h3>9. Terminación</h3>
            <p>
              Podemos suspender o terminar su acceso al sistema en caso de violación
              de estos términos o por razones de seguridad.
            </p>
          </section>

          <section>
            <h3>10. Contacto</h3>
            <p>
              Para preguntas sobre estos términos, puede contactarnos a través de
              los canales oficiales del sistema.
            </p>
          </section>

          <p className="terms-date">
            <strong>Última actualización:</strong> 2 de noviembre de 2025<br />
            <strong>Versión:</strong> 1.0
          </p>
        </div>

        <div className="terms-actions">
          <p className="terms-notice">
            ⚠️ Debe aceptar los términos y condiciones para usar el sistema
          </p>
          <button className="btn-decline" onClick={onDecline}>
            Rechazar y Salir
          </button>
          <button className="btn-accept" onClick={onAccept}>
            ✓ Acepto los Términos y Condiciones
          </button>
        </div>
      </div>
    </div>
  );
}
