/**
 * Formulario de Gestión de Avisos Globales
 * Permite a los administradores crear/editar banners informativos
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTTS } from '../hooks/useTTS';
import './GlobalAnnouncementForm.css';

export type AnnouncementLevel = 'info' | 'warning' | 'critical';
export type TargetAudience = 'all' | 'admin' | 'coordinator' | 'producer';

interface GlobalAnnouncement {
  id?: number;
  title: string;
  message: string;
  level: AnnouncementLevel;
  startDate: string;
  endDate: string;
  targetAudience: TargetAudience[];
  isActive: boolean;
}

interface GlobalAnnouncementFormProps {
  announcement?: GlobalAnnouncement;
  onSubmit: (announcement: GlobalAnnouncement) => void;
  onCancel: () => void;
}

export default function GlobalAnnouncementForm({ 
  announcement, 
  onSubmit, 
  onCancel 
}: GlobalAnnouncementFormProps) {
  const { t } = useTranslation();
  const { speak, getInputProps } = useTTS();

  const [formData, setFormData] = useState<GlobalAnnouncement>({
    title: '',
    message: '',
    level: 'info',
    startDate: '',
    endDate: '',
    targetAudience: ['all'],
    isActive: true,
    ...announcement,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (announcement) {
      setFormData(announcement);
    }
  }, [announcement]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = t('announcements.errors.titleRequired');
    } else if (formData.title.length < 5) {
      newErrors.title = t('announcements.errors.titleTooShort');
    } else if (formData.title.length > 100) {
      newErrors.title = t('announcements.errors.titleTooLong');
    }

    if (!formData.message.trim()) {
      newErrors.message = t('announcements.errors.messageRequired');
    } else if (formData.message.length < 10) {
      newErrors.message = t('announcements.errors.messageTooShort');
    } else if (formData.message.length > 500) {
      newErrors.message = t('announcements.errors.messageTooLong');
    }

    if (!formData.startDate) {
      newErrors.startDate = t('announcements.errors.startDateRequired');
    }

    if (!formData.endDate) {
      newErrors.endDate = t('announcements.errors.endDateRequired');
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        newErrors.endDate = t('announcements.errors.endDateBeforeStart');
      }
    }

    if (formData.targetAudience.length === 0) {
      newErrors.targetAudience = t('announcements.errors.audienceRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
      speak(t('announcements.success'));
    } else {
      speak(t('announcements.validationError'));
    }
  };

  const handleAudienceChange = (audience: TargetAudience) => {
    let newAudiences: TargetAudience[];
    
    if (audience === 'all') {
      newAudiences = ['all'];
    } else {
      newAudiences = formData.targetAudience.filter(a => a !== 'all');
      
      if (newAudiences.includes(audience)) {
        newAudiences = newAudiences.filter(a => a !== audience);
      } else {
        newAudiences.push(audience);
      }
      
      if (newAudiences.length === 0) {
        newAudiences = ['all'];
      }
    }
    
    setFormData({ ...formData, targetAudience: newAudiences });
  };

  return (
    <form className="global-announcement-form" onSubmit={handleSubmit}>
      <h2>{announcement?.id ? t('announcements.edit') : t('announcements.create')}</h2>

      {/* Título */}
      <div className="form-group">
        <label htmlFor="title">
          {t('announcements.title')} <span className="required">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={errors.title ? 'error' : ''}
          maxLength={100}
          {...getInputProps(t('announcements.title'))}
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
        <span className="char-count">{formData.title.length}/100</span>
      </div>

      {/* Mensaje */}
      <div className="form-group">
        <label htmlFor="message">
          {t('announcements.message')} <span className="required">*</span>
        </label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className={errors.message ? 'error' : ''}
          rows={4}
          maxLength={500}
          {...getInputProps(t('announcements.message'))}
        />
        {errors.message && <span className="error-message">{errors.message}</span>}
        <span className="char-count">{formData.message.length}/500</span>
      </div>

      {/* Nivel de Importancia */}
      <div className="form-group">
        <label htmlFor="level">
          {t('announcements.level.label')} <span className="required">*</span>
        </label>
        <select
          id="level"
          value={formData.level}
          onChange={(e) => setFormData({ ...formData, level: e.target.value as AnnouncementLevel })}
        >
          <option value="info">{t('announcements.level.info')}</option>
          <option value="warning">{t('announcements.level.warning')}</option>
          <option value="critical">{t('announcements.level.critical')}</option>
        </select>
      </div>

      {/* Fechas */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="startDate">
            {t('announcements.startDate')} <span className="required">*</span>
          </label>
          <input
            type="datetime-local"
            id="startDate"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className={errors.startDate ? 'error' : ''}
          />
          {errors.startDate && <span className="error-message">{errors.startDate}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="endDate">
            {t('announcements.endDate')} <span className="required">*</span>
          </label>
          <input
            type="datetime-local"
            id="endDate"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className={errors.endDate ? 'error' : ''}
          />
          {errors.endDate && <span className="error-message">{errors.endDate}</span>}
        </div>
      </div>

      {/* Público Objetivo */}
      <div className="form-group">
        <label>{t('announcements.targetAudience.label')} <span className="required">*</span></label>
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.targetAudience.includes('all')}
              onChange={() => handleAudienceChange('all')}
            />
            {t('announcements.targetAudience.all')}
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.targetAudience.includes('admin')}
              onChange={() => handleAudienceChange('admin')}
              disabled={formData.targetAudience.includes('all')}
            />
            {t('announcements.targetAudience.admin')}
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.targetAudience.includes('coordinator')}
              onChange={() => handleAudienceChange('coordinator')}
              disabled={formData.targetAudience.includes('all')}
            />
            {t('announcements.targetAudience.coordinator')}
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.targetAudience.includes('producer')}
              onChange={() => handleAudienceChange('producer')}
              disabled={formData.targetAudience.includes('all')}
            />
            {t('announcements.targetAudience.producer')}
          </label>
        </div>
        {errors.targetAudience && <span className="error-message">{errors.targetAudience}</span>}
      </div>

      {/* Estado Activo */}
      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          />
          {t('announcements.isActive')}
        </label>
      </div>

      {/* Botones */}
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-secondary">
          {t('common.cancel')}
        </button>
        <button type="submit" className="btn-primary">
          {announcement?.id ? t('common.update') : t('common.create')}
        </button>
      </div>
    </form>
  );
}
