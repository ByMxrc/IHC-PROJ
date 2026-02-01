/**
 * Modal de ayuda de atajos de teclado
 * Muestra todos los atajos disponibles en el sistema
 */

import { useTTS } from '../hooks/useTTS';
import { DEFAULT_SHORTCUTS, type KeyboardShortcut } from '../hooks/useKeyboardShortcuts';
import './ShortcutsHelp.css';

interface ExtendedKeyboardShortcut extends KeyboardShortcut {
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
}

interface ShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
  customShortcuts?: KeyboardShortcut[];
}

export default function ShortcutsHelp({ isOpen, onClose, customShortcuts = [] }: ShortcutsHelpProps) {
  const { getButtonProps } = useTTS();

  if (!isOpen) return null;

  const allShortcuts: ExtendedKeyboardShortcut[] = [
    ...Object.values(DEFAULT_SHORTCUTS).map((s) => ({ ...s, callback: () => {} })),
    ...customShortcuts,
  ];

  const categories = {
    navigation: {
      title: '🧭 Navegación',
      shortcuts: allShortcuts.filter((s) =>
        ['Abrir menú de accesibilidad', 'Abrir ventana de login', 'Ir a inicio'].includes(s.description)
      ),
    },
    forms: {
      title: '📝 Formularios',
      shortcuts: allShortcuts.filter((s) =>
        ['Guardar formulario', 'Cancelar/Cerrar'].includes(s.description)
      ),
    },
    accessibility: {
      title: '♿ Accesibilidad',
      shortcuts: allShortcuts.filter((s) =>
        [
          'Aumentar tamaño de texto',
          'Disminuir tamaño de texto',
          'Alternar alto contraste',
          'Cambiar tema',
        ].includes(s.description)
      ),
    },
    search: {
      title: '🔍 Búsqueda',
      shortcuts: allShortcuts.filter((s) => s.description.includes('Buscar')),
    },
    help: {
      title: '❓ Ayuda',
      shortcuts: allShortcuts.filter((s) =>
        ['Mostrar ayuda', 'Mostrar atajos de teclado'].includes(s.description)
      ),
    },
  };

  return (
    <>
      <div className="shortcuts-overlay" onClick={onClose} />
      <div className="shortcuts-modal" role="dialog" aria-labelledby="shortcuts-title" aria-modal="true">
        <div className="shortcuts-header">
          <h2 id="shortcuts-title">
            <span className="shortcuts-icon">⌨️</span>
            Atajos de Teclado
          </h2>
          <button
            className="shortcuts-close"
            onClick={onClose}
            aria-label="Cerrar"
            {...getButtonProps('Cerrar ayuda de atajos')}
          >
            ✕
          </button>
        </div>

        <div className="shortcuts-content">
          <p className="shortcuts-intro">
            Utiliza estos atajos de teclado para navegar más rápido por el sistema:
          </p>
CORI
          {Object.entries(categories).map(([key, category]) => {
            if (category.shortcuts.length === 0) return null;

            return (
              <div key={key} className="shortcuts-category">
                <h3 className="category-title">{category.title}</h3>
                <div className="shortcuts-list">
                  {category.shortcuts.map((shortcut, index) => (
                    <div key={index} className="shortcut-item">
                      <div className="shortcut-keys">
                        {shortcut.ctrl && <kbd>Ctrl</kbd>}
                        {shortcut.alt && <kbd>Alt</kbd>}
                        {shortcut.shift && <kbd>Shift</kbd>}
                        <kbd>{shortcut.key === 'Escape' ? 'Esc' : shortcut.key.toUpperCase()}</kbd>
                      </div>
                      <div className="shortcut-description">{shortcut.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="shortcuts-tip">
            <span className="tip-icon">💡</span>
            <p>
              <strong>Consejo:</strong> Los atajos funcionan en cualquier parte del sistema, excepto cuando
              estás escribiendo en un campo de texto.
            </p>
          </div>
        </div>

        <div className="shortcuts-footer">
          <button
            className="btn btn-primary"
            onClick={onClose}
            {...getButtonProps('Cerrar ayuda')}
          >
            Entendido
          </button>
        </div>
      </div>
    </>
  );
}
