/**
 * Menú de Accesibilidad
 * Panel lateral con todas las opciones de accesibilidad
 */

import { useAccessibility } from '../context/AccessibilityContext';
import type { TextSize } from '../context/AccessibilityContext';
import { useTranslation } from 'react-i18next';
import './AccessibilityMenu.css';

interface AccessibilityMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccessibilityMenu({ isOpen, onClose }: AccessibilityMenuProps) {
  const {
    highContrast,
    textSize,
    screenReader,
    visualAlerts,
    keyboardShortcuts,
    textToSpeech,
    speechRate,
    speechVolume,
    setHighContrast,
    setTextSize,
    setScreenReader,
    setVisualAlerts,
    setKeyboardShortcuts,
    setTextToSpeech,
    setSpeechRate,
    setSpeechVolume,
    speak,
  } = useAccessibility();

  const { t } = useTranslation();

  if (!isOpen) return null;

  const textSizes: { value: TextSize; label: string }[] = [
    { value: 'normal', label: t('accessibility.textSize.normal') },
    { value: 'large', label: t('accessibility.textSize.large') },
    { value: 'extra-large', label: t('accessibility.textSize.extraLarge') },
  ];

  return (
    <>
      <div className="accessibility-overlay" onClick={onClose} />
      <div className="accessibility-menu" role="dialog" aria-labelledby="accessibility-title">
        <div className="accessibility-header">
          <h2 id="accessibility-title">
            <span className="accessibility-icon">♿</span>
            {t('accessibility.title')}
          </h2>
          <button
            className="close-button"
            onClick={onClose}
            aria-label={t('common.close')}
          >
            ✕
          </button>
        </div>

        <div className="accessibility-content">
          {/* Alto Contraste */}
          <div className="accessibility-option">
            <div className="option-info">
              <span className="option-icon">◐</span>
              <div className="option-text">
                <span className="option-label">{t('accessibility.highContrast')}</span>
                <span className="option-description">{t('accessibility.highContrastDesc')}</span>
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                aria-label={t('accessibility.highContrast')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {/* Tamaño de Texto */}
          <div className="accessibility-option text-size-option">
            <div className="option-info">
              <span className="option-icon">T</span>
              <span className="option-label">{t('accessibility.textSize.label')}</span>
            </div>
            <div className="text-size-buttons">
              {textSizes.map((size) => (
                <button
                  key={size.value}
                  className={`text-size-btn ${textSize === size.value ? 'active' : ''}`}
                  onClick={() => setTextSize(size.value)}
                  aria-pressed={textSize === size.value}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lectura por Voz */}
          <div className="accessibility-option">
            <div className="option-info">
              <span className="option-icon">🔊</span>
              <div className="option-text">
                <span className="option-label">{t('accessibility.screenReader')}</span>
                <span className="option-description">{t('accessibility.screenReaderDesc')}</span>
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={screenReader}
                onChange={(e) => setScreenReader(e.target.checked)}
                aria-label={t('accessibility.screenReader')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {/* Alertas Visuales */}
          <div className="accessibility-option">
            <div className="option-info">
              <span className="option-icon">🔔</span>
              <div className="option-text">
                <span className="option-label">{t('accessibility.visualAlerts')}</span>
                <span className="option-description">{t('accessibility.visualAlertsDesc')}</span>
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={visualAlerts}
                onChange={(e) => setVisualAlerts(e.target.checked)}
                aria-label={t('accessibility.visualAlerts')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {/* Lectura de Voz (Text-to-Speech) */}
          <div className="accessibility-option">
            <div className="option-info">
              <span className="option-icon">🔊</span>
              <div className="option-text">
                <span className="option-label">{t('accessibility.textToSpeech')}</span>
                <span className="option-description">{t('accessibility.textToSpeechDesc')}</span>
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={textToSpeech}
                onChange={(e) => setTextToSpeech(e.target.checked)}
                aria-label={t('accessibility.textToSpeech')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {/* Controles de Voz - Solo visible si TTS está activado */}
          {textToSpeech && (
            <div className="tts-controls">
              {/* Velocidad de Voz */}
              <div className="slider-option">
                <label htmlFor="speech-rate">
                  <span className="slider-label">{t('accessibility.speechRate')}: {speechRate.toFixed(1)}x</span>
                </label>
                <input
                  id="speech-rate"
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  aria-label={t('accessibility.speechRate')}
                />
              </div>

              {/* Volumen de Voz */}
              <div className="slider-option">
                <label htmlFor="speech-volume">
                  <span className="slider-label">{t('accessibility.speechVolume')}: {Math.round(speechVolume * 100)}%</span>
                </label>
                <input
                  id="speech-volume"
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={speechVolume}
                  onChange={(e) => setSpeechVolume(parseFloat(e.target.value))}
                  aria-label={t('accessibility.speechVolume')}
                />
              </div>

              {/* Botón de Prueba */}
              <button 
                className="test-speech-button"
                onClick={() => speak(t('accessibility.testSpeechMessage'))}
              >
                {t('accessibility.testSpeech')}
              </button>
            </div>
          )}

          {/* Atajos de Teclado */}
          <div className="accessibility-option keyboard-shortcuts">
            <button
              className="shortcuts-button"
              onClick={() => setKeyboardShortcuts(!keyboardShortcuts)}
              aria-pressed={keyboardShortcuts}
            >
              <span className="option-icon">⌨️</span>
              <span className="option-label">{t('accessibility.keyboardShortcuts')}</span>
              <span className={`toggle-indicator ${keyboardShortcuts ? 'active' : ''}`}>
                {keyboardShortcuts ? '✓' : ''}
              </span>
            </button>
          </div>

          {/* Información de Atajos */}
          {keyboardShortcuts && (
            <div className="shortcuts-info">
              <h3>{t('accessibility.availableShortcuts')}</h3>
              <ul>
                <li><kbd>Alt</kbd> + <kbd>H</kbd>: Ir a inicio</li>
                <li><kbd>Alt</kbd> + <kbd>T</kbd>: {t('accessibility.shortcuts.changeTheme')}</li>
                <li><kbd>Alt</kbd> + <kbd>C</kbd>: {t('accessibility.shortcuts.toggleContrast')}</li>
                <li><kbd>Alt</kbd> + <kbd>+</kbd>: {t('accessibility.shortcuts.increaseText')}</li>
                <li><kbd>Alt</kbd> + <kbd>-</kbd>: {t('accessibility.shortcuts.decreaseText')}</li>
                <li><kbd>Ctrl</kbd> + <kbd>H</kbd>: Mostrar todos los atajos</li>
                <li><kbd>Shift</kbd> + <kbd>?</kbd>: Ayuda de atajos</li>
              </ul>
              <p className="shortcuts-note">
                💡 Presiona <kbd>Ctrl</kbd> + <kbd>H</kbd> para ver la lista completa de atajos disponibles
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
