/**
 * Herramientas del Productor
 * Página con formularios de soporte y reportes
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReportContentForm from '../components/ReportContentForm';
import TechnicalHelpForm from '../components/TechnicalHelpForm';
import PostSaleForm from '../components/PostSaleForm';
import FairSurveyForm from '../components/FairSurveyForm';
import HelpButton from '../components/HelpButton';
import './ProducerToolsPage.css';

type ProducerTool = 'report' | 'help' | 'postSale' | 'survey' | null;

export default function ProducerToolsPage() {
  const { t } = useTranslation();
  const [activeTool, setActiveTool] = useState<ProducerTool>(null);

  const tools = [
    {
      id: 'report' as ProducerTool,
      icon: '📝',
      title: t('reportContent.title'),
      description: t('reportContent.description'),
    },
    {
      id: 'help' as ProducerTool,
      icon: '🔧',
      title: t('technicalHelp.title'),
      description: t('technicalHelp.description'),
    },
    {
      id: 'postSale' as ProducerTool,
      icon: '💰',
      title: t('postSale.title'),
      description: t('postSale.description'),
    },
    {
      id: 'survey' as ProducerTool,
      icon: '📊',
      title: t('fairSurvey.title'),
      description: t('fairSurvey.description'),
    },
  ];

  const handleSubmit = async (data: any) => {
    console.log('Form submitted:', data);
    setActiveTool(null);
  };

  return (
    <div className="producer-tools-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span className="page-icon">🛠️</span>
            {t('pages.producerTools.title')}
          </h1>
          <p className="page-description">{t('pages.producerTools.description')}</p>
        </div>
      </div>

      {!activeTool ? (
        <div className="producer-tools-grid">
          {tools.map((tool) => (
            <button
              key={tool.id}
              className="tool-card"
              onClick={() => setActiveTool(tool.id)}
            >
              <span className="tool-icon">{tool.icon}</span>
              <h3 className="tool-title">{tool.title}</h3>
              <p className="tool-description">{tool.description}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="tool-content">
          {activeTool === 'report' && (
            <ReportContentForm
              onSubmit={handleSubmit}
              onCancel={() => setActiveTool(null)}
            />
          )}
          {activeTool === 'help' && (
            <TechnicalHelpForm
              onSubmit={handleSubmit}
              onCancel={() => setActiveTool(null)}
            />
          )}
          {activeTool === 'postSale' && (
            <PostSaleForm
              onSubmit={handleSubmit}
              onCancel={() => setActiveTool(null)}
            />
          )}
          {activeTool === 'survey' && (
            <FairSurveyForm
              onSubmit={handleSubmit}
              onCancel={() => setActiveTool(null)}
            />
          )}
        </div>
      )}

      <HelpButton pageKey="producerTools" />
    </div>
  );
}
