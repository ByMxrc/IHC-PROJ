/**
 * Página Principal - Home
 * ETAPA 1: CONTEXTO - Presentación del sistema
 */

import { useAuth } from '../context/AuthContext';
import { useHomeContent } from '../context/HomeContentContext';
import './HomePage.css';

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const { content } = useHomeContent();

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-icon">🌾</span>
            {content.heroTitle}
          </h1>
          <p className="hero-subtitle">
            {content.heroSubtitle}
          </p>
          
          {!isAuthenticated && (
            <div className="login-prompt">
              <p className="login-prompt-text">
                <span className="prompt-icon">🔐</span>
                Para acceder a todas las funcionalidades del sistema, por favor inicie sesión.
              </p>
              <p className="login-prompt-hint">
                Haga clic en el botón <strong>"Iniciar Sesión"</strong> en el menú superior.
              </p>
            </div>
          )}
          
          {isAuthenticated && (
            <div className="welcome-message">
              <p className="welcome-text">
                <span className="welcome-icon">👋</span>
                ¡Bienvenido, <strong>{user?.username}</strong>!
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Funcionalidades del Sistema</h2>
        <div className="features-grid">
          {content.featureCards
            .sort((a, b) => a.order - b.order)
            .map((card) => (
              <div key={card.id} className="feature-card">
                <div className="feature-icon">{card.icon}</div>
                <h3 className="feature-title">{card.title}</h3>
                <p className="feature-description">{card.description}</p>
              </div>
            ))}
        </div>
      </section>

      <section className="context-section">
        <h2 className="section-title">{content.contextTitle}</h2>
        <div className="context-content">
          <div className="context-text">
            {content.contextParagraphs.map((paragraph, index) => (
              <p key={index} className="context-paragraph">
                {paragraph}
              </p>
            ))}
          </div>
          
          <div className="benefits-grid">
            {content.benefitCards
              .sort((a, b) => a.order - b.order)
              .map((card) => (
                <div key={card.id} className="benefit-card">
                  <span className="benefit-icon">{card.icon}</span>
                  <h4>{card.title}</h4>
                  <ul>
                    {card.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>
      </section>

      <section className="mission-section">
        <h2 className="section-title">Nuestra Misión</h2>
        <div className="mission-content">
          <p className="mission-text">
            <span className="mission-icon">🎯</span>
            {content.missionText}
          </p>
        </div>
      </section>
    </div>
  );
}
