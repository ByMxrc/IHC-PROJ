/**
 * Formulario de Reporte de Contenido Incorrecto
 * Permite a los productores reportar errores o información desactualizada
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTTS } from '../hooks/useTTS';
import './ReportContentForm.css';

export type ReportReason = 'outdated' | 'incorrect' | 'offensive' | 'broken' | 'other';

interface ReportContentFormProps {
  onSubmit: (data: ReportData) => void;
  onCancel: () => void;
}

interface ReportData {
  page: string;
  section: string;
  textToCorrect: string;
  screenshot?: File;
  reason: ReportReason;
  description: string;
}

export default function ReportContentForm({ onSubmit, onCancel }: ReportContentFormProps) {
  const { t } = useTranslation();
  const { speak, getInputProps, speakError } = useTTS();

  const [formData, setFormData] = useState<ReportData>({
    page: '',
    section: '',
    textToCorrect: '',
    reason: 'incorrect',
    description: '',
  });

  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const pages = [
    'home',
    'fairs',
    'producers',
    'profile',
    'registrations',
    'sales',
    'help',
    'other',
  ];

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.page) {
      newErrors.page = t('reportContent.errors.pageRequired');
    }

    if (!formData.section.trim()) {
      newErrors.section = t('reportContent.errors.sectionRequired');
    } else if (formData.section.length < 3) {
      newErrors.section = t('reportContent.errors.sectionTooShort');
    }

    if (!formData.textToCorrect.trim()) {
      newErrors.textToCorrect = t('reportContent.errors.textRequired');
    } else if (formData.textToCorrect.length < 5) {
      newErrors.textToCorrect = t('reportContent.errors.textTooShort');
    }

    if (!formData.description.trim()) {
      newErrors.description = t('reportContent.errors.descriptionRequired');
    } else if (formData.description.length < 10) {
      newErrors.description = t('reportContent.errors.descriptionTooShort');
    } else if (formData.description.length > 1000) {
      newErrors.description = t('reportContent.errors.descriptionTooLong');
    }

    if (screenshot && screenshot.size > 5 * 1024 * 1024) {
      newErrors.screenshot = t('reportContent.errors.fileTooLarge');
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      speakError(t('reportContent.validationError'));
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      const dataToSubmit = {
        ...formData,
        screenshot: screenshot || undefined,
      };
      onSubmit(dataToSubmit);
      speak(t('reportContent.success'));
    }
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, screenshot: t('reportContent.errors.fileTooLarge') });
        return;
      }

      setScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Limpiar error si había
      const newErrors = { ...errors };
      delete newErrors.screenshot;
      setErrors(newErrors);
    }
  };

  const removeScreenshot = () => {
    setScreenshot(null);
    setScreenshotPreview('');
  };

  return (
    <form className="report-content-form" onSubmit={handleSubmit}>
      <h2>{t('reportContent.title')}</h2>
      <p className="form-description">{t('reportContent.description')}</p>

      {/* Página */}
      <div className="form-group">
        <label htmlFor="page">
          {t('reportContent.page')} <span className="required">*</span>
        </label>
        <select
          id="page"
          value={formData.page}
          onChange={(e) => setFormData({ ...formData, page: e.target.value })}
          className={errors.page ? 'error' : ''}
        >
          <option value="">{t('reportContent.selectPage')}</option>
          {pages.map(page => (
            <option key={page} value={page}>
              {t(`reportContent.pages.${page}`)}
            </option>
          ))}
        </select>
        {errors.page && <span className="error-message">{errors.page}</span>}
      </div>

      {/* Sección */}
      <div className="form-group">
        <label htmlFor="section">
          {t('reportContent.section')} <span className="required">*</span>
        </label>
        <input
          type="text"
          id="section"
          value={formData.section}
          onChange={(e) => setFormData({ ...formData, section: e.target.value })}
          className={errors.section ? 'error' : ''}
          placeholder={t('reportContent.sectionPlaceholder')}
          maxLength={100}
          {...getInputProps(t('reportContent.section'))}
        />
        {errors.section && <span className="error-message">{errors.section}</span>}
      </div>

      {/* Texto a Corregir */}
      <div className="form-group">
        <label htmlFor="textToCorrect">
          {t('reportContent.textToCorrect')} <span className="required">*</span>
        </label>
        <textarea
          id="textToCorrect"
          value={formData.textToCorrect}
          onChange={(e) => setFormData({ ...formData, textToCorrect: e.target.value })}
          className={errors.textToCorrect ? 'error' : ''}
          rows={3}
          maxLength={300}
          placeholder={t('reportContent.textPlaceholder')}
          {...getInputProps(t('reportContent.textToCorrect'))}
        />
        {errors.textToCorrect && <span className="error-message">{errors.textToCorrect}</span>}
        <span className="char-count">{formData.textToCorrect.length}/300</span>
      </div>

      {/* Motivo */}
      <div className="form-group">
        <label htmlFor="reason">
          {t('reportContent.reason.label')} <span className="required">*</span>
        </label>
        <select
          id="reason"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value as ReportReason })}
        >
          <option value="outdated">{t('reportContent.reason.outdated')}</option>
          <option value="incorrect">{t('reportContent.reason.incorrect')}</option>
          <option value="offensive">{t('reportContent.reason.offensive')}</option>
          <option value="broken">{t('reportContent.reason.broken')}</option>
          <option value="other">{t('reportContent.reason.other')}</option>
        </select>
      </div>

      {/* Descripción Detallada */}
      <div className="form-group">
        <label htmlFor="description">
          {t('reportContent.description')} <span className="required">*</span>
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className={errors.description ? 'error' : ''}
          rows={5}
          maxLength={1000}
          placeholder={t('reportContent.descriptionPlaceholder')}
          {...getInputProps(t('reportContent.description'))}
        />
        {errors.description && <span className="error-message">{errors.description}</span>}
        <span className="char-count">{formData.description.length}/1000</span>
      </div>

      {/* Captura de Pantalla */}
      <div className="form-group">
        <label htmlFor="screenshot">
          {t('reportContent.screenshot')} {t('common.optional')}
        </label>
        <div className="file-upload">
          {!screenshot ? (
            <>
              <input
                type="file"
                id="screenshot"
                accept="image/*"
                onChange={handleScreenshotChange}
                className="file-input"
              />
              <label htmlFor="screenshot" className="file-label">
                <span className="upload-icon">📷</span>
                <span>{t('reportContent.uploadScreenshot')}</span>
              </label>
            </>
          ) : (
            <div className="screenshot-preview">
              <img src={screenshotPreview} alt="Preview" />
              <button
                type="button"
                className="remove-screenshot"
                onClick={removeScreenshot}
                aria-label={t('common.remove')}
              >
                ✕
              </button>
            </div>
          )}
        </div>
        {errors.screenshot && <span className="error-message">{errors.screenshot}</span>}
        <span className="help-text">{t('reportContent.maxFileSize')}</span>
      </div>

      {/* Información Adicional */}
      <div className="info-box">
        <span className="info-icon">ℹ️</span>
        <p>{t('reportContent.infoMessage')}</p>
      </div>

      {/* Botones */}
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-secondary">
          {t('common.cancel')}
        </button>
        <button type="submit" className="btn-primary">
          {t('reportContent.submit')}
        </button>
      </div>
    </form>
  );
}
