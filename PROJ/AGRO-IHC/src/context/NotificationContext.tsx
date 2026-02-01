/**
 * Contexto de Notificaciones
 * Sistema de notificaciones in-app con sincronización del backend
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import type { ReactNode } from 'react';

export interface Notification {
  id: string | number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  category: 'system' | 'fair' | 'registration' | 'transport' | 'security';
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
  markAsRead: (id: string | number) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string | number) => void;
  clearAll: () => void;
  fetchNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const MAX_NOTIFICATIONS = 50;
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Cargar notificaciones del backend cuando el usuario se loguea
  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
      // Recargar notificaciones cada 30 segundos
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user?.id]);

  const fetchNotifications = async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const notificationsData = Array.isArray(data) ? data : (data.data || []);
        
        // Convertir notificaciones del backend al formato del frontend
        const mapped = notificationsData.map((n: any) => ({
          id: n.notification_id || n.id,
          title: n.title,
          message: n.message,
          type: n.type || 'info',
          category: n.category || 'system',
          isRead: n.is_read || false,
          createdAt: new Date(n.created_at),
          actionUrl: n.action_url
        }));
        
        setNotifications(mapped.slice(0, MAX_NOTIFICATIONS));
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const addNotification = async (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    if (!user?.id) return;

    try {
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: user.id,
          ...notification
        })
      });

      if (response.ok) {
        // Recargar notificaciones después de crear una nueva
        await fetchNotifications();
      }
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const markAsRead = async (id: string | number) => {
    try {
      await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Actualizar estado local
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`${API_BASE_URL}/notifications/read-all`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (id: string | number) => {
    try {
      await fetch(`${API_BASE_URL}/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const clearAll = async () => {
    try {
      // Eliminar todas las notificaciones del usuario
      for (const notification of notifications) {
        await deleteNotification(notification.id);
      }
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAll,
      fetchNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
