import { useAccessibility } from '../context/AccessibilityContext';
import { useCallback } from 'react';

/**
 * Hook personalizado para usar Text-to-Speech en componentes
 * Facilita la integración de lectura de voz en botones, formularios y otros elementos
 */
export const useTTS = () => {
  const { textToSpeech, speak, stopSpeaking } = useAccessibility();

  /**
   * Lee el texto solo si TTS está activado
   */
  const speakIfEnabled = useCallback((text: string) => {
    if (textToSpeech && text) {
      speak(text);
    }
  }, [textToSpeech, speak]);

  /**
   * Props para agregar a botones - lee el texto al hacer hover
   */
  const getButtonProps = useCallback((text: string) => {
    return {
      onMouseEnter: () => speakIfEnabled(text),
      onFocus: () => speakIfEnabled(text),
    };
  }, [speakIfEnabled]);

  /**
   * Props para agregar a inputs de formulario - lee la etiqueta al hacer focus
   */
  const getInputProps = useCallback((label: string, value?: string | number) => {
    return {
      onFocus: () => {
        if (textToSpeech) {
          // Lee la etiqueta y el valor actual si existe
          const text = value ? `${label}: ${value}` : label;
          speak(text);
        }
      },
    };
  }, [textToSpeech, speak]);

  /**
   * Lee un mensaje de error de validación
   */
  const speakError = useCallback((errorMessage: string) => {
    if (textToSpeech && errorMessage) {
      speak(`Error: ${errorMessage}`);
    }
  }, [textToSpeech, speak]);

  /**
   * Lee un mensaje de éxito
   */
  const speakSuccess = useCallback((successMessage: string) => {
    if (textToSpeech && successMessage) {
      speak(successMessage);
    }
  }, [textToSpeech, speak]);

  return {
    textToSpeech,
    speak: speakIfEnabled,
    stopSpeaking,
    getButtonProps,
    getInputProps,
    speakError,
    speakSuccess,
  };
};
