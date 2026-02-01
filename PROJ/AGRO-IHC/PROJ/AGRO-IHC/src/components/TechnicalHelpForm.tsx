/**
 * Formulario de Solicitud de Ayuda Técnica
 * Permite a productores solicitar soporte agronómico o comercial
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTTS } from '../hooks/useTTS';
import './TechnicalHelpForm.css';

export type HelpType = 'agronomic' | 'commercial' | 'technical' | 'legal' | 'other';
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';
export type ContactPreference = 'email' | 'phone' | 'whatsapp' | 'video';

interface TechnicalHelpFormProps {
  onSubmit: (data: HelpRequestData) => void;
  onCancel: () => void;
}

interface HelpRequestData {
  helpType: HelpType;
  crop: string;
  problem: string;
  urgency: UrgencyLevel;
  contactPreference: ContactPreference;
  photos?: File[];
  additionalInfo: string;
}

export default function TechnicalHelpForm({ onSubmit, onCancel }: TechnicalHelpFormProps) {
  const { t } = useTranslation();
  const { getInputProps, speakError, speakSuccess } = useTTS();

  const [formData, setFormData] = useState<HelpRequestData>({
    helpType: 'agronomic',
    crop: '',
    problem: '',
    urgency: 'medium',
    contactPreference: 'email',
    additionalInfo: '',
  });

  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.crop.trim()) {
      newErrors.crop = t('technicalHelp.errors.cropRequired');
    } else if (formData.crop.length < 2) {
      newErrors.crop = t('technicalHelp.errors.cropTooShort');
    }

    if (!formData.problem.trim()) {
      newErrors.problem = t('technicalHelp.errors.problemRequired');
    } else if (formData.problem.length < 20) {
      newErrors.problem = t('technicalHelp.errors.problemTooShort');
    } else if (formData.problem.length > 1000) {
      newErrors.problem = t('technicalHelp.errors.problemTooLong');
    }

    if (formData.additionalInfo.length > 500) {
      newErrors.additionalInfo = t('technicalHelp.errors.additionalInfoTooLong');
    }

    const totalSize = photos.reduce((sum, photo) => sum + photo.size, 0);
    if (totalSize > 10 * 1024 * 1024) {
      newErrors.photos = t('technicalHelp.errors.photosTooLarge');
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      speakError(t('technicalHelp.validationError'));
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      const dataToSubmit = {
        ...formData,
        photos: photos.length > 0 ? photos : undefined,
      };
      onSubmit(dataToSubmit);
      speakSuccess(t('technicalHelp.success'));
    }
  };

  const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (photos.length + files.length > 5) {
      setErrors({ ...errors, photos: t('technicalHelp.errors.tooManyPhotos') });
      return;
    }

    const newPhotos = [...photos, ...files];
    setPhotos(newPhotos);

    // Crear previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    // Limpiar error
    const newErrors = { ...errors };
    delete newErrors.photos;
    setErrors(newErrors);
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
    setPhotoPreviews(photoPreviews.filter((_, i) => i !== index));
  };

  return (
    <form className="technical-help-form" onSubmit={handleSubmit}>
      <h2>{t('technicalHelp.title')}</h2>
      <p className="form-description">{t('technicalHelp.description')}</p>

      {/* Tipo de Ayuda */}
      <div className="form-group">
        <label htmlFor="helpType">
          {t('technicalHelp.helpType.label')} <span className="required">*</span>
        </label>
        <select
          id="helpType"
          value={formData.helpType}
          onChange={(e) => setFormData({ ...formData, helpType: e.target.value as HelpType })}
        >
          <option value="agronomic">{t('technicalHelp.helpType.agronomic')}</option>
          <option value="commercial">{t('technicalHelp.helpType.commercial')}</option>
          <option value="technical">{t('technicalHelp.helpType.technical')}</option>
          <option value="legal">{t('technicalHelp.helpType.legal')}</option>
          <option value="other">{t('technicalHelp.helpType.other')}</option>
        </select>
      </div>

      {/* Cultivo/Producto */}
      <div className="form-group">
        <label htmlFor="crop">
          {t('technicalHelp.crop')} <span className="required">*</span>
        </label>
        <input
          type="text"
          id="crop"
          value={formData.crop}
          onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
          className={errors.crop ? 'error' : ''}
          placeholder={t('technicalHelp.cropPlaceholder')}
          maxLength={100}
          {...getInputProps(t('technicalHelp.crop'))}
        />
        {errors.crop && <span className="error-message">{errors.crop}</span>}
      </div>

      {/* Problema/Consulta */}
      <div className="form-group">
        <label htmlFor="problem">
          {t('technicalHelp.problem')} <span className="required">*</span>
        </label>
        <textarea
          id="problem"
          value={formData.problem}
          onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
          className={errors.problem ? 'error' : ''}
          rows={6}
          maxLength={1000}
          placeholder={t('technicalHelp.problemPlaceholder')}
          {...getInputProps(t('technicalHelp.problem'))}
        />
        {errors.problem && <span className="error-message">{errors.problem}</span>}
        <span className="char-count">{formData.problem.length}/1000</span>
      </div>

      {/* Nivel de Urgencia */}
      <div className="form-group">
        <label htmlFor="urgency">
          {t('technicalHelp.urgency.label')} <span className="required">*</span>
        </label>
        <select
          id="urgency"
          value={formData.urgency}
          onChange={(e) => setFormData({ ...formData, urgency: e.target.value as UrgencyLevel })}
          className={`urgency-select urgency-${formData.urgency}`}
        >
          <option value="low">{t('technicalHelp.urgency.low')}</option>
          <option value="medium">{t('technicalHelp.urgency.medium')}</option>
          <option value="high">{t('technicalHelp.urgency.high')}</option>
          <option value="critical">{t('technicalHelp.urgency.critical')}</option>
        </select>
        <span className="help-text">{t(`technicalHelp.urgency.${formData.urgency}Desc`)}</span>
      </div>

      {/* Fotos Opcionales */}
      <div className="form-group">
        <label htmlFor="photos">
          {t('technicalHelp.photos')} {t('common.optional')}
        </label>
        <div className="photos-upload">
          {photos.length < 5 && (
            <div className="upload-button-wrapper">
              <input
                type="file"
                id="photos"
                accept="image/*"
                multiple
                onChange={handlePhotosChange}
                className="file-input"
              />
              <label htmlFor="photos" className="upload-button">
                <span className="upload-icon">📷</span>
                <span>{t('technicalHelp.addPhotos')}</span>
              </label>
            </div>
          )}
          
          {photoPreviews.length > 0 && (
            <div className="photos-grid">
              {photoPreviews.map((preview, index) => (
                <div key={index} className="photo-preview">
                  <img src={preview} alt={`Photo ${index + 1}`} />
                  <button
                    type="button"
                    className="remove-photo"
                    onClick={() => removePhoto(index)}
                    aria-label={t('common.remove')}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {errors.photos && <span className="error-message">{errors.photos}</span>}
        <span className="help-text">{t('technicalHelp.photosHelp')}</span>
      </div>

      {/* Preferencia de Contacto */}
      <div className="form-group">
        <label htmlFor="contactPreference">
          {t('technicalHelp.contactPreference.label')} <span className="required">*</span>
        </label>
        <select
          id="contactPreference"
          value={formData.contactPreference}
          onChange={(e) => setFormData({ ...formData, contactPreference: e.target.value as ContactPreference })}
        >
          <option value="email">{t('technicalHelp.contactPreference.email')}</option>
          <option value="phone">{t('technicalHelp.contactPreference.phone')}</option>
          <option value="whatsapp">{t('technicalHelp.contactPreference.whatsapp')}</option>
          <option value="video">{t('technicalHelp.contactPreference.video')}</option>
        </select>
      </div>

      {/* Información Adicional */}
      <div className="form-group">
        <label htmlFor="additionalInfo">
          {t('technicalHelp.additionalInfo')} {t('common.optional')}
        </label>
        <textarea
          id="additionalInfo"
          value={formData.additionalInfo}
          onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
          className={errors.additionalInfo ? 'error' : ''}
          rows={3}
          maxLength={500}
          placeholder={t('technicalHelp.additionalInfoPlaceholder')}
          {...getInputProps(t('technicalHelp.additionalInfo'))}
        />
        {errors.additionalInfo && <span className="error-message">{errors.additionalInfo}</span>}
        <span className="char-count">{formData.additionalInfo.length}/500</span>
      </div>

      {/* Información */}
      <div className="info-box">
        <span className="info-icon">📋</span>
        <div>
          <p><strong>{t('technicalHelp.infoTitle')}</strong></p>
          <p>{t('technicalHelp.infoMessage')}</p>
        </div>
      </div>

      {/* Botones */}
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-secondary">
          {t('common.cancel')}
        </button>
        <button type="submit" className="btn-primary">
          {t('technicalHelp.submit')}
        </button>
      </div>
    </form>
  );
}
