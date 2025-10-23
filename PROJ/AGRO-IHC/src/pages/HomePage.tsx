/**
 * Página Principal - Home
 * ETAPA 1: CONTEXTO - Presentación del sistema
 */

import './HomePage.css';

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-icon">🌾</span>
            Sistema de Gestión de Ferias Agroproductivas
          </h1>
          <p className="hero-subtitle">
            Conectando productores agrícolas con oportunidades de comercialización
          </p>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Funcionalidades del Sistema</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">👨‍🌾</div>
            <h3 className="feature-title">Inscripción de Productores</h3>
            <p className="feature-description">
              Registro completo de productores agrícolas con validación de datos y gestión de perfiles.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎪</div>
            <h3 className="feature-title">Calendario de Ferias</h3>
            <p className="feature-description">
              Gestión de ferias agroproductivas con fechas, ubicaciones y capacidad de participantes.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3 className="feature-title">Inscripciones</h3>
            <p className="feature-description">
              Sistema de inscripción a ferias con gestión de cupos y confirmación automática.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3 className="feature-title">Logística de Transporte</h3>
            <p className="feature-description">
              Coordinación de transporte para productos desde el origen hasta la feria.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3 className="feature-title">Comercialización</h3>
            <p className="feature-description">
              Registro de ventas y seguimiento del rendimiento de cada productor.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Reportes</h3>
            <p className="feature-description">
              Análisis y estadísticas para mejorar la toma de decisiones.
            </p>
          </div>
        </div>
      </section>

      <section className="usability-section">
        <h2 className="section-title">Parámetros de Usabilidad Implementados</h2>
        <div className="usability-grid">
          <div className="usability-card">
            <h3>📱 Diseño Responsive</h3>
            <p>Adaptado para dispositivos móviles, tablets y escritorio.</p>
          </div>
          <div className="usability-card">
            <h3>♿ Accesibilidad</h3>
            <p>Cumple con estándares WCAG AA para accesibilidad web.</p>
          </div>
          <div className="usability-card">
            <h3>✅ Validación en Tiempo Real</h3>
            <p>Feedback inmediato en formularios para prevenir errores.</p>
          </div>
          <div className="usability-card">
            <h3>🎯 Navegación Clara</h3>
            <p>Menú intuitivo con indicadores visuales de ubicación.</p>
          </div>
        </div>
      </section>

      <section className="standards-section">
        <h2 className="section-title">Normas Aplicadas</h2>
        <div className="standards-content">
          <div className="standard-item">
            <h3>ISO 9241-11 – Usabilidad</h3>
            <p>
              <strong>Eficacia:</strong> El sistema permite completar tareas exitosamente.<br />
              <strong>Eficiencia:</strong> Las tareas se realizan con mínimo esfuerzo.<br />
              <strong>Satisfacción:</strong> Interfaz agradable y fácil de usar.
            </p>
          </div>
          <div className="standard-item">
            <h3>ISO 9241-210 – Diseño Centrado en el Usuario</h3>
            <p>
              El sistema fue desarrollado considerando las necesidades reales de productores agrícolas,
              organizadores de ferias y personal de logística.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
