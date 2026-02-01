/**
 * Formulario de Reporte Rápido de Incidencias en Feria
 * Permite a coordinadores registrar problemas durante la feria
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTTS } from '../hooks/useTTS';
import './IncidentReportForm.css';

export type IncidentType = 'security' | 'infrastructure' | 'vendor' | 'weather' | 'equipment' | 'other';
export type IncidentPriority = 'low' | 'medium' | 'high' | 'critical';

interface Fair {
  id: number;
  name: string;
  location: string;
}

interface IncidentReportFormProps {
  fairId?: number;
  onSubmit: (data: IncidentData) => void;
  onCancel: () => void;
}

interface IncidentData {
  fairId: number;
  incidentType: IncidentType;
  description: string;
  location: string;
  priority: IncidentPriority;
  photo?: File;
}

export default function IncidentReportForm({ fairId, onSubmit, onCancel }: IncidentReportFormProps) {
  const { t } = useTranslation();
  const { getInputProps, speakError, speakSuccess } = useTTS();

  const [fairs, setFairs] = useState<Fair[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<IncidentData>({
    fairId: fairId || 0,
    incidentType: 'other',
    description: '',
    location: '',
    priority: 'medium',
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchActiveFairs();
  }, []);

  const fetchActiveFairs = async () => {
    try {
      setLoading(false);
      const res = await fetch('http://localhost:3000/api/fairs/active', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setFairs(data);
    } catch (error) {
      console.error('Error fetching fairs:', error);
      setLoading(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fairId) {
      newErrors.fairId = t('incidentReport.errors.fairRequired');
    }

    if (!formData.description.trim()) {
      newErrors.description = t('incidentReport.errors.descriptionRequired');
    } else if (formData.description.length < 10) {
      newErrors.description = t('incidentReport.errors.descriptionTooShort');
    } else if (formData.description.length > 500) {
      newErrors.description = t('incidentReport.errors.descriptionTooLong');
    }

    if (!formData.location.trim()) {
      newErrors.location = t('incidentReport.errors.locationRequired');
    } else if (formData.location.length < 3) {
      newErrors.location = t('incidentReport.errors.locationTooShort');
    }

    if (photo && photo.size > 5 * 1024 * 1024) {
      newErrors.photo = t('incidentReport.errors.photoTooLarge');
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      speakError(t('incidentReport.validationError'));
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      const dataToSubmit = {
        ...formData,
        photo: photo || undefined,
      };
      onSubmit(dataToSubmit);
      speakSuccess(t('incidentReport.success'));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, photo: t('incidentReport.errors.photoTooLarge') });
        return;
      }

      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      const newErrors = { ...errors };
      delete newErrors.photo;
      setErrors(newErrors);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview('');
  };

  const getPriorityColor = (priority: IncidentPriority): string => {
    switch (priority) {
      case 'low': return '#4CAF50';
      case 'medium': return '#FFC107';
      case 'high': return '#FF9800';
      case 'critical': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  return (
    <form className="incident-report-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <span className="header-icon">⚠️</span>
        <div>
          <h2>{t('incidentReport.title')}</h2>
          <p className="form-description">{t('incidentReport.description')}</p>
        </div>
      </div>

      {/* Selección de Feria */}
      <div className="form-group">
        <label htmlFor="fair">
          {t('incidentReport.fair')} <span className="required">*</span>
        </label>
        <select
          id="fair"
          value={formData.fairId}
          onChange={(e) => setFormData({ ...formData, fairId: parseInt(e.target.value) })}
          className={errors.fairId ? 'error' : ''}
          disabled={!!fairId}
        >
          <option value={0}>{t('incidentReport.selectFair')}</option>
          {fairs.map(fair => (
            <option key={fair.id} value={fair.id}>
              {fair.name} - {fair.location}
            </option>
          ))}
        </select>
        {errors.fairId && <span className="error-message">{errors.fairId}</span>}
      </div>

      {/* Tipo de Incidente */}
      <div className="form-group">
        <label htmlFor="incidentType">
          {t('incidentReport.incidentType.label')} <span className="required">*</span>
        </label>
        <div className="incident-types">
          {(['security', 'infrastructure', 'vendor', 'weather', 'equipment', 'other'] as IncidentType[]).map(type => (
            <label key={type} className={`incident-type-option ${formData.incidentType === type ? 'selected' : ''}`}>
              <input
                type="radio"
                name="incidentType"
                value={type}
                checked={formData.incidentType === type}
                onChange={(e) => setFormData({ ...formData, incidentType: e.target.value as IncidentType })}
              />
              <div className="type-content">
                <span className="type-icon">{t(`incidentReport.incidentType.${type}Icon`)}</span>
                <span className="type-label">{t(`incidentReport.incidentType.${type}`)}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Descripción */}
      <div className="form-group">
        <label htmlFor="description">
          {t('incidentReport.description')} <span className="required">*</span>
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className={errors.description ? 'error' : ''}
          rows={5}
          maxLength={500}
          placeholder={t('incidentReport.descriptionPlaceholder')}
          {...getInputProps(t('incidentReport.description'))}
        />
        {errors.description && <span className="error-message">{errors.description}</span>}
        <span className="char-count">{formData.description.length}/500</span>
      </div>

      {/* Ubicación */}
      <div className="form-group">
        <label htmlFor="location">
          {t('incidentReport.location')} <span className="required">*</span>
        </label>
        <input
          type="text"
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className={errors.location ? 'error' : ''}
          placeholder={t('incidentReport.locationPlaceholder')}
          maxLength={100}
          {...getInputProps(t('incidentReport.location'))}
        />
        {errors.location && <span className="error-message">{errors.location}</span>}
      </div>

      {/* Prioridad */}
      <div className="form-group">
        <label htmlFor="priority">
          {t('incidentReport.priority.label')} <span className="required">*</span>
        </label>
        <div className="priority-options">
          {(['low', 'medium', 'high', 'critical'] as IncidentPriority[]).map(priority => (
            <label
              key={priority}
              className={`priority-option ${formData.priority === priority ? 'selected' : ''}`}
              style={{ '--priority-color': getPriorityColor(priority) } as React.CSSProperties}
            >
              <input
                type="radio"
                name="priority"
                value={priority}
                checked={formData.priority === priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as IncidentPriority })}
              />
              <div className="priority-content">
                <span className="priority-indicator"></span>
                <div>
                  <div className="priority-label">{t(`incidentReport.priority.${priority}`)}</div>
                  <div className="priority-desc">{t(`incidentReport.priority.${priority}Desc`)}</div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Foto Opcional */}
      <div className="form-group">
        <label htmlFor="photo">
          {t('incidentReport.photo')} {t('common.optional')}
        </label>
        <div className="photo-upload">
          {!photo ? (
            <>
              <input
                type="file"
                id="photo"
                accept="image/*"
                onChange={handlePhotoChange}
                className="file-input"
              />
              <label htmlFor="photo" className="upload-label">
                <span className="upload-icon">📷</span>
                <span>{t('incidentReport.uploadPhoto')}</span>
              </label>
            </>
          ) : (
            <div className="photo-preview">
              <img src={photoPreview} alt="Preview" />
              <button
                type="button"
                className="remove-photo"
                onClick={removePhoto}
                aria-label={t('common.remove')}
              >
                ✕
              </button>
            </div>
          )}
        </div>
        {errors.photo && <span className="error-message">{errors.photo}</span>}
        <span className="help-text">{t('incidentReport.maxFileSize')}</span>
      </div>

      {/* Información de Urgencia */}
      {formData.priority === 'critical' && (
        <div className="alert-box critical">
          <span className="alert-icon">🚨</span>
          <div>
            <strong>{t('incidentReport.criticalAlert')}</strong>
            <p>{t('incidentReport.criticalAlertDesc')}</p>
          </div>
        </div>
      )}

      {/* Botones */}
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-secondary">
          {t('common.cancel')}
        </button>
        <button type="submit" className="btn-primary">
          {t('incidentReport.submit')}
        </button>
      </div>
    </form>
  );
}
