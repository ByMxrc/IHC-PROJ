/**
 * Modal de Ayuda con contenido contextual
 */

import { useEffect } from 'react';
import './HelpModal.css';

interface HelpModalProps {
  title: string;
  content: string;
  videoUrl?: string;
  onClose: () => void;
}

export default function HelpModal({ title, content, videoUrl, onClose }: HelpModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="help-modal-overlay" onClick={onClose}>
      <div className="help-modal" onClick={(e) => e.stopPropagation()}>
        <div className="help-modal-header">
          <h2>{title}</h2>
          <button
            className="help-modal-close"
            onClick={onClose}
            aria-label="Cerrar ayuda"
          >
            ✕
          </button>
        </div>

        <div className="help-modal-content">
          {videoUrl && (
            <div className="help-video">
              <iframe
                src={videoUrl}
                title="Video de ayuda"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          <div
            className="help-text"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>

        <div className="help-modal-footer">
          <button className="help-close-button" onClick={onClose}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
