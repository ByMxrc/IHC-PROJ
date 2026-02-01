/**
 * Contexto de Autenticación
 * REQUISITOS: Seguridad y control de acceso
 * - Bloqueo temporal después de intentos fallidos
 * - Recordar sesión con expiración
 * - Conexión con backend API
 */

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthState } from '../types';
import { authAPI } from '../services/api';

interface AuthContextType extends AuthState {
  login: (username: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Intentar recuperar token y usuario del localStorage
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        return {
          isAuthenticated: true,
          user: {
            id: user.id.toString(),
            username: user.username,
            name: user.fullName,
            role: user.role,
          },
        };
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    return {
      isAuthenticated: false,
      user: null,
    };
  });

  const login = async (username: string, password: string, rememberMe: boolean = false): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await authAPI.login(username, password, rememberMe);
      
      if (response.success) {
        // Guardar token y usuario
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Actualizar estado
        setAuthState({
          isAuthenticated: true,
          user: {
            id: response.user.id.toString(),
            username: response.user.username,
            name: response.user.fullName,
            role: response.user.role,
          },
        });
        
        return { success: true };
      }
      
      return { 
        success: false, 
        message: response.message || 'Error al iniciar sesión' 
      };
    } catch (error: any) {
      // Manejar errores específicos del backend
      if (error.message.includes('bloqueada') || error.message.includes('blocked')) {
        return {
          success: false,
          message: error.message
        };
      }
      
      return {
        success: false,
        message: error.message || 'Error de conexión con el servidor'
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      // Limpiar estado local independientemente del resultado
      setAuthState({
        isAuthenticated: false,
        user: null,
      });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
