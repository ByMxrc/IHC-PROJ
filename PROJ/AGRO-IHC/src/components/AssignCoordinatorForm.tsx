/**
 * Formulario para Asignar Coordinador a Ferias
 * Permite delegar responsabilidades de gestión y supervisión
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTTS } from '../hooks/useTTS';
import './AssignCoordinatorForm.css';

interface Fair {
  id: number;
  name: string;
  location: string;
  startDate: string;
}

interface Coordinator {
  id: number;
  name: string;
  email: string;
  phone: string;
  assignedFairs?: number;
}

interface AssignCoordinatorFormProps {
  fair?: Fair;
  onSubmit: (data: { fairId: number; coordinatorId: number; responsibilities: string[] }) => void;
  onCancel: () => void;
}

export default function AssignCoordinatorForm({ 
  fair, 
  onSubmit, 
  onCancel 
}: AssignCoordinatorFormProps) {
  const { t } = useTranslation();
  const { speak, getInputProps } = useTTS();

  const [fairs, setFairs] = useState<Fair[]>([]);
  const [coordinators, setCoordinators] = useState<Coordinator[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    fairId: fair?.id || 0,
    coordinatorId: 0,
    responsibilities: [] as string[],
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableResponsibilities = [
    'approveRegistrations',
    'manageVendors',
    'overseeLogistics',
    'handleIncidents',
    'communicateProducers',
    'reportAdmin',
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch ferias
      const fairsRes = await fetch('http://localhost:3000/api/fairs', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const fairsData = await fairsRes.json();
      // Normalizar datos de ferias
      const normalizedFairs = (Array.isArray(fairsData) ? fairsData : fairsData.data || []).map((f: any) => ({
        id: f.id || f.fair_id,
        name: f.name,
        location: f.location,
        startDate: f.startDate || f.start_date
      }));
      setFairs(normalizedFairs);

      // Fetch coordinadores
      const coordsRes = await fetch('http://localhost:3000/api/users?role=coordinator', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const coordsData = await coordsRes.json();
      // Normalizar datos de coordinadores
      const normalizedCoords = (Array.isArray(coordsData) ? coordsData : coordsData.data || []).map((c: any) => ({
        id: c.id,
        name: c.name || c.full_name,
        email: c.email,
        phone: c.phone,
        assignedFairs: c.assignedFairs || 0
      }));
      setCoordinators(normalizedCoords);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fairId) {
      newErrors.fairId = t('assignCoordinator.errors.fairRequired');
    }

    if (!formData.coordinatorId) {
      newErrors.coordinatorId = t('assignCoordinator.errors.coordinatorRequired');
    }

    if (formData.responsibilities.length === 0) {
      newErrors.responsibilities = t('assignCoordinator.errors.responsibilitiesRequired');
    }

    if (formData.notes.length > 500) {
      newErrors.notes = t('assignCoordinator.errors.notesTooLong');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit({
        fairId: formData.fairId,
        coordinatorId: formData.coordinatorId,
        responsibilities: formData.responsibilities,
      });
      speak(t('assignCoordinator.success'));
    } else {
      speak(t('assignCoordinator.validationError'));
    }
  };

  const handleResponsibilityToggle = (responsibility: string) => {
    const newResponsibilities = formData.responsibilities.includes(responsibility)
      ? formData.responsibilities.filter(r => r !== responsibility)
      : [...formData.responsibilities, responsibility];
    
    setFormData({ ...formData, responsibilities: newResponsibilities });
  };

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  const selectedCoordinator = coordinators.find(c => c.id === formData.coordinatorId);
  const selectedFair = fairs.find(f => f.id === formData.fairId);

  return (
    <form className="assign-coordinator-form" onSubmit={handleSubmit}>
      <h2>{t('assignCoordinator.title')}</h2>
      <p className="form-description">{t('assignCoordinator.description')}</p>

      {/* Selección de Feria */}
      <div className="form-group">
        <label htmlFor="fair">
          {t('assignCoordinator.fair')} <span className="required">*</span>
        </label>
        <select
          id="fair"
          value={formData.fairId}
          onChange={(e) => setFormData({ ...formData, fairId: parseInt(e.target.value) })}
          className={errors.fairId ? 'error' : ''}
          disabled={!!fair}
        >
          <option value={0}>{t('assignCoordinator.selectFair')}</option>
          {fairs.map(fair => (
            <option key={fair.id} value={fair.id}>
              {fair.name} - {fair.location}
            </option>
          ))}
        </select>
        {errors.fairId && <span className="error-message">{errors.fairId}</span>}
      </div>

      {/* Selección de Coordinador */}
      <div className="form-group">
        <label htmlFor="coordinator">
          {t('assignCoordinator.coordinator')} <span className="required">*</span>
        </label>
        <select
          id="coordinator"
          value={formData.coordinatorId}
          onChange={(e) => setFormData({ ...formData, coordinatorId: parseInt(e.target.value) })}
          className={errors.coordinatorId ? 'error' : ''}
        >
          <option value={0}>{t('assignCoordinator.selectCoordinator')}</option>
          {coordinators.map(coord => (
            <option key={coord.id} value={coord.id}>
              {coord.name} - {coord.email}
              {coord.assignedFairs ? ` (${coord.assignedFairs} ferias asignadas)` : ''}
            </option>
          ))}
        </select>
        {errors.coordinatorId && <span className="error-message">{errors.coordinatorId}</span>}
      </div>

      {/* Información del Coordinador Seleccionado */}
      {selectedCoordinator && (
        <div className="coordinator-info">
          <h3>{t('assignCoordinator.coordinatorInfo')}</h3>
          <p><strong>{t('common.name')}:</strong> {selectedCoordinator.name}</p>
          <p><strong>{t('common.email')}:</strong> {selectedCoordinator.email}</p>
          <p><strong>{t('common.phone')}:</strong> {selectedCoordinator.phone}</p>
          {selectedCoordinator.assignedFairs !== undefined && (
            <p><strong>{t('assignCoordinator.assignedFairs')}:</strong> {selectedCoordinator.assignedFairs}</p>
          )}
        </div>
      )}

      {/* Responsabilidades */}
      <div className="form-group">
        <label>{t('assignCoordinator.responsibilities.label')} <span className="required">*</span></label>
        <div className="checkbox-group">
          {availableResponsibilities.map(resp => (
            <label key={resp} className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.responsibilities.includes(resp)}
                onChange={() => handleResponsibilityToggle(resp)}
              />
              <div className="responsibility-info">
                <span className="responsibility-title">
                  {t(`assignCoordinator.responsibilities.${resp}.title`)}
                </span>
                <span className="responsibility-desc">
                  {t(`assignCoordinator.responsibilities.${resp}.desc`)}
                </span>
              </div>
            </label>
          ))}
        </div>
        {errors.responsibilities && <span className="error-message">{errors.responsibilities}</span>}
      </div>

      {/* Notas Adicionales */}
      <div className="form-group">
        <label htmlFor="notes">{t('assignCoordinator.notes')}</label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className={errors.notes ? 'error' : ''}
          rows={3}
          maxLength={500}
          placeholder={t('assignCoordinator.notesPlaceholder')}
          {...getInputProps(t('assignCoordinator.notes'))}
        />
        {errors.notes && <span className="error-message">{errors.notes}</span>}
        <span className="char-count">{formData.notes.length}/500</span>
      </div>

      {/* Resumen de Asignación */}
      {selectedFair && selectedCoordinator && formData.responsibilities.length > 0 && (
        <div className="assignment-summary">
          <h3>{t('assignCoordinator.summary')}</h3>
          <p>
            <strong>{selectedCoordinator.name}</strong> {t('assignCoordinator.willBeAssigned')} <strong>{selectedFair.name}</strong>
          </p>
          <p>{t('assignCoordinator.withResponsibilities')}:</p>
          <ul>
            {formData.responsibilities.map(resp => (
              <li key={resp}>{t(`assignCoordinator.responsibilities.${resp}.title`)}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Botones */}
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-secondary">
          {t('common.cancel')}
        </button>
        <button type="submit" className="btn-primary">
          {t('assignCoordinator.assign')}
        </button>
      </div>
    </form>
  );
}
