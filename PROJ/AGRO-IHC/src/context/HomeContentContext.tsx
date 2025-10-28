/**
 * Contexto para el contenido editable de la página de inicio
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';
import type { HomeContent, Language } from '../types';
import { DEFAULT_HOME_CONTENT, DEFAULT_HOME_CONTENT_EN } from '../types';

interface HomeContentContextType {
  content: HomeContent;
  updateContent: (newContent: HomeContent, language: Language) => void;
  resetToDefault: () => void;
}

const HomeContentContext = createContext<HomeContentContextType | undefined>(undefined);

export function HomeContentProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language as Language;
  
  const [contentByLanguage, setContentByLanguage] = useState<Record<Language, HomeContent>>(() => {
    // Cargar contenido desde localStorage
    const saved = localStorage.getItem('homeContentMultilang');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error al cargar contenido guardado:', error);
        return {
          es: DEFAULT_HOME_CONTENT,
          en: DEFAULT_HOME_CONTENT_EN
        };
      }
    }
    return {
      es: DEFAULT_HOME_CONTENT,
      en: DEFAULT_HOME_CONTENT_EN
    };
  });

  // Guardar en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem('homeContentMultilang', JSON.stringify(contentByLanguage));
  }, [contentByLanguage]);

  const updateContent = (newContent: HomeContent, language: Language) => {
    setContentByLanguage(prev => ({
      ...prev,
      [language]: newContent
    }));
  };

  const resetToDefault = () => {
    setContentByLanguage({
      es: DEFAULT_HOME_CONTENT,
      en: DEFAULT_HOME_CONTENT_EN
    });
  };

  // Devolver contenido según idioma actual
  const content = contentByLanguage[currentLanguage] || contentByLanguage.es;

  return (
    <HomeContentContext.Provider value={{ content, updateContent, resetToDefault }}>
      {children}
    </HomeContentContext.Provider>
  );
}

export function useHomeContent() {
  const context = useContext(HomeContentContext);
  if (!context) {
    throw new Error('useHomeContent debe usarse dentro de HomeContentProvider');
  }
  return context;
}
