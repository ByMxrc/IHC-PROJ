/**
 * Panel de Administración
 * Página que agrupa las herramientas administrativas
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import GlobalAnnouncementForm from '../components/GlobalAnnouncementForm';
import AssignCoordinatorForm from '../components/AssignCoordinatorForm';
import HelpButton from '../components/HelpButton';
import './AdminPanelPage.css';

type AdminTool = 'announcements' | 'coordinators' | null;

export default function AdminPanelPage() {
  const { t } = useTranslation();
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
    console.log('Announcement submitted:', data);
    setActiveTool(null);
  };

  const handleSubmitCoordinator = async (data: any) => {
    console.log('Coordinator assigned:', data);
    setActiveTool(null);
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
