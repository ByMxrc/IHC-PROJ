/**
 * Contexto de Autenticación
 * REQUISITOS: Seguridad y control de acceso
 */

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuario administrador predefinido
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
  user: {
    id: '1',
    username: 'admin',
    name: 'Administrador del Sistema',
    role: 'admin' as const,
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Intentar recuperar sesión del localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      return {
        isAuthenticated: true,
        user: JSON.parse(savedUser),
      };
    }
    return {
      isAuthenticated: false,
      user: null,
    };
  });

  const login = (username: string, password: string): boolean => {
    // Validar credenciales
    if (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      const newAuthState: AuthState = {
        isAuthenticated: true,
        user: ADMIN_CREDENTIALS.user,
      };
      setAuthState(newAuthState);
      // Guardar en localStorage
      localStorage.setItem('user', JSON.stringify(ADMIN_CREDENTIALS.user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
    });
    localStorage.removeItem('user');
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
