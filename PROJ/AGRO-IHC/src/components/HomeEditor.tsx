/**
 * Editor de Contenido de la Página de Inicio
 * Solo accesible para administradores
 */

import { useState } from 'react';
import { useHomeContent } from '../context/HomeContentContext';
import type { FeatureCard, BenefitCard } from '../types';
import './HomeEditor.css';

export default function HomeEditor() {
  const { content, updateContent, resetToDefault } = useHomeContent();
  const [activeTab, setActiveTab] = useState<'hero' | 'features' | 'benefits' | 'context' | 'mission'>('hero');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('¿Está seguro que desea restaurar el contenido por defecto? Se perderán todos los cambios.')) {
      resetToDefault();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  // Hero Section
  const updateHero = (field: 'heroTitle' | 'heroSubtitle', value: string) => {
    updateContent({ ...content, [field]: value });
  };

  // Features
  const addFeatureCard = () => {
    const newCard: FeatureCard = {
      id: Date.now().toString(),
      icon: '📌',
      title: 'Nueva Funcionalidad',
      description: 'Descripción de la funcionalidad',
      order: content.featureCards.length + 1,
    };
    updateContent({
      ...content,
      featureCards: [...content.featureCards, newCard],
    });
  };

  const updateFeatureCard = (id: string, field: keyof FeatureCard, value: string | number) => {
    updateContent({
      ...content,
      featureCards: content.featureCards.map((card) =>
        card.id === id ? { ...card, [field]: value } : card
      ),
    });
  };

  const deleteFeatureCard = (id: string) => {
    if (window.confirm('¿Eliminar esta tarjeta?')) {
      updateContent({
        ...content,
        featureCards: content.featureCards.filter((card) => card.id !== id),
      });
    }
  };

  // Benefits
  const addBenefitCard = () => {
    const newCard: BenefitCard = {
      id: Date.now().toString(),
      icon: '✨',
      title: 'Nuevo Beneficio',
      benefits: ['Beneficio 1', 'Beneficio 2'],
      order: content.benefitCards.length + 1,
    };
    updateContent({
      ...content,
      benefitCards: [...content.benefitCards, newCard],
    });
  };

  const updateBenefitCard = (id: string, field: 'icon' | 'title' | 'order', value: string | number) => {
    updateContent({
      ...content,
      benefitCards: content.benefitCards.map((card) =>
        card.id === id ? { ...card, [field]: value } : card
      ),
    });
  };

  const updateBenefitItem = (cardId: string, benefitIndex: number, value: string) => {
    updateContent({
      ...content,
      benefitCards: content.benefitCards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              benefits: card.benefits.map((b, i) => (i === benefitIndex ? value : b)),
            }
          : card
      ),
    });
  };

  const addBenefitItem = (cardId: string) => {
    updateContent({
      ...content,
      benefitCards: content.benefitCards.map((card) =>
        card.id === cardId
          ? { ...card, benefits: [...card.benefits, 'Nuevo beneficio'] }
          : card
      ),
    });
  };

  const deleteBenefitItem = (cardId: string, benefitIndex: number) => {
    updateContent({
      ...content,
      benefitCards: content.benefitCards.map((card) =>
        card.id === cardId
          ? { ...card, benefits: card.benefits.filter((_, i) => i !== benefitIndex) }
          : card
      ),
    });
  };

  const deleteBenefitCard = (id: string) => {
    if (window.confirm('¿Eliminar esta tarjeta?')) {
      updateContent({
        ...content,
        benefitCards: content.benefitCards.filter((card) => card.id !== id),
      });
    }
  };

  // Context
  const updateContextTitle = (value: string) => {
    updateContent({ ...content, contextTitle: value });
  };

  const updateContextParagraph = (index: number, value: string) => {
    updateContent({
      ...content,
      contextParagraphs: content.contextParagraphs.map((p, i) => (i === index ? value : p)),
    });
  };

  const addContextParagraph = () => {
    updateContent({
      ...content,
      contextParagraphs: [...content.contextParagraphs, 'Nuevo párrafo de contexto...'],
    });
  };

  const deleteContextParagraph = (index: number) => {
    if (window.confirm('¿Eliminar este párrafo?')) {
      updateContent({
        ...content,
        contextParagraphs: content.contextParagraphs.filter((_, i) => i !== index),
      });
    }
  };

  // Mission
  const updateMission = (value: string) => {
    updateContent({ ...content, missionText: value });
  };

  return (
    <div className="home-editor">
      <div className="editor-header">
        <h1 className="editor-title">
          <span className="editor-icon">✏️</span>
          Editor de Página de Inicio
        </h1>
        <div className="editor-actions">
          <button className="btn-reset" onClick={handleReset}>
            🔄 Restaurar Defecto
          </button>
          <button className="btn-save" onClick={handleSave}>
            💾 Guardar Cambios
          </button>
        </div>
      </div>

      {showSuccess && (
        <div className="success-message">
          ✅ Cambios guardados exitosamente
        </div>
      )}

      <div className="editor-tabs">
        <button
          className={`tab ${activeTab === 'hero' ? 'active' : ''}`}
          onClick={() => setActiveTab('hero')}
        >
          🎯 Portada
        </button>
        <button
          className={`tab ${activeTab === 'features' ? 'active' : ''}`}
          onClick={() => setActiveTab('features')}
        >
          ⚡ Funcionalidades
        </button>
        <button
          className={`tab ${activeTab === 'context' ? 'active' : ''}`}
          onClick={() => setActiveTab('context')}
        >
          📝 Contexto
        </button>
        <button
          className={`tab ${activeTab === 'benefits' ? 'active' : ''}`}
          onClick={() => setActiveTab('benefits')}
        >
          🎁 Beneficios
        </button>
        <button
          className={`tab ${activeTab === 'mission' ? 'active' : ''}`}
          onClick={() => setActiveTab('mission')}
        >
          🎯 Misión
        </button>
      </div>

      <div className="editor-content">
        {/* Hero Tab */}
        {activeTab === 'hero' && (
          <div className="editor-section">
            <h2>Sección Portada</h2>
            <div className="form-group">
              <label>Título Principal</label>
              <input
                type="text"
                value={content.heroTitle}
                onChange={(e) => updateHero('heroTitle', e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Subtítulo</label>
              <input
                type="text"
                value={content.heroSubtitle}
                onChange={(e) => updateHero('heroSubtitle', e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        )}

        {/* Features Tab */}
        {activeTab === 'features' && (
          <div className="editor-section">
            <div className="section-header">
              <h2>Tarjetas de Funcionalidades</h2>
              <button className="btn-add" onClick={addFeatureCard}>
                ➕ Agregar Tarjeta
              </button>
            </div>
            <div className="cards-list">
              {content.featureCards
                .sort((a, b) => a.order - b.order)
                .map((card) => (
                  <div key={card.id} className="card-editor">
                    <div className="card-editor-header">
                      <span className="card-number">#{card.order}</span>
                      <button
                        className="btn-delete-small"
                        onClick={() => deleteFeatureCard(card.id)}
                      >
                        🗑️
                      </button>
                    </div>
                    <div className="form-row">
                      <div className="form-group small">
                        <label>Icono</label>
                        <input
                          type="text"
                          value={card.icon}
                          onChange={(e) => updateFeatureCard(card.id, 'icon', e.target.value)}
                          className="form-input"
                          placeholder="🎯"
                        />
                      </div>
                      <div className="form-group small">
                        <label>Orden</label>
                        <input
                          type="number"
                          value={card.order}
                          onChange={(e) => updateFeatureCard(card.id, 'order', parseInt(e.target.value))}
                          className="form-input"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Título</label>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => updateFeatureCard(card.id, 'title', e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Descripción</label>
                      <textarea
                        value={card.description}
                        onChange={(e) => updateFeatureCard(card.id, 'description', e.target.value)}
                        className="form-textarea"
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Context Tab */}
        {activeTab === 'context' && (
          <div className="editor-section">
            <h2>Sección de Contexto</h2>
            <div className="form-group">
              <label>Título de la Sección</label>
              <input
                type="text"
                value={content.contextTitle}
                onChange={(e) => updateContextTitle(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="section-header">
              <h3>Párrafos</h3>
              <button className="btn-add" onClick={addContextParagraph}>
                ➕ Agregar Párrafo
              </button>
            </div>
            {content.contextParagraphs.map((paragraph, index) => (
              <div key={index} className="paragraph-editor">
                <div className="paragraph-header">
                  <label>Párrafo {index + 1}</label>
                  <button
                    className="btn-delete-small"
                    onClick={() => deleteContextParagraph(index)}
                  >
                    🗑️
                  </button>
                </div>
                <textarea
                  value={paragraph}
                  onChange={(e) => updateContextParagraph(index, e.target.value)}
                  className="form-textarea"
                  rows={4}
                />
              </div>
            ))}
          </div>
        )}

        {/* Benefits Tab */}
        {activeTab === 'benefits' && (
          <div className="editor-section">
            <div className="section-header">
              <h2>Tarjetas de Beneficios</h2>
              <button className="btn-add" onClick={addBenefitCard}>
                ➕ Agregar Tarjeta
              </button>
            </div>
            <div className="cards-list">
              {content.benefitCards
                .sort((a, b) => a.order - b.order)
                .map((card) => (
                  <div key={card.id} className="card-editor">
                    <div className="card-editor-header">
                      <span className="card-number">#{card.order}</span>
                      <button
                        className="btn-delete-small"
                        onClick={() => deleteBenefitCard(card.id)}
                      >
                        🗑️
                      </button>
                    </div>
                    <div className="form-row">
                      <div className="form-group small">
                        <label>Icono</label>
                        <input
                          type="text"
                          value={card.icon}
                          onChange={(e) => updateBenefitCard(card.id, 'icon', e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group small">
                        <label>Orden</label>
                        <input
                          type="number"
                          value={card.order}
                          onChange={(e) => updateBenefitCard(card.id, 'order', parseInt(e.target.value))}
                          className="form-input"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Título</label>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => updateBenefitCard(card.id, 'title', e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div className="benefits-list">
                      <div className="benefits-header">
                        <label>Lista de Beneficios</label>
                        <button
                          className="btn-add-small"
                          onClick={() => addBenefitItem(card.id)}
                        >
                          ➕
                        </button>
                      </div>
                      {card.benefits.map((benefit, index) => (
                        <div key={index} className="benefit-item">
                          <input
                            type="text"
                            value={benefit}
                            onChange={(e) => updateBenefitItem(card.id, index, e.target.value)}
                            className="form-input"
                          />
                          <button
                            className="btn-delete-small"
                            onClick={() => deleteBenefitItem(card.id, index)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Mission Tab */}
        {activeTab === 'mission' && (
          <div className="editor-section">
            <h2>Sección Misión</h2>
            <div className="form-group">
              <label>Texto de la Misión</label>
              <textarea
                value={content.missionText}
                onChange={(e) => updateMission(e.target.value)}
                className="form-textarea"
                rows={6}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
