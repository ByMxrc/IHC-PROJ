
import { useAuth } from '../context/AuthContext';
import './ProducerHome.css';

export default function ProducerHome() {
  const { user } = useAuth();

  return (
    <div className="producer-home-page">
      <h1>👨‍🌾 Bienvenido, {user?.fullName || user?.username}</h1>
      <p>Este es tu panel de productor. Aquí podrás inscribirte a ferias, ver tus inscripciones y consultar tus ventas.</p>
      <ul>
        <li>📝 <strong>Inscribirse a una feria:</strong> Accede a la sección de inscripciones para participar en próximas ferias.</li>
        <li>📊 <strong>Ver tus ventas:</strong> Consulta el historial de ventas realizadas en ferias anteriores.</li>
        <li>👤 <strong>Editar tu perfil:</strong> Actualiza tus datos personales y de contacto.</li>
      </ul>
      <p>¡Éxitos en tus ferias!</p>
    </div>
  );
}
