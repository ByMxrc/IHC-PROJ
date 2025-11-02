/**
 * Componente de Navegación con Accesibilidad Mejorada
 * - Navbar desplegable
 * - Controles de tema e idioma
 * - Login en esquina superior derecha
 */

import { useState } from 'react';
import type { MenuOption } from '../types';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { useTranslation } from 'react-i18next';
import type { ThemeMode } from '../types';
import LoginModal from './LoginModal';
import NotificationBell from './NotificationBell';
import LanguageSelector from './LanguageSelector';
import logo from '../img/logo.png';
import './Navigation.css';

interface NavigationProps {
  currentPage: MenuOption;
  onNavigate: (page: MenuOption) => void;
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, setTheme } = useAccessibility();
  const { t } = useTranslation();

  const menuItems: { key: MenuOption; labelKey: string; icon: string }[] = [
    { key: 'home', labelKey: 'nav.home', icon: '🏠' },
    { key: 'producers', labelKey: 'nav.producers', icon: '👨‍🌾' },
    { key: 'fairs', labelKey: 'nav.fairs', icon: '🎪' },
    { key: 'registrations', labelKey: 'nav.registrations', icon: '📝' },
    { key: 'transport', labelKey: 'nav.transport', icon: '🚚' },
    { key: 'sales', labelKey: 'nav.sales', icon: '💰' },
    { key: 'reports', labelKey: 'nav.reports', icon: '📊' },
  ];

  const adminMenuItems: { key: MenuOption; labelKey: string; icon: string }[] = [
    { key: 'edit-home', labelKey: 'nav.editHome', icon: '✏️' },
    { key: 'translations', labelKey: 'nav.translations', icon: '🌍' },
    { key: 'user-registration', labelKey: 'nav.userRegistration', icon: '👥' },
  ];

  const themeOptions: { value: ThemeMode; labelKey: string; icon: string }[] = [
    { value: 'light', labelKey: 'accessibility.light', icon: '☀️' },
    { value: 'dark', labelKey: 'accessibility.dark', icon: '🌙' },
    { value: 'deuteranopia', labelKey: 'accessibility.deuteranopia', icon: '🟢' },
    { value: 'protanopia', labelKey: 'accessibility.protanopia', icon: '🔴' },
    { value: 'tritanopia', labelKey: 'accessibility.tritanopia', icon: '🔵' },
  ];

  const handleNavigation = (page: MenuOption) => {
    if (!isAuthenticated && page !== 'home') {
      setShowLoginModal(true);
      return;
    }
    
    onNavigate(page);
    setIsNavExpanded(false);
  };

  const handleLogout = () => {
    if (window.confirm(t('common.confirm'))) {
      logout();
      onNavigate('home');
    }
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const toggleNav = () => {
    setIsNavExpanded(!isNavExpanded);
  };

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    setShowThemeMenu(false);
  };

  return (
    <>
      {/* Top Bar Compacta */}
      <div className="top-bar">
        <div className="top-bar-content">
          {/* Logo */}
          <div className="top-bar-logo" onClick={() => handleNavigation('home')}>
            <img src={logo} alt="AgroFeria Logo" className="logo-icon" />
            <span className="logo-text">AgroFeria</span>
          </div>

          {/* Controles de Accesibilidad */}
          <div className="top-bar-controls">
            {/* Notificaciones (solo si está autenticado) */}
            {isAuthenticated && <NotificationBell />}

            {/* Selector de Tema */}
            <div className="control-dropdown">
              <button
                className="control-btn"
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                title={t('accessibility.theme')}
              >
                <span className="control-icon">
                  {theme === 'light' && '☀️'}
                  {theme === 'dark' && '🌙'}
                  {theme === 'deuteranopia' && '🟢'}
                  {theme === 'protanopia' && '🔴'}
                  {theme === 'tritanopia' && '🔵'}
                </span>
                <span className="control-label">{t('accessibility.theme')}</span>
              </button>
              {showThemeMenu && (
                <div className="dropdown-menu">
                  {themeOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`dropdown-item ${theme === option.value ? 'active' : ''}`}
                      onClick={() => handleThemeChange(option.value)}
                    >
                      <span className="dropdown-icon">{option.icon}</span>
                      <span>{t(option.labelKey)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selector de Idioma */}
            <LanguageSelector />

            {/* Botón de Login / Usuario */}
            {!isAuthenticated ? (
              <button className="btn-login-top" onClick={handleLoginClick}>
                <span className="btn-icon">🔐</span>
                <span className="btn-label">{t('nav.login')}</span>
              </button>
            ) : (
              <div className="user-menu">
                <div className="user-info">
                  <span className="user-icon">👤</span>
                  <span className="user-name">{user?.username}</span>
                </div>
                <button className="btn-profile-top" onClick={() => handleNavigation('profile')}>
                  <span className="btn-icon">⚙️</span>
                  <span className="btn-label">Perfil</span>
                </button>
                <button className="btn-logout-top" onClick={handleLogout}>
                  <span className="btn-icon">🚪</span>
                  <span className="btn-label">{t('nav.logout')}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Botón para expandir/contraer navegación */}
        {isAuthenticated && (
          <button
            className={`nav-toggle-btn ${isNavExpanded ? 'expanded' : ''}`}
            onClick={toggleNav}
            aria-label="Toggle navigation"
          >
            <span className="toggle-icon">{isNavExpanded ? '▲' : '▼'}</span>
          </button>
        )}
      </div>

      {/* Navegación Principal (Desplegable) */}
      {isAuthenticated && (
        <nav
          className={`main-navigation ${isNavExpanded ? 'expanded' : ''}`}
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="nav-content">
            <div className="nav-menu-grid">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  className={`nav-menu-item ${currentPage === item.key ? 'active' : ''}`}
                  onClick={() => handleNavigation(item.key)}
                  aria-current={currentPage === item.key ? 'page' : undefined}
                >
                  <span className="nav-item-icon">{item.icon}</span>
                  <span className="nav-item-label">{t(item.labelKey)}</span>
                </button>
              ))}
              
              {/* Admin options */}
              {user?.username === 'admin' && adminMenuItems.map((item) => (
                <button
                  key={item.key}
                  className={`nav-menu-item nav-admin-item ${currentPage === item.key ? 'active' : ''}`}
                  onClick={() => handleNavigation(item.key)}
                  aria-current={currentPage === item.key ? 'page' : undefined}
                >
                  <span className="nav-item-icon">{item.icon}</span>
                  <span className="nav-item-label">{t(item.labelKey)}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>
      )}

      {/* Modal de Login */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
}
