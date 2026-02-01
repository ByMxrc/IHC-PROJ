/**
 * Panel de Administración
 * Página que agrupa las herramientas administrativas
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../context/ToastContext';
import GlobalAnnouncementForm from '../components/GlobalAnnouncementForm';
import AssignCoordinatorForm from '../components/AssignCoordinatorForm';
import HelpButton from '../components/HelpButton';
import './AdminPanelPage.css';

type AdminTool = 'announcements' | 'coordinators' | null;
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export default function AdminPanelPage() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [activeTool, setActiveTool] = useState<AdminTool>(null);

  const tools = [
    {
      id: 'announcements' as AdminTool,
      icon: '📢',
      title: t('announcements.title'),
      description: t('announcements.description'),
    },
    {
      id: 'coordinators' as AdminTool,
      icon: '👥',
      title: t('assignCoordinator.title'),
      description: t('assignCoordinator.description'),
    },
  ];

  const handleSubmitAnnouncement = async (data: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/announcements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Error al crear anuncio');

      showToast('Anuncio creado exitosamente', 'success');
      setActiveTool(null);
    } catch (error) {
      console.error('Error:', error);
      showToast('Error al crear anuncio', 'error');
    }
  };

  const handleSubmitCoordinator = async (data: any) => {
    try {
      console.log('Submitting coordinator assignment:', data);
      const response = await fetch(`${API_BASE_URL}/fair-coordinators`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          fairId: data.fairId,
          coordinatorId: data.coordinatorId,
          responsibilities: data.responsibilities
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        const errorMsg = result.error || 'Error al asignar coordinador';
        throw new Error(errorMsg);
      }

      showToast('Coordinador asignado exitosamente', 'success');
      setActiveTool(null);
    } catch (error) {
      console.error('Error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Error al asignar coordinador';
      showToast(errorMsg, 'error');
    }
  };

  return (
    <div className="admin-panel-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span className="page-icon">⚙️</span>
            {t('pages.adminPanel.title')}
          </h1>
          <p className="page-description">{t('pages.adminPanel.description')}</p>
        </div>
      </div>

      {!activeTool ? (
        <div className="admin-tools-grid">
          {tools.map((tool) => (
            <button
              key={tool.id}
              className="admin-tool-card"
              onClick={() => setActiveTool(tool.id)}
            >
              <span className="tool-icon">{tool.icon}</span>
              <h3 className="tool-title">{tool.title}</h3>
              <p className="tool-description">{tool.description}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="admin-tool-content">
          {activeTool === 'announcements' && (
            <GlobalAnnouncementForm
              onSubmit={handleSubmitAnnouncement}
              onCancel={() => setActiveTool(null)}
            />
          )}
          {activeTool === 'coordinators' && (
            <AssignCoordinatorForm
              onSubmit={handleSubmitCoordinator}
              onCancel={() => setActiveTool(null)}
            />
          )}
        </div>
      )}

      <HelpButton pageKey="adminPanel" />
    </div>
  );
}
