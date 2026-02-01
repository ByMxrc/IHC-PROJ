/**
 * Formulario de Encuesta de Satisfacción de Feria
 * Permite obtener feedback detallado de los productores sobre una feria
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTTS } from '../hooks/useTTS';
import './FairSurveyForm.css';

interface Fair {
  id: number;
  name: string;
  date: string;
}

interface FairSurveyFormProps {
  fairId?: number;
  onSubmit: (data: SurveyData) => void;
  onCancel: () => void;
}

interface SurveyData {
  fairId: number;
  overallSatisfaction: number;
  whatWorked: string;
  whatToImprove: string;
  wouldReturn: number;
  allowContact: boolean;
}

export default function FairSurveyForm({ fairId, onSubmit, onCancel }: FairSurveyFormProps) {
  const { t } = useTranslation();
  const { getInputProps, speakSuccess } = useTTS();

  const [fairs, setFairs] = useState<Fair[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<SurveyData>({
    fairId: fairId || 0,
    overallSatisfaction: 5,
    whatWorked: '',
    whatToImprove: '',
    wouldReturn: 5,
    allowContact: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchFairs();
  }, []);

  const fetchFairs = async () => {
    try {
      setLoading(false);
      const res = await fetch('http://localhost:3000/api/fairs/past', {
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
      newErrors.fairId = t('fairSurvey.errors.fairRequired');
    }

    if (!formData.whatWorked.trim()) {
      newErrors.whatWorked = t('fairSurvey.errors.whatWorkedRequired');
    } else if (formData.whatWorked.length < 10) {
      newErrors.whatWorked = t('fairSurvey.errors.whatWorkedTooShort');
    } else if (formData.whatWorked.length > 500) {
      newErrors.whatWorked = t('fairSurvey.errors.whatWorkedTooLong');
    }

    if (!formData.whatToImprove.trim()) {
      newErrors.whatToImprove = t('fairSurvey.errors.whatToImproveRequired');
    } else if (formData.whatToImprove.length < 10) {
      newErrors.whatToImprove = t('fairSurvey.errors.whatToImproveTooShort');
    } else if (formData.whatToImprove.length > 500) {
      newErrors.whatToImprove = t('fairSurvey.errors.whatToImproveTooLong');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
      speakSuccess(t('fairSurvey.success'));
    }
  };

  const getRatingEmoji = (rating: number): string => {
    if (rating <= 2) return '😞';
    if (rating <= 4) return '😐';
    if (rating <= 6) return '🙂';
    if (rating <= 8) return '😊';
    return '🤩';
  };

  const getRatingLabel = (rating: number): string => {
    if (rating <= 2) return t('fairSurvey.ratings.veryBad');
    if (rating <= 4) return t('fairSurvey.ratings.bad');
    if (rating <= 6) return t('fairSurvey.ratings.neutral');
    if (rating <= 8) return t('fairSurvey.ratings.good');
    return t('fairSurvey.ratings.excellent');
  };

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  return (
    <form className="fair-survey-form" onSubmit={handleSubmit}>
      <div className="survey-header">
        <h2>{t('fairSurvey.title')}</h2>
        <p className="form-description">{t('fairSurvey.description')}</p>
      </div>

      {/* Selección de Feria */}
      <div className="form-group">
        <label htmlFor="fair">
          {t('fairSurvey.fair')} <span className="required">*</span>
        </label>
        <select
          id="fair"
          value={formData.fairId}
          onChange={(e) => setFormData({ ...formData, fairId: parseInt(e.target.value) })}
          className={errors.fairId ? 'error' : ''}
          disabled={!!fairId}
        >
          <option value={0}>{t('fairSurvey.selectFair')}</option>
          {fairs.map(fair => (
            <option key={fair.id} value={fair.id}>
              {fair.name} - {new Date(fair.date).toLocaleDateString()}
            </option>
          ))}
        </select>
        {errors.fairId && <span className="error-message">{errors.fairId}</span>}
      </div>

      {/* Satisfacción General */}
      <div className="form-group rating-group">
        <label>
          {t('fairSurvey.overallSatisfaction')} <span className="required">*</span>
        </label>
        <p className="rating-description">{t('fairSurvey.ratingScale')}</p>
        
        <div className="rating-slider">
          <div className="rating-display">
            <span className="rating-emoji">{getRatingEmoji(formData.overallSatisfaction)}</span>
            <span className="rating-number">{formData.overallSatisfaction}</span>
            <span className="rating-label">{getRatingLabel(formData.overallSatisfaction)}</span>
          </div>
          
          <input
            type="range"
            min="1"
            max="10"
            value={formData.overallSatisfaction}
            onChange={(e) => setFormData({ ...formData, overallSatisfaction: parseInt(e.target.value) })}
            className="satisfaction-range"
          />
          
          <div className="rating-scale">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
            <span>9</span>
            <span>10</span>
          </div>
        </div>
      </div>

      {/* Qué Funcionó Bien */}
      <div className="form-group">
        <label htmlFor="whatWorked">
          {t('fairSurvey.whatWorked')} <span className="required">*</span>
        </label>
        <p className="field-hint">{t('fairSurvey.whatWorkedHint')}</p>
        <textarea
          id="whatWorked"
          value={formData.whatWorked}
          onChange={(e) => setFormData({ ...formData, whatWorked: e.target.value })}
          className={errors.whatWorked ? 'error' : ''}
          rows={5}
          maxLength={500}
          placeholder={t('fairSurvey.whatWorkedPlaceholder')}
          {...getInputProps(t('fairSurvey.whatWorked'))}
        />
        {errors.whatWorked && <span className="error-message">{errors.whatWorked}</span>}
        <span className="char-count">{formData.whatWorked.length}/500</span>
      </div>

      {/* Qué Mejorar */}
      <div className="form-group">
        <label htmlFor="whatToImprove">
          {t('fairSurvey.whatToImprove')} <span className="required">*</span>
        </label>
        <p className="field-hint">{t('fairSurvey.whatToImproveHint')}</p>
        <textarea
          id="whatToImprove"
          value={formData.whatToImprove}
          onChange={(e) => setFormData({ ...formData, whatToImprove: e.target.value })}
          className={errors.whatToImprove ? 'error' : ''}
          rows={5}
          maxLength={500}
          placeholder={t('fairSurvey.whatToImprovePlaceholder')}
          {...getInputProps(t('fairSurvey.whatToImprove'))}
        />
        {errors.whatToImprove && <span className="error-message">{errors.whatToImprove}</span>}
        <span className="char-count">{formData.whatToImprove.length}/500</span>
      </div>

      {/* Probabilidad de Volver */}
      <div className="form-group rating-group">
        <label>
          {t('fairSurvey.wouldReturn')} <span className="required">*</span>
        </label>
        <p className="rating-description">{t('fairSurvey.wouldReturnDesc')}</p>
        
        <div className="rating-slider">
          <div className="rating-display">
            <span className="rating-emoji">{getRatingEmoji(formData.wouldReturn)}</span>
            <span className="rating-number">{formData.wouldReturn}</span>
            <span className="rating-label">{getRatingLabel(formData.wouldReturn)}</span>
          </div>
          
          <input
            type="range"
            min="1"
            max="10"
            value={formData.wouldReturn}
            onChange={(e) => setFormData({ ...formData, wouldReturn: parseInt(e.target.value) })}
            className="satisfaction-range"
          />
          
          <div className="rating-scale">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
            <span>9</span>
            <span>10</span>
          </div>
        </div>
      </div>

      {/* Consentimiento de Contacto */}
      <div className="form-group consent-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.allowContact}
            onChange={(e) => setFormData({ ...formData, allowContact: e.target.checked })}
          />
          <div>
            <div className="consent-title">{t('fairSurvey.allowContact')}</div>
            <div className="consent-desc">{t('fairSurvey.allowContactDesc')}</div>
          </div>
        </label>
      </div>

      {/* Mensaje de Agradecimiento */}
      <div className="thank-you-box">
        <span className="thank-you-icon">🙏</span>
        <p>{t('fairSurvey.thankYou')}</p>
      </div>

      {/* Botones */}
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-secondary">
          {t('common.cancel')}
        </button>
        <button type="submit" className="btn-primary">
          {t('fairSurvey.submit')}
        </button>
      </div>
    </form>
  );
}
