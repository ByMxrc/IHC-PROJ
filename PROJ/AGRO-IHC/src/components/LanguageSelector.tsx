/**
 * Componente de Selector de Idioma
 * Permite cambiar entre español e inglés
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSelector.css';

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
    setCurrentLanguage(lang);
    
    // Recargar para aplicar traducciones en toda la app
    window.location.reload();
  };

  return (
    <div className="language-selector">
      <button
        className={`language-btn ${currentLanguage === 'es' ? 'active' : ''}`}
        onClick={() => changeLanguage('es')}
        aria-label="Cambiar a español"
        title="Español"
      >
        🇪🇸 ES
      </button>
      <button
        className={`language-btn ${currentLanguage === 'en' ? 'active' : ''}`}
        onClick={() => changeLanguage('en')}
        aria-label="Change to English"
        title="English"
      >
        🇬🇧 EN
      </button>
    </div>
  );
}
