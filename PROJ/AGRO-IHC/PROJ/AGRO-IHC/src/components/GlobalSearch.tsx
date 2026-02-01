/**
 * Componente de Búsqueda Global
 * Permite buscar productores, ferias, productos y registros en todo el sistema
 */

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useTTS } from '../hooks/useTTS';
import * as api from '../services/api';
import './GlobalSearch.css';

interface SearchResult {
  id: number;
  type: 'producer' | 'fair' | 'registration';
  title: string;
  subtitle: string;
  icon: string;
  data?: any;
}

interface GlobalSearchProps {
  onNavigate?: (page: string, data?: any) => void;
}

export default function GlobalSearch({ onNavigate }: GlobalSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { t } = useTranslation();
  const { getButtonProps } = useTTS();

  // Cerrar cuando se hace click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Atajo de teclado: Ctrl+K para abrir búsqueda
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      
      // Navegación con flechas
      if (isOpen && results.length > 0) {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % results.length);
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
        } else if (event.key === 'Enter' && results[selectedIndex]) {
          event.preventDefault();
          handleResultClick(results[selectedIndex]);
        } else if (event.key === 'Escape') {
          setIsOpen(false);
          setSearchTerm('');
        }
      }
    }
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  // Buscar cuando cambia el término
  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const searchTimeout = setTimeout(() => {
      performSearch(searchTerm);
    }, 300); // Debounce de 300ms

    return () => clearTimeout(searchTimeout);
  }, [searchTerm]);

  const performSearch = async (term: string) => {
    setIsSearching(true);
    const searchLower = term.toLowerCase();
    const foundResults: SearchResult[] = [];

    try {
      // Buscar en productores
      const producersRes = await api.producersAPI.getAll();
      console.log('Productores encontrados:', producersRes);
      if (producersRes.success) {
        producersRes.data.forEach((producer: any) => {
          const fullName = `${producer.name || producer.first_name || ''} ${producer.last_name || ''}`.toLowerCase();
          const email = (producer.email || '').toLowerCase();
          const phone = (producer.phone || '').toLowerCase();
          
          if (fullName.includes(searchLower) || email.includes(searchLower) || phone.includes(searchLower)) {
            foundResults.push({
              id: producer.producer_id,
              type: 'producer',
              title: `${producer.name || producer.first_name} ${producer.last_name}`,
              subtitle: producer.email || producer.phone || 'Sin contacto',
              icon: '👨‍🌾',
              data: producer
            });
          }
        });
      }

      // Buscar en ferias
      const fairsRes = await api.fairsAPI.getAll();
      console.log('Ferias encontradas:', fairsRes);
      if (fairsRes.success) {
        fairsRes.data.forEach((fair: any) => {
          const name = (fair.name || '').toLowerCase();
          const location = (fair.location || '').toLowerCase();
          
          if (name.includes(searchLower) || location.includes(searchLower)) {
            foundResults.push({
              id: fair.fair_id,
              type: 'fair',
              title: fair.name,
              subtitle: `${fair.location || ''} - ${new Date(fair.start_date).toLocaleDateString()}`,
              icon: '🎪',
              data: fair
            });
          }
        });
      }

      // Buscar en registraciones
      const registrationsRes = await api.registrationsAPI.getAll();
      console.log('Registraciones encontradas:', registrationsRes);
      if (registrationsRes.success) {
        registrationsRes.data.forEach((reg: any) => {
          const producerName = (reg.producer_name || '').toLowerCase();
          const fairName = (reg.fair_name || '').toLowerCase();
          
          if (producerName.includes(searchLower) || fairName.includes(searchLower)) {
            foundResults.push({
              id: reg.registration_id,
              type: 'registration',
              title: `${reg.producer_name} - ${reg.fair_name}`,
              subtitle: `Estado: ${reg.status || 'pendiente'}`,
              icon: '📝',
              data: reg
            });
          }
        });
      }

      console.log('Total de resultados encontrados:', foundResults.length);
      setResults(foundResults.slice(0, 10)); // Máximo 10 resultados
      setSelectedIndex(0);
    } catch (error) {
      console.error('Error buscando:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    console.log('Resultado seleccionado:', result);
    
    // Navegar según el tipo
    switch (result.type) {
      case 'producer':
        onNavigate?.('producers', result.data);
        break;
      case 'fair':
        onNavigate?.('fairs', result.data);
        break;
      case 'registration':
        onNavigate?.('registrations', result.data);
        break;
    }
    
    setIsOpen(false);
    setSearchTerm('');
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'producer': return 'Productor';
      case 'fair': return 'Feria';
      case 'registration': return 'Registro';
      default: return '';
    }
  };

  return (
    <div className="global-search" ref={searchRef}>
      <div className="search-input-container">
        <span className="search-icon">🔍</span>
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder={t('search.placeholder') || 'Buscar productores, ferias, registros... (Ctrl+K)'}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          aria-label="Búsqueda global"
          {...getButtonProps('Búsqueda global')}
        />
        {searchTerm && (
          <button
            className="clear-btn"
            onClick={() => {
              setSearchTerm('');
              setResults([]);
              inputRef.current?.focus();
            }}
            aria-label="Limpiar búsqueda"
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && (searchTerm.length >= 2 || results.length > 0) && (
        <div className="search-results-dropdown">
          {isSearching && (
            <div className="search-loading">
              <div className="spinner"></div>
              <span>Buscando...</span>
            </div>
          )}

          {!isSearching && searchTerm.length >= 2 && results.length === 0 && (
            <div className="no-results">
              <span className="no-results-icon">🔍</span>
              <p>No se encontraron resultados para "{searchTerm}"</p>
              <small>Intenta buscar por nombre, email, ubicación o feria</small>
            </div>
          )}

          {!isSearching && results.length > 0 && (
            <>
              <div className="results-header">
                Se encontraron {results.length} resultado(s)
              </div>
              <div className="results-list">
                {results.map((result, index) => (
                  <div
                    key={`${result.type}-${result.id}`}
                    className={`result-item ${index === selectedIndex ? 'selected' : ''}`}
                    onClick={() => handleResultClick(result)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <span className="result-icon">{result.icon}</span>
                    <div className="result-content">
                      <div className="result-title">{result.title}</div>
                      <div className="result-subtitle">{result.subtitle}</div>
                    </div>
                    <span className="result-type-badge">{getTypeLabel(result.type)}</span>
                  </div>
                ))}
              </div>
              <div className="results-footer">
                <small>💡 Usa ↑↓ para navegar, Enter para seleccionar, Esc para cerrar</small>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
