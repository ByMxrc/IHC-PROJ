import { useEffect, useCallback } from 'react';

/**
 * Hook para manejar atajos de teclado globales
 * Soporta combinaciones con Ctrl, Alt, Shift y teclas individuales
 */

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  callback: () => void;
  description: string;
  preventDefault?: boolean;
}

interface UseKeyboardShortcutsOptions {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
}

export const useKeyboardShortcuts = ({ shortcuts, enabled = true }: UseKeyboardShortcutsOptions) => {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // No activar atajos si el usuario está escribiendo en un input/textarea
      const target = event.target as HTMLElement;
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
      const isContentEditable = target.isContentEditable;

      if (isInput || isContentEditable) {
        // Permitir solo algunos atajos específicos en inputs (como Ctrl+S para guardar)
        const allowedInInputs = ['s', 'S'];
        if (!allowedInInputs.includes(event.key) || !event.ctrlKey) {
          return;
        }
      }

      // Buscar atajo que coincida
      const matchingShortcut = shortcuts.find((shortcut) => {
        const keyMatch = shortcut.key.toLowerCase() === event.key.toLowerCase();
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey : !event.ctrlKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;

        return keyMatch && ctrlMatch && altMatch && shiftMatch;
      });

      if (matchingShortcut) {
        if (matchingShortcut.preventDefault !== false) {
          event.preventDefault();
          event.stopPropagation();
        }
        matchingShortcut.callback();
      }
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    if (enabled) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [handleKeyPress, enabled]);

  return { shortcuts };
};

/**
 * Hook simplificado para atajos de teclado individuales
 */
export const useKeyboardShortcut = (
  key: string,
  callback: () => void,
  options: {
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
    enabled?: boolean;
    preventDefault?: boolean;
  } = {}
) => {
  const { ctrl = false, alt = false, shift = false, enabled = true, preventDefault = true } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      // No activar si el usuario está escribiendo
      const target = event.target as HTMLElement;
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
      const isContentEditable = target.isContentEditable;

      if (isInput || isContentEditable) return;

      const keyMatch = key.toLowerCase() === event.key.toLowerCase();
      const ctrlMatch = ctrl ? event.ctrlKey : !event.ctrlKey;
      const altMatch = alt ? event.altKey : !event.altKey;
      const shiftMatch = shift ? event.shiftKey : !event.shiftKey;

      if (keyMatch && ctrlMatch && altMatch && shiftMatch) {
        if (preventDefault) {
          event.preventDefault();
          event.stopPropagation();
        }
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [key, callback, ctrl, alt, shift, enabled, preventDefault]);
};

/**
 * Formatea un atajo de teclado para mostrar al usuario
 */
export const formatShortcut = (shortcut: KeyboardShortcut): string => {
  const parts: string[] = [];
  
  if (shortcut.ctrl) parts.push('Ctrl');
  if (shortcut.alt) parts.push('Alt');
  if (shortcut.shift) parts.push('Shift');
  parts.push(shortcut.key.toUpperCase());
  
  return parts.join(' + ');
};

/**
 * Lista de atajos de teclado por defecto del sistema
 */
export const DEFAULT_SHORTCUTS = {
  // Navegación
  OPEN_ACCESSIBILITY: { key: 'a', alt: true, description: 'Abrir menú de accesibilidad' },
  OPEN_LOGIN: { key: 'l', alt: true, description: 'Abrir ventana de login' },
  GO_HOME: { key: 'h', alt: true, description: 'Ir a inicio' },
  
  // Acciones de formulario
  SAVE: { key: 's', ctrl: true, description: 'Guardar formulario' },
  CANCEL: { key: 'Escape', description: 'Cancelar/Cerrar' },
  
  // Búsqueda
  SEARCH: { key: 'f', ctrl: true, description: 'Buscar' },
  
  // Accesibilidad
  INCREASE_TEXT: { key: '+', alt: true, description: 'Aumentar tamaño de texto' },
  DECREASE_TEXT: { key: '-', alt: true, description: 'Disminuir tamaño de texto' },
  TOGGLE_CONTRAST: { key: 'c', alt: true, description: 'Alternar alto contraste' },
  CHANGE_THEME: { key: 't', alt: true, description: 'Cambiar tema' },
  
  // Ayuda
  SHOW_HELP: { key: 'h', ctrl: true, description: 'Mostrar ayuda' },
  SHOW_SHORTCUTS: { key: '?', shift: true, description: 'Mostrar atajos de teclado' },
};
