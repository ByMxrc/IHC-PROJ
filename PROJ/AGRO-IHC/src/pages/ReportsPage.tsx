/**
 * Página de Reportes
 */

import './ReportsPage.css';

export default function ReportsPage() {
  return (
    <div className="reports-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span className="page-icon">📊</span>
            Reportes y Estadísticas
          </h1>
          <p className="page-description">Análisis y métricas del sistema</p>
        </div>
      </div>

      <div className="info-card">
        <h2>🚧 En Desarrollo</h2>
        <p>
          El módulo de reportes generará estadísticas y análisis sobre:
        </p>
        <ul>
          <li>Productores más activos</li>
          <li>Ferias con mayor participación</li>
          <li>Productos más vendidos</li>
          <li>Tendencias de comercialización</li>
        </ul>
      </div>
    </div>
  );
}
