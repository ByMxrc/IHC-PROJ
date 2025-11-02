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
import { AccessibilityProvider } from './context/AccessibilityContext';
import { NotificationProvider } from './context/NotificationContext';
import Navigation from './components/Navigation';
import TermsModal from './components/TermsModal';
import HomePage from './pages/HomePage';
import ProducersPage from './pages/ProducersPage';
import FairsPage from './pages/FairsPage';
import RegistrationsPage from './pages/RegistrationsPage';
import TransportPage from './pages/TransportPage';
import SalesPage from './pages/SalesPage';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';
import UserRegistration from './components/UserRegistration';
import HomeEditor from './components/HomeEditor';
import TranslationsPanel from './components/TranslationsPanel';
import './App.css';

function AppContent() {
  const { isAuthenticated, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<MenuOption>('home');
  const [showTermsModal, setShowTermsModal] = useState(false);

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
