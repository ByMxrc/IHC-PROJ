/**
 * Aplicación Principal - Sistema de Gestión de Ferias Agroproductivas
 * 
 * ETAPAS DEL PROYECTO:
 * 1. CONTEXTO: Usuarios, dispositivos, flujo de tareas, tecnología
 * 2. REQUISITOS: Eficiencia, eficacia, satisfacción, funcionales y no funcionales
 * 3. DESARROLLO PROTOTIPO: Diseño menú y formularios con parámetros de usabilidad
 * 4. PRUEBAS: Modelos de pruebas de usabilidad y despliegue
 * 
 * Tecnologías: React + TypeScript + Vite
 * Normas: ISO 9241-11 (Usabilidad) e ISO 9241-210 (Diseño centrado en el usuario)
 */

import { useState, useEffect } from 'react';
import type { MenuOption } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HomeContentProvider } from './context/HomeContentContext';
import { AccessibilityProvider, useAccessibility } from './context/AccessibilityContext';
import { NotificationProvider } from './context/NotificationContext';
import { useKeyboardShortcuts, DEFAULT_SHORTCUTS } from './hooks/useKeyboardShortcuts';
import Navigation from './components/Navigation';
import ShortcutsHelp from './components/ShortcutsHelp';
import TermsModal from './components/TermsModal';
import HomePage from './pages/HomePage';
import ProducersPage from './pages/ProducersPage';
import FairsPage from './pages/FairsPage';
import RegistrationsPage from './pages/RegistrationsPage';
import TransportPage from './pages/TransportPage';
import SalesPage from './pages/SalesPage';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';
import ProducerHome from './pages/ProducerHome';
import ProductsPage from './pages/ProductsPage';
import AdminPanelPage from './pages/AdminPanelPage';
import ProducerToolsPage from './pages/ProducerToolsPage';
import CoordinatorPanelPage from './pages/CoordinatorPanelPage';
import UserRegistration from './components/UserRegistration';
import HomeEditor from './components/HomeEditor';
import TranslationsPanel from './components/TranslationsPanel';
import './App.css';

function AppContent() {
  const { isAuthenticated, logout } = useAuth();
  const { user } = useAuth();
  const {
    theme,
    setTheme,
    textSize,
    setTextSize,
    highContrast,
    setHighContrast,
    keyboardShortcuts,
  } = useAccessibility();
  const [currentPage, setCurrentPage] = useState<MenuOption>(() => {
    if (user?.role === 'producer') return 'producer-home';
    return 'home';
  });
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  // Atajos de teclado globales
  useKeyboardShortcuts({
    shortcuts: [
      {
        ...DEFAULT_SHORTCUTS.GO_HOME,
        callback: () => setCurrentPage('home'),
      },
      {
        ...DEFAULT_SHORTCUTS.SHOW_SHORTCUTS,
        callback: () => setShowShortcutsHelp(true),
      },
      {
        ...DEFAULT_SHORTCUTS.SHOW_HELP,
        callback: () => setShowShortcutsHelp(true),
      },
      {
        ...DEFAULT_SHORTCUTS.INCREASE_TEXT,
        callback: () => {
          if (textSize === 'normal') setTextSize('large');
          else if (textSize === 'large') setTextSize('extra-large');
        },
      },
      {
        ...DEFAULT_SHORTCUTS.DECREASE_TEXT,
        callback: () => {
          if (textSize === 'extra-large') setTextSize('large');
          else if (textSize === 'large') setTextSize('normal');
        },
      },
      {
        ...DEFAULT_SHORTCUTS.TOGGLE_CONTRAST,
        callback: () => setHighContrast(!highContrast),
      },
      {
        ...DEFAULT_SHORTCUTS.CHANGE_THEME,
        callback: () => {
          const themes = ['light', 'dark', 'deuteranopia', 'protanopia', 'tritanopia'] as const;
          const currentIndex = themes.indexOf(theme);
          const nextTheme = themes[(currentIndex + 1) % themes.length];
          setTheme(nextTheme);
        },
      },
    ],
    enabled: keyboardShortcuts,
  });

  // Verificar si el usuario ya aceptó los términos
  useEffect(() => {
    if (isAuthenticated) {
      const termsAccepted = localStorage.getItem('termsAccepted');
      if (!termsAccepted) {
        setShowTermsModal(true);
      }
    }
  }, [isAuthenticated]);

  const handleAcceptTerms = () => {
    localStorage.setItem('termsAccepted', 'true');
    localStorage.setItem('termsAcceptedDate', new Date().toISOString());
    setShowTermsModal(false);
  };

  const handleDeclineTerms = () => {
    // Si rechaza los términos, hacer logout
    logout();
    setShowTermsModal(false);
    alert('Debe aceptar los términos para usar el sistema');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'producers':
        return <ProducersPage />;
      case 'fairs':
        return <FairsPage />;
      case 'registrations':
        return <RegistrationsPage />;
      case 'transport':
        return <TransportPage />;
      case 'sales':
        return <SalesPage />;
      case 'reports':
        return <ReportsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'user-registration':
        return <UserRegistration />;
      case 'edit-home':
        return <HomeEditor />;
      case 'translations':
        return <TranslationsPanel />;
      case 'producer-home':
        return <ProducerHome />;
      case 'products':
        return <ProductsPage />;
      case 'admin-panel':
        return <AdminPanelPage />;
      case 'producer-tools':
        return <ProducerToolsPage />;
      case 'coordinator-panel':
        return <CoordinatorPanelPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="app">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="main-content">
        {renderPage()}
      </main>

      {/* Modal de Términos y Condiciones */}
      <TermsModal 
        isOpen={showTermsModal}
        onAccept={handleAcceptTerms}
        onDecline={handleDeclineTerms}
      />

      {/* Modal de Ayuda de Atajos */}
      <ShortcutsHelp
        isOpen={showShortcutsHelp}
        onClose={() => setShowShortcutsHelp(false)}
      />

      <footer className="app-footer">
        <div className="footer-content">
          <p>
            © 2025 Sistema de Gestión de Ferias Agroproductivas
          </p>
          <p className="footer-contact">
            📧 contacto@agroferia.com | 📱 +593 99 123 4567
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <NotificationProvider>
          <HomeContentProvider>
            <AppContent />
          </HomeContentProvider>
        </NotificationProvider>
      </AuthProvider>
    </AccessibilityProvider>
  );
}

export default App;
