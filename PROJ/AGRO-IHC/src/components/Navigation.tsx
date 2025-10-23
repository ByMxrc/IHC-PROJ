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
import './Navigation.css';

interface NavigationProps {
  currentPage: MenuOption;
  onNavigate: (page: MenuOption) => void;
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems: { key: MenuOption; label: string; icon: string }[] = [
    { key: 'home', label: 'Inicio', icon: '🏠' },
    { key: 'producers', label: 'Productores', icon: '👨‍🌾' },
    { key: 'fairs', label: 'Ferias', icon: '🎪' },
    { key: 'registrations', label: 'Inscripciones', icon: '📝' },
    { key: 'transport', label: 'Transporte', icon: '🚚' },
    { key: 'sales', label: 'Ventas', icon: '💰' },
    { key: 'reports', label: 'Reportes', icon: '📊' },
  ];

  const handleNavigation = (page: MenuOption) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
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
          {menuItems.map((item) => (
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
          ))}
        </ul>
      </div>
    </nav>
  );
}
