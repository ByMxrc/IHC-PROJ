
import './FairInfoModal.css';

interface FairInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  fair: {
    name: string;
    description: string;
    location: string;
    address: string;
    startDate: Date;
    endDate: Date;
    maxCapacity: number;
    currentCapacity: number;
    productCategories: string[];
    requirements: string[];
  } | null;
}

export default function FairInfoModal({ isOpen, onClose, fair }: FairInfoModalProps) {
  if (!isOpen || !fair) return null;
  return (
    <div className="fair-info-modal-overlay" onClick={onClose}>
      <div className="fair-info-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>{fair.name}</h2>
        <p>{fair.description}</p>
        <ul>
          <li><strong>Ubicación:</strong> {fair.location}</li>
          <li><strong>Dirección:</strong> {fair.address}</li>
          <li><strong>Fechas:</strong> {fair.startDate.toLocaleDateString()} - {fair.endDate.toLocaleDateString()}</li>
          <li><strong>Capacidad:</strong> {fair.currentCapacity}/{fair.maxCapacity} stands</li>
          <li><strong>Categorías:</strong> {fair.productCategories.join(', ')}</li>
          <li><strong>Requisitos:</strong> {fair.requirements.join(', ')}</li>
        </ul>
      </div>
    </div>
  );
}
