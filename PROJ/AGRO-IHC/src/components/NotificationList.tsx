/**
 * Lista de Notificaciones
 * Dropdown con lista de notificaciones y acciones
 */

import { useNotifications } from '../context/NotificationContext';
import type { Notification } from '../context/NotificationContext';
import './NotificationList.css';

interface NotificationListProps {
  onClose?: () => void;
}

export default function NotificationList({}: NotificationListProps) {
  const { notifications, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info': return 'ℹ️';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '📬';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'info': return 'notification-info';
      case 'warning': return 'notification-warning';
      case 'success': return 'notification-success';
      case 'error': return 'notification-error';
      default: return '';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes}m`;
    if (hours < 24) return `Hace ${hours}h`;
    if (days < 7) return `Hace ${days}d`;
    return date.toLocaleDateString();
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      // Aquí podrías navegar a la URL
      console.log('Navigate to:', notification.actionUrl);
    }
  };

  return (
    <div className="notification-list-dropdown">
      <div className="notification-header">
        <h3>Notificaciones</h3>
        {notifications.length > 0 && (
          <div className="notification-actions">
            <button onClick={markAllAsRead} className="action-button" title="Marcar todas como leídas">
              ✓ Todas
            </button>
            <button onClick={clearAll} className="action-button" title="Eliminar todas">
              🗑️
            </button>
          </div>
        )}
      </div>

      <div className="notification-list">
        {notifications.length === 0 ? (
          <div className="no-notifications">
            <span className="empty-icon">📭</span>
            <p>No hay notificaciones</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div
              key={notification.id}
              className={`notification-item ${getNotificationColor(notification.type)} ${notification.isRead ? 'read' : 'unread'}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="notification-icon">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="notification-content">
                <div className="notification-title">{notification.title}</div>
                <div className="notification-message">{notification.message}</div>
                <div className="notification-meta">
                  <span className="notification-time">{formatDate(notification.createdAt)}</span>
                  <span className="notification-category">{notification.category}</span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(notification.id);
                }}
                className="notification-delete"
                aria-label="Eliminar notificación"
                title="Eliminar"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
