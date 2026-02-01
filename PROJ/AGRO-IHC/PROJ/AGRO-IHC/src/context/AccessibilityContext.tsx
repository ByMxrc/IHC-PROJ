/**
 * Contexto de Accesibilidad
 * Gestiona temas, idiomas y características de accesibilidad del sistema
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';
import type { ThemeMode, Language } from '../types';

export type TextSize = 'normal' | 'large' | 'extra-large';

export interface AccessibilityFeatures {
  theme: ThemeMode;
  language: Language;
  highContrast: boolean;
  textSize: TextSize;
  screenReader: boolean;
  visualAlerts: boolean;
  keyboardShortcuts: boolean;
  textToSpeech: boolean;
  speechRate: number;
  speechVolume: number;
}

interface AccessibilityContextType extends AccessibilityFeatures {
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (language: Language) => void;
  setHighContrast: (enabled: boolean) => void;
  setTextSize: (size: TextSize) => void;
  setScreenReader: (enabled: boolean) => void;
  setVisualAlerts: (enabled: boolean) => void;
  setKeyboardShortcuts: (enabled: boolean) => void;
  setTextToSpeech: (enabled: boolean) => void;
  setSpeechRate: (rate: number) => void;
  setSpeechVolume: (volume: number) => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  resetToDefaults: () => void;
}

const defaultSettings: AccessibilityFeatures = {
  theme: 'light',
  language: 'es',
  highContrast: false,
  textSize: 'normal',
  screenReader: false,
  visualAlerts: false,
  keyboardShortcuts: true,
  textToSpeech: false,
  speechRate: 1.0,
  speechVolume: 1.0,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  
  const [settings, setSettings] = useState<AccessibilityFeatures>(() => {
    const saved = localStorage.getItem('accessibilitySettings');
    const savedLanguage = localStorage.getItem('language') as Language | null;
    
    if (saved) {
      try {
        const parsed = { ...defaultSettings, ...JSON.parse(saved) };
        // Priorizar el idioma guardado directamente en localStorage
        if (savedLanguage) {
          parsed.language = savedLanguage;
        }
        return parsed;
      } catch {
        return { ...defaultSettings, language: savedLanguage || 'es' };
      }
    }
    return { ...defaultSettings, language: savedLanguage || 'es' };
  });

  useEffect(() => {
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    
    // Aplicar clases al body
    const classes = [
      `theme-${settings.theme}`,
      settings.highContrast ? 'high-contrast' : '',
      `text-${settings.textSize}`,
      settings.visualAlerts ? 'visual-alerts' : '',
    ].filter(Boolean);
    
    document.body.className = classes.join(' ');
    
    // Aplicar atributos ARIA
    if (settings.screenReader) {
      document.body.setAttribute('aria-live', 'polite');
    } else {
      document.body.removeAttribute('aria-live');
    }
    
    // Cambiar idioma en i18next
    i18n.changeLanguage(settings.language);
  }, [settings, i18n]);

  // Efecto para atajos de teclado
  useEffect(() => {
    if (!settings.keyboardShortcuts) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Alt + T: Cambiar tema
      if (e.altKey && e.key === 't') {
        e.preventDefault();
        const themes: ThemeMode[] = ['light', 'dark', 'deuteranopia', 'protanopia', 'tritanopia'];
        const currentIndex = themes.indexOf(settings.theme);
        const nextTheme = themes[(currentIndex + 1) % themes.length];
        setTheme(nextTheme);
      }
      
      // Alt + C: Toggle alto contraste
      if (e.altKey && e.key === 'c') {
        e.preventDefault();
        setHighContrast(!settings.highContrast);
      }
      
      // Alt + +: Aumentar tamaño de texto
      if (e.altKey && e.key === '+') {
        e.preventDefault();
        const sizes: TextSize[] = ['normal', 'large', 'extra-large'];
        const currentIndex = sizes.indexOf(settings.textSize);
        if (currentIndex < sizes.length - 1) {
          setTextSize(sizes[currentIndex + 1]);
        }
      }
      
      // Alt + -: Disminuir tamaño de texto
      if (e.altKey && e.key === '-') {
        e.preventDefault();
        const sizes: TextSize[] = ['normal', 'large', 'extra-large'];
        const currentIndex = sizes.indexOf(settings.textSize);
        if (currentIndex > 0) {
          setTextSize(sizes[currentIndex - 1]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [settings]);

  const setTheme = (theme: ThemeMode) => {
    setSettings((prev) => ({ ...prev, theme }));
  };

  const setLanguage = (language: Language) => {
    localStorage.setItem('language', language);
    setSettings((prev) => ({ ...prev, language }));
  };

  const setHighContrast = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, highContrast: enabled }));
  };

  const setTextSize = (size: TextSize) => {
    setSettings((prev) => ({ ...prev, textSize: size }));
  };

  const setScreenReader = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, screenReader: enabled }));
    
    // Anunciar cambio si está activado
    if (enabled) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = 'Lectura por voz activada';
      document.body.appendChild(announcement);
      setTimeout(() => announcement.remove(), 1000);
    }
  };

  const setVisualAlerts = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, visualAlerts: enabled }));
  };

  const setKeyboardShortcuts = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, keyboardShortcuts: enabled }));
  };

  const setTextToSpeech = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, textToSpeech: enabled }));
    
    if (enabled) {
      speak('Lectura de voz activada');
    } else {
      stopSpeaking();
    }
  };

  const setSpeechRate = (rate: number) => {
    setSettings((prev) => ({ ...prev, speechRate: rate }));
  };

  const setSpeechVolume = (volume: number) => {
    setSettings((prev) => ({ ...prev, speechVolume: volume }));
  };

  const speak = (text: string) => {
    if (!settings.textToSpeech) return;
    
    // Cancelar cualquier lectura en progreso
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = settings.language === 'es' ? 'es-ES' : 'en-US';
    utterance.rate = settings.speechRate;
    utterance.volume = settings.speechVolume;
    
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
  };

  const resetToDefaults = () => {
    stopSpeaking();
    setSettings(defaultSettings);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        ...settings,
        setTheme,
        setLanguage,
        setHighContrast,
        setTextSize,
        setScreenReader,
        setVisualAlerts,
        setKeyboardShortcuts,
        setTextToSpeech,
        setSpeechRate,
        setSpeechVolume,
        speak,
        stopSpeaking,
        resetToDefaults,
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
