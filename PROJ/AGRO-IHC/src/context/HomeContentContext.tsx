/**
 * Contexto para el contenido editable de la página de inicio
 */

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { HomeContent } from '../types';
import { DEFAULT_HOME_CONTENT } from '../types';

interface HomeContentContextType {
  content: HomeContent;
  updateContent: (newContent: HomeContent) => void;
  resetToDefault: () => void;
}

const HomeContentContext = createContext<HomeContentContextType | undefined>(undefined);

export function HomeContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<HomeContent>(() => {
    // Cargar contenido desde localStorage
    const saved = localStorage.getItem('homeContent');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error al cargar contenido guardado:', error);
        return DEFAULT_HOME_CONTENT;
      }
    }
    return DEFAULT_HOME_CONTENT;
  });

  // Guardar en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem('homeContent', JSON.stringify(content));
  }, [content]);

  const updateContent = (newContent: HomeContent) => {
    setContent(newContent);
  };

  const resetToDefault = () => {
    setContent(DEFAULT_HOME_CONTENT);
  };

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
