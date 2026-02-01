/**
 * Componente de Campana de Notificaciones
 * Badge con contador y dropdown de notificaciones
 */

import { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import NotificationList from './NotificationList';
import './NotificationBell.css';

export default function NotificationBell() {
  const { unreadCount } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="notification-bell-container" ref={bellRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bell-button"
        aria-label={`Notificaciones (${unreadCount} sin leer)`}
        title={`${unreadCount} notificaciones sin leer`}
      >
        <span className="bell-icon">🔔</span>
        {unreadCount > 0 && (
          <span className="notification-badge" aria-live="polite">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationList onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
}
