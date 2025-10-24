/**
 * Componente de Navegación Principal
 * ETAPA 3: DESARROLLO PROTOTIPO - Diseño menú con parámetros de usabilidad
 * ISO 9241-210: Diseño centrado en el usuario
 * 
 * Parámetros de usabilidad implementados:
 * - Navegación clara y consistente
 * - Feedback visual al hover y selección
 * - Accesibilidad con ARIA labels
 * - Responsive design para dispositivos móviles
 * - Contraste de colores adecuado
 */

import { useState } from 'react';
import type { MenuOption } from '../types';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
import './Navigation.css';

interface NavigationProps {
  currentPage: MenuOption;
  onNavigate: (page: MenuOption) => void;
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  const menuItems: { key: MenuOption; label: string; icon: string }[] = [
    { key: 'home', label: 'Inicio', icon: '🏠' },
    { key: 'producers', label: 'Productores', icon: '👨‍🌾' },
    { key: 'fairs', label: 'Ferias', icon: '🎪' },
    { key: 'registrations', label: 'Inscripciones', icon: '📝' },
    { key: 'transport', label: 'Transporte', icon: '🚚' },
    { key: 'sales', label: 'Ventas', icon: '💰' },
    { key: 'reports', label: 'Reportes', icon: '📊' },
  ];

  // Opciones solo para admin
  const adminMenuItems: { key: MenuOption; label: string; icon: string }[] = [
    { key: 'edit-home', label: 'Editar Inicio', icon: '✏️' },
  ];

  const handleNavigation = (page: MenuOption) => {
    // Si no está autenticado y hace clic en algo diferente de "Inicio", mostrar login
    if (!isAuthenticated && page !== 'home') {
      setShowLoginModal(true);
      setIsMobileMenuOpen(false);
      return;
    }
    
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    if (window.confirm('¿Está seguro que desea cerrar sesión?')) {
      logout();
      setIsMobileMenuOpen(false);
      onNavigate('home'); // Volver al inicio
    }
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="navigation" role="navigation" aria-label="Navegación principal">
        <div className="nav-container">
          <div className="nav-header">
            <h1 className="nav-logo">
              <span className="logo-icon">🌾</span>
              AgroFeria
            </h1>
            
            {/* Botón menú móvil - REQUISITO: Diseño responsive */}
            <button
              className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
              onClick={toggleMobileMenu}
              aria-label="Abrir menú de navegación"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>

          {/* Menú principal - REQUISITO: Navegación clara */}
          <ul className={`nav-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            {menuItems.map((item) => {
              // Solo mostrar "Inicio" si no está autenticado
              if (!isAuthenticated && item.key !== 'home') {
                return null;
              }
              
              return (
                <li key={item.key} className="nav-item">
                  <button
                    className={`nav-link ${currentPage === item.key ? 'active' : ''}`}
                    onClick={() => handleNavigation(item.key)}
                    aria-current={currentPage === item.key ? 'page' : undefined}
                    title={item.label}
                  >
                    <span className="nav-icon" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span className="nav-label">{item.label}</span>
                  </button>
                </li>
              );
            })}
            
            {/* Opciones de administrador */}
            {isAuthenticated && user?.username === 'admin' && adminMenuItems.map((item) => (
              <li key={item.key} className="nav-item">
                <button
                  className={`nav-link nav-admin ${currentPage === item.key ? 'active' : ''}`}
                  onClick={() => handleNavigation(item.key)}
                  aria-current={currentPage === item.key ? 'page' : undefined}
                  title={item.label}
                >
                  <span className="nav-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="nav-label">{item.label}</span>
                </button>
              </li>
            ))}
            
            {/* Si está autenticado, mostrar usuario y logout */}
            {isAuthenticated && (
              <>
                {/* Separador */}
                <li className="nav-divider" role="separator"></li>
                
                {/* Usuario */}
                <li className="nav-item nav-user-item">
                  <div className="nav-user-info">
                    <span className="nav-user-icon" aria-hidden="true">👤</span>
                    <span className="nav-user-name">{user?.username}</span>
                  </div>
                </li>
                
                {/* Logout */}
                <li className="nav-item">
                  <button
                    className="nav-link nav-logout"
                    onClick={handleLogout}
                    title="Cerrar sesión"
                  >
                    <span className="nav-icon" aria-hidden="true">🚪</span>
                    <span className="nav-label">Salir</span>
                  </button>
                </li>
              </>
            )}
            
            {/* Si no está autenticado, mostrar botón de Login */}
            {!isAuthenticated && (
              <>
                <li className="nav-divider" role="separator"></li>
                <li className="nav-item">
                  <button
                    className="nav-link nav-login"
                    onClick={handleLoginClick}
                    title="Iniciar sesión"
                  >
                    <span className="nav-icon" aria-hidden="true">🔐</span>
                    <span className="nav-label">Iniciar Sesión</span>
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

      {/* Modal de Login */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
}
