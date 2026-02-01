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
import { useTTS } from '../hooks/useTTS';
import { useTranslation } from 'react-i18next';
import type { ThemeMode } from '../types';
import LoginModal from './LoginModal';
import NotificationBell from './NotificationBell';
import LanguageSelector from './LanguageSelector';
import AccessibilityMenu from './AccessibilityMenu';
import logo from '../img/logo.png';
import GlobalSearch from './GlobalSearch';
import './Navigation.css';

interface NavigationProps {
  currentPage: MenuOption;
  onNavigate: (page: MenuOption) => void;
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showAccessibilityMenu, setShowAccessibilityMenu] = useState(false);
  
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, setTheme } = useAccessibility();
  const { t } = useTranslation();
  const { getButtonProps } = useTTS();

  type MenuItem = { key: MenuOption; labelKey: string; icon: string; showFor?: string[]; hideFor?: string[] };
  const menuItems: MenuItem[] = [
    { key: 'home', labelKey: 'nav.home', icon: '🏠' },
    { key: 'producer-home', labelKey: 'nav.inicio', icon: '🌾', showFor: ['producer'] },
    { key: 'producers', labelKey: 'nav.producers', icon: '👥', showFor: ['admin', 'coordinator'] },
    { key: 'fairs', labelKey: 'nav.fairs', icon: '🎪' },
    { key: 'registrations', labelKey: 'nav.registrations', icon: '📝' },
    { key: 'producer-tools', labelKey: 'nav.producerTools', icon: '🛠️', showFor: ['producer'] },
    { key: 'coordinator-panel', labelKey: 'nav.coordinatorPanel', icon: '🛡️', showFor: ['coordinator'] },
  ];

  const adminMenuItems: { key: MenuOption; labelKey: string; icon: string }[] = [
    { key: 'admin-panel', labelKey: 'nav.adminPanel', icon: '⚙️' },
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

  const handleNavigation = (page: MenuOption | string) => {
    const menuPage = page as MenuOption;
    // Páginas públicas que no requieren login
    const publicPages = ['home', 'producers', 'fairs', 'registrations'];
    
    if (!isAuthenticated && !publicPages.includes(menuPage)) {
      setShowLoginModal(true);
      return;
    }
    
    onNavigate(menuPage);
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

          {/* Búsqueda Global */}
          <div className="top-bar-search">
            <GlobalSearch onNavigate={handleNavigation} />
          </div>

          {/* Controles de Accesibilidad */}
          <div className="top-bar-controls">
            {/* Notificaciones (solo si está autenticado) */}
            {isAuthenticated && <NotificationBell />}

            {/* Botón de Accesibilidad */}
            <button
              className="control-btn accessibility-btn"
              onClick={() => setShowAccessibilityMenu(true)}
              title={t('accessibility.title')}
              aria-label={t('accessibility.title')}
              {...getButtonProps(t('accessibility.title'))}
            >
              <span className="control-icon">♿</span>
              <span className="control-label">{t('accessibility.title')}</span>
            </button>

            {/* Selector de Tema */}
            <div className="control-dropdown">
              <button
                className="control-btn"
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                title={t('accessibility.theme')}
                {...getButtonProps(t('accessibility.theme'))}
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
              <button
                className="btn-login-top"
                onClick={handleLoginClick}
                {...getButtonProps(t('nav.login'))}
              >
                <span className="btn-icon">🔐</span>
                <span className="btn-label">{t('nav.login')}</span>
              </button>
            ) : (
              <div className="user-menu">
                <div className="user-info">
                  <span className="user-icon">👤</span>
                  <span className="user-name">{user?.username}</span>
                </div>
                <button
                  className="btn-profile-top"
                  onClick={() => handleNavigation('profile')}
                  {...getButtonProps('Perfil')}
                >
                  <span className="btn-icon">⚙️</span>
                  <span className="btn-label">Perfil</span>
                </button>
                <button
                  className="btn-logout-top"
                  onClick={handleLogout}
                  {...getButtonProps(t('nav.logout'))}
                >
                  <span className="btn-icon">🚪</span>
                  <span className="btn-label">{t('nav.logout')}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Botón para expandir/contraer navegación */}
        <button
          className={`nav-toggle-btn ${isNavExpanded ? 'expanded' : ''}`}
          onClick={toggleNav}
          aria-label="Toggle navigation"
        >
          <span className="toggle-icon">{isNavExpanded ? '▲' : '▼'}</span>
        </button>
      </div>

      {/* Navegación Principal (Desplegable) */}
      <nav
        className={`main-navigation ${isNavExpanded ? 'expanded' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="nav-content">
          <div className="nav-menu-grid">
            {menuItems
              .filter((item) => {
                // Si no está autenticado, solo mostrar home, producers, fairs, registrations
                if (!isAuthenticated) {
                  return ['home', 'producers', 'fairs', 'registrations'].includes(item.key);
                }
                
                // Productor: solo home productor y herramientas
                if (user?.role === 'producer') {
                  return ['producer-home', 'producer-tools'].includes(item.key);
                }
                
                // Coordinador: home, productores, ferias, inscripciones y panel coordinador
                if (user?.role === 'coordinator') {
                  return ['home', 'producers', 'fairs', 'registrations', 'coordinator-panel'].includes(item.key);
                }
                
                // Admin: todo excepto producer-home, producer-tools y coordinator-panel
                if (user?.role === 'admin') {
                  return !['producer-home', 'producer-tools', 'coordinator-panel'].includes(item.key);
                }
                
                return true;
              })
                .map((item) => (
                  <button
                    key={item.key}
                    className={`nav-menu-item ${currentPage === item.key ? 'active' : ''}`}
                    onClick={() => handleNavigation(item.key)}
                    aria-current={currentPage === item.key ? 'page' : undefined}
                    {...getButtonProps(t(item.labelKey))}
                  >
                    <span className="nav-item-icon">{item.icon}</span>
                    <span className="nav-item-label">{t(item.labelKey)}</span>
                  </button>
                ))}
              
              {/* Admin options */}
              {user?.role === 'admin' && adminMenuItems.map((item) => (
                <button
                  key={item.key}
                  className={`nav-menu-item ${currentPage === item.key ? 'active' : ''}`}
                  onClick={() => handleNavigation(item.key)}
                  aria-current={currentPage === item.key ? 'page' : undefined}
                  {...getButtonProps(t(item.labelKey))}
                >
                  <span className="nav-item-icon">{item.icon}</span>
                  <span className="nav-item-label">{t(item.labelKey)}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

      {/* Modal de Login */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      
      {/* Menú de Accesibilidad */}
      <AccessibilityMenu 
        isOpen={showAccessibilityMenu} 
        onClose={() => setShowAccessibilityMenu(false)} 
      />
    </>
  );
}
