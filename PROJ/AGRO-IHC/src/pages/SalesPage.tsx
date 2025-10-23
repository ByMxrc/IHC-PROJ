/**
 * Página de Ventas
 */

import './SalesPage.css';

export default function SalesPage() {
  return (
    <div className="sales-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span className="page-icon">💰</span>
            Comercialización y Ventas
          </h1>
          <p className="page-description">Registro y seguimiento de ventas en ferias</p>
        </div>
      </div>

      <div className="info-card">
        <h2>🚧 En Desarrollo</h2>
        <p>
          El módulo de comercialización permitirá registrar y analizar las ventas realizadas en cada feria.
        </p>
      </div>
    </div>
  );
}
