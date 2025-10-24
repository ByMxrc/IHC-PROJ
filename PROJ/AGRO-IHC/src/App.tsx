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

import { useState } from 'react';
import type { MenuOption } from './types';
import { AuthProvider } from './context/AuthContext';
import { HomeContentProvider } from './context/HomeContentContext';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import ProducersPage from './pages/ProducersPage';
import FairsPage from './pages/FairsPage';
import RegistrationsPage from './pages/RegistrationsPage';
import TransportPage from './pages/TransportPage';
import SalesPage from './pages/SalesPage';
import ReportsPage from './pages/ReportsPage';
import HomeEditor from './components/HomeEditor';
import './App.css';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<MenuOption>('home');

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
      case 'edit-home':
        return <HomeEditor />;
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
      <footer className="app-footer">
        <div className="footer-content">
          <p>
            © 2025 Sistema de Gestión de Ferias Agroproductivas | 
            Desarrollado con estándares ISO 9241-11 y ISO 9241-210
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <HomeContentProvider>
        <AppContent />
      </HomeContentProvider>
    </AuthProvider>
  );
}

export default App;
