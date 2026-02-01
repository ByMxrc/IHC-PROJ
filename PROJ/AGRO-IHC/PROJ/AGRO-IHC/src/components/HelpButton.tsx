/**
 * Botón de Ayuda Flotante
 * Se muestra en cada página con contenido contextual
 */

import { useState } from 'react';
import HelpModal from './HelpModal';
import './HelpButton.css';

interface HelpContent {
  title: string;
  content: string;
  videoUrl?: string;
}

interface HelpButtonProps {
  pageKey: string;
}

export default function HelpButton({ pageKey }: HelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getHelpContent = (key: string): HelpContent => {
    const helpContent: Record<string, HelpContent> = {
      'home': {
        title: 'Página Principal',
        content: `
          <h4>Bienvenido al Sistema de Gestión de Ferias Agroproductivas</h4>
          <p>En esta página principal encontrarás:</p>
          <ul>
            <li><strong>Información general</strong> sobre el sistema y sus funcionalidades</li>
            <li><strong>Acceso rápido</strong> a las principales secciones</li>
            <li><strong>Estadísticas</strong> generales (cuando estés autenticado)</li>
          </ul>
          <h4>¿Cómo comenzar?</h4>
          <ol>
            <li>Inicia sesión usando el botón en la esquina superior derecha</li>
            <li>Usa el menú de navegación para acceder a las diferentes secciones</li>
            <li>Explora las funcionalidades según tu rol (admin/productor/coordinador)</li>
          </ol>
        `,
      },
      'producers': {
        title: 'Gestión de Productores',
        content: `
          <h4>Gestión de Productores Agrícolas</h4>
          <p>En esta sección puedes administrar la información de los productores:</p>
          <ul>
            <li><strong>Ver lista completa</strong> de productores registrados</li>
            <li><strong>Registrar nuevo productor</strong> con toda su información</li>
            <li><strong>Editar datos</strong> de productores existentes</li>
            <li><strong>Ver historial</strong> de participaciones en ferias</li>
            <li><strong>Buscar y filtrar</strong> productores por diferentes criterios</li>
          </ul>
          <h4>Datos que se registran:</h4>
          <ul>
            <li>Información personal (nombre, cédula, contacto)</li>
            <li>Ubicación (provincia, cantón, dirección)</li>
            <li>Datos de producción (tipos de productos, tamaño de finca)</li>
          </ul>
        `,
      },
      'fairs': {
        title: 'Gestión de Ferias',
        content: `
          <h4>Administración de Ferias Agroproductivas</h4>
          <p>Aquí puedes gestionar las ferias del sistema:</p>
          <ul>
            <li><strong>Crear nuevas ferias</strong> con toda la información necesaria</li>
            <li><strong>Editar ferias existentes</strong> (fechas, ubicación, capacidad)</li>
            <li><strong>Ver inscripciones</strong> de productores a cada feria</li>
            <li><strong>Aprobar o rechazar</strong> solicitudes de inscripción</li>
            <li><strong>Generar reportes</strong> de cada feria</li>
          </ul>
          <h4>Estados de las ferias:</h4>
          <ul>
            <li><strong>Planificada:</strong> Feria creada pero aún no iniciada</li>
            <li><strong>Activa:</strong> Feria en curso</li>
            <li><strong>Completada:</strong> Feria finalizada</li>
            <li><strong>Cancelada:</strong> Feria suspendida</li>
          </ul>
        `,
      },
      'registrations': {
        title: 'Inscripciones a Ferias',
        content: `
          <h4>Gestión de Inscripciones</h4>
          <p>Administra las inscripciones de productores a las ferias:</p>
          <ul>
            <li><strong>Ver todas las inscripciones</strong> con su estado</li>
            <li><strong>Aprobar inscripciones</strong> pendientes</li>
            <li><strong>Rechazar solicitudes</strong> con motivo</li>
            <li><strong>Ver detalles</strong> de productos a vender</li>
            <li><strong>Gestionar necesidades</strong> de transporte</li>
          </ul>
          <h4>Estados de inscripción:</h4>
          <ul>
            <li><strong>Pendiente:</strong> Esperando aprobación</li>
            <li><strong>Aprobada:</strong> Inscripción confirmada</li>
            <li><strong>Rechazada:</strong> No aprobada</li>
            <li><strong>Cancelada:</strong> Cancelada por el productor</li>
          </ul>
        `,
      },
      'transport': {
        title: 'Gestión de Transporte',
        content: `
          <h4>Organización del Transporte</h4>
          <p>Administra el servicio de transporte para las ferias:</p>
          <ul>
            <li><strong>Crear rutas</strong> de transporte para cada feria</li>
            <li><strong>Asignar productores</strong> a cada ruta</li>
            <li><strong>Gestionar capacidad</strong> de cada vehículo</li>
            <li><strong>Definir puntos de recogida</strong> y horarios</li>
            <li><strong>Ver ocupación</strong> en tiempo real</li>
          </ul>
          <h4>Información importante:</h4>
          <ul>
            <li>Verifica que los productores que requieren transporte estén asignados</li>
            <li>Confirma que las rutas no excedan su capacidad</li>
            <li>Coordina horarios con los productores</li>
          </ul>
        `,
      },
      'sales': {
        title: 'Registro de Ventas',
        content: `
          <h4>Control de Ventas en Ferias</h4>
          <p>Registra y gestiona las ventas realizadas:</p>
          <ul>
            <li><strong>Registrar ventas</strong> de cada productor por feria</li>
            <li><strong>Ver historial</strong> de ventas por productor</li>
            <li><strong>Generar estadísticas</strong> de ventas</li>
            <li><strong>Exportar datos</strong> para análisis</li>
            <li><strong>Ver productos más vendidos</strong></li>
          </ul>
          <h4>Datos a registrar:</h4>
          <ul>
            <li>Monto total de ventas</li>
            <li>Productos vendidos y cantidades</li>
            <li>Fecha y feria correspondiente</li>
            <li>Observaciones adicionales</li>
          </ul>
        `,
      },
      'reports': {
        title: 'Reportes y Estadísticas',
        content: `
          <h4>Generación de Reportes</h4>
          <p>Crea y visualiza reportes del sistema:</p>
          <ul>
            <li><strong>Reportes de ferias:</strong> Participación, ventas totales, productores</li>
            <li><strong>Reportes de productores:</strong> Historial, ventas, participaciones</li>
            <li><strong>Reportes de ventas:</strong> Por producto, por feria, por periodo</li>
            <li><strong>Estadísticas generales:</strong> Tendencias, gráficos, análisis</li>
          </ul>
          <h4>Opciones de exportación:</h4>
          <ul>
            <li>PDF para impresión</li>
            <li>Excel para análisis de datos</li>
            <li>Gráficos interactivos</li>
          </ul>
        `,
      },
      'profile': {
        title: 'Mi Perfil',
        content: `
          <h4>Gestión de tu Perfil de Usuario</h4>
          <p>En esta página puedes administrar tu información personal:</p>
          <ul>
            <li><strong>Editar información:</strong> Actualiza tu nombre, email, teléfono</li>
            <li><strong>Cambiar contraseña:</strong> Mantén tu cuenta segura</li>
            <li><strong>Ver tu rol:</strong> Administrador, Coordinador, Productor o Usuario</li>
          </ul>
          <h4>Seguridad de la Cuenta</h4>
          <ul>
            <li>Cambia tu contraseña regularmente</li>
            <li>Usa contraseñas fuertes (mínimo 8 caracteres)</li>
            <li>No compartas tus credenciales</li>
          </ul>
          <h4>Eliminar Cuenta</h4>
          <p>Si deseas eliminar tu cuenta, ten en cuenta que esta acción es <strong>irreversible</strong> y perderás todos tus datos.</p>
        `,
      },
    };

    return helpContent[key] || helpContent['home'];
  };

  const help = getHelpContent(pageKey);

  return (
    <>
      <button
        className="help-button-float"
        onClick={() => setIsOpen(true)}
        aria-label="Ayuda"
        title="¿Necesitas ayuda?"
      >
        <span className="help-icon">?</span>
      </button>

      {isOpen && (
        <HelpModal
          title={help.title}
          content={help.content}
          videoUrl={help.videoUrl}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
