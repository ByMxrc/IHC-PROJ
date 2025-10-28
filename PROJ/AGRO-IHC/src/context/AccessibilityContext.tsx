/**
 * Contexto de Accesibilidad
 * Gestiona temas y idiomas del sistema
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';
import type { ThemeMode, Language, AccessibilitySettings } from '../types';

interface AccessibilityContextType {
  theme: ThemeMode;
  language: Language;
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (language: Language) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('accessibilitySettings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { theme: 'light', language: 'es' };
      }
    }
    return { theme: 'light', language: 'es' };
  });

  useEffect(() => {
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    // Aplicar tema al body
    document.body.className = `theme-${settings.theme}`;
    // Cambiar idioma en i18next
    i18n.changeLanguage(settings.language);
  }, [settings, i18n]);

  const setTheme = (theme: ThemeMode) => {
    setSettings((prev) => ({ ...prev, theme }));
  };

  const setLanguage = (language: Language) => {
    setSettings((prev) => ({ ...prev, language }));
  };

  return (
    <AccessibilityContext.Provider
      value={{
        theme: settings.theme,
        language: settings.language,
        setTheme,
        setLanguage,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility debe usarse dentro de AccessibilityProvider');
  }
  return context;
}
