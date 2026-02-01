/**
 * Panel de Administración de Traducciones
 * Permite a los administradores gestionar traducciones en múltiples idiomas
 */

import { useState, useEffect } from 'react';
import { translationsAPI } from '../services/api';
import './TranslationsPanel.css';

interface Language {
  language_code: string;
  language_name: string;
  is_active: boolean;
}

export default function TranslationsPanel() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('es');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Cargar idiomas disponibles
  useEffect(() => {
    loadLanguages();
  }, []);

  // Cargar traducciones cuando cambia el idioma
  useEffect(() => {
    if (selectedLanguage) {
      loadTranslations(selectedLanguage);
    }
  }, [selectedLanguage]);

  const loadLanguages = async () => {
    try {
      const response = await translationsAPI.getLanguages();
      if (response.success) {
        setLanguages(response.data);
      }
    } catch (error) {
      console.error('Error al cargar idiomas:', error);
    }
  };

  const loadTranslations = async (lang: string) => {
    setLoading(true);
    try {
      const response = await translationsAPI.getHomeContent(lang);
      if (response.success) {
        setTranslations(response.data);
      }
    } catch (error) {
      console.error('Error al cargar traducciones:', error);
      showMessage('error', 'Error al cargar traducciones');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (key: string, value: string) => {
    setEditingKey(key);
    setEditValue(value);
  };

  const handleSave = async (key: string) => {
    if (!editValue.trim()) {
      showMessage('error', 'El contenido no puede estar vacío');
      return;
    }

    setSaving(true);
    try {
      const response = await translationsAPI.updateHomeContent(key, selectedLanguage, editValue);
      
      if (response.success) {
        setTranslations(prev => ({
          ...prev,
          [key]: editValue
        }));
        setEditingKey(null);
        setEditValue('');
        showMessage('success', '✅ Traducción guardada exitosamente');
      }
    } catch (error: any) {
      showMessage('error', error.message || 'Error al guardar traducción');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingKey(null);
    setEditValue('');
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const translationKeys = [
    { key: 'welcome_title', label: 'Título de Bienvenida' },
    { key: 'welcome_message', label: 'Mensaje de Bienvenida' },
    { key: 'mission_title', label: 'Título de Misión' },
    { key: 'mission', label: 'Misión' },
    { key: 'features_title', label: 'Título de Características' },
    { key: 'feature_1', label: 'Característica 1' },
    { key: 'feature_2', label: 'Característica 2' },
    { key: 'feature_3', label: 'Característica 3' },
    { key: 'feature_4', label: 'Característica 4' },
    { key: 'cta_title', label: 'Título de Call-to-Action' },
    { key: 'cta_message', label: 'Mensaje de Call-to-Action' },
  ];

  return (
    <div className="translations-panel">
      <div className="panel-header">
        <h1>🌍 Panel de Traducciones</h1>
        <p className="panel-subtitle">
          Gestiona el contenido multiidioma del sistema
        </p>
      </div>

      {message && (
        <div className={`message-banner ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Selector de Idioma */}
      <div className="language-selector-panel">
        <label htmlFor="language-select">
          <strong>Idioma a Editar:</strong>
        </label>
        <div className="language-buttons">
          {languages.map(lang => (
            <button
              key={lang.language_code}
              className={`lang-button ${selectedLanguage === lang.language_code ? 'active' : ''}`}
              onClick={() => setSelectedLanguage(lang.language_code)}
              disabled={!lang.is_active}
            >
              {lang.language_code === 'es' ? '🇪🇸' : '🇬🇧'} {lang.language_name}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de Traducciones */}
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando traducciones...</p>
        </div>
      ) : (
        <div className="translations-table">
          <table>
            <thead>
              <tr>
                <th>Clave</th>
                <th>Contenido</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {translationKeys.map(({ key, label }) => (
                <tr key={key}>
                  <td className="key-cell">
                    <strong>{label}</strong>
                    <code>{key}</code>
                  </td>
                  <td className="content-cell">
                    {editingKey === key ? (
                      <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        rows={3}
                        className="edit-textarea"
                        autoFocus
                      />
                    ) : (
                      <div className="content-display">
                        {translations[key] || (
                          <span className="no-translation">Sin traducción</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="actions-cell">
                    {editingKey === key ? (
                      <div className="action-buttons">
                        <button
                          className="btn-save"
                          onClick={() => handleSave(key)}
                          disabled={saving}
                        >
                          {saving ? '💾 Guardando...' : '✅ Guardar'}
                        </button>
                        <button
                          className="btn-cancel"
                          onClick={handleCancel}
                          disabled={saving}
                        >
                          ❌ Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(key, translations[key] || '')}
                      >
                        ✏️ Editar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Información adicional */}
      <div className="panel-footer">
        <div className="info-card">
          <h3>ℹ️ Información</h3>
          <ul>
            <li>Las traducciones se guardan inmediatamente al hacer clic en "Guardar"</li>
            <li>Los cambios se reflejan en toda la aplicación después de recargar</li>
            <li>Puedes agregar saltos de línea y formato en los textos largos</li>
            <li>Las claves (keys) no deben modificarse, solo el contenido</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
