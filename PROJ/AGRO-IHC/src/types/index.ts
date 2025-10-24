/**
 * Tipos de datos del Sistema de Gestión de Ferias Agroproductivas
 * Siguiendo normas ISO 9241-11 y ISO 9241-210
 */

// CONTEXTO: Usuarios del sistema
export interface Producer {
  id: string;
  name: string;
  lastName: string;
  documentType: 'DNI' | 'RUC' | 'CE';
  documentNumber: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  province: string;
  department: string;
  productType: string[];
  farmSize: number;
  registrationDate: Date;
  status: 'active' | 'inactive' | 'pending';
}

// CONTEXTO: Ferias agroproductivas
export interface Fair {
  id: string;
  name: string;
  description: string;
  location: string;
  address: string;
  startDate: Date;
  endDate: Date;
  maxCapacity: number;
  currentCapacity: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  productCategories: string[];
  requirements: string[];
}

// CONTEXTO: Inscripciones a ferias
export interface Registration {
  id: string;
  producerId: string;
  fairId: string;
  registrationDate: Date;
  productsToSell: string[];
  estimatedQuantity: number;
  needsTransport: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  boothNumber?: string;
}

// CONTEXTO: Logística de transporte
export interface Transport {
  id: string;
  fairId: string;
  registrationId: string;
  pickupLocation: string;
  pickupDate: Date;
  estimatedArrival: Date;
  vehicleType: 'truck' | 'van' | 'pickup';
  driver: string;
  driverPhone: string;
  status: 'scheduled' | 'in-transit' | 'delivered' | 'cancelled';
  cost: number;
}

// CONTEXTO: Comercialización
export interface Sales {
  id: string;
  registrationId: string;
  producerId: string;
  fairId: string;
  totalSales: number;
  productsSold: {
    product: string;
    quantity: number;
    price: number;
  }[];
  date: Date;
}

// REQUISITOS: Validación de formularios
export interface FormValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

// CONTEXTO: Autenticación de usuarios
export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'user';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

// CONTEXTO: Navegación del sistema
export type MenuOption = 
  | 'home' 
  | 'producers' 
  | 'fairs' 
  | 'registrations' 
  | 'transport' 
  | 'sales' 
  | 'reports'
  | 'edit-home';

// CONTEXTO: Provincias del Ecuador
export const PROVINCIAS_ECUADOR = [
  'Azuay',
  'Bolívar',
  'Cañar',
  'Carchi',
  'Chimborazo',
  'Cotopaxi',
  'El Oro',
  'Esmeraldas',
  'Galápagos',
  'Guayas',
  'Imbabura',
  'Loja',
  'Los Ríos',
  'Manabí',
  'Morona Santiago',
  'Napo',
  'Orellana',
  'Pastaza',
  'Pichincha',
  'Santa Elena',
  'Santo Domingo de los Tsáchilas',
  'Sucumbíos',
  'Tungurahua',
  'Zamora Chinchipe',
] as const;

// CONTEXTO: Cantones principales por provincia (selección representativa)
export const CANTONES_POR_PROVINCIA: Record<string, string[]> = {
  'Azuay': ['Cuenca', 'Gualaceo', 'Paute', 'Santa Isabel', 'Girón', 'Sígsig', 'Chordeleg'],
  'Bolívar': ['Guaranda', 'Chimbo', 'San Miguel', 'Chillanes', 'Echeandía'],
  'Cañar': ['Azogues', 'Cañar', 'La Troncal', 'Biblián', 'El Tambo'],
  'Carchi': ['Tulcán', 'Montúfar', 'Espejo', 'Mira', 'Bolívar', 'San Pedro de Huaca'],
  'Chimborazo': ['Riobamba', 'Alausí', 'Guano', 'Chambo', 'Colta', 'Chunchi'],
  'Cotopaxi': ['Latacunga', 'Pujilí', 'Salcedo', 'Saquisilí', 'La Maná', 'Sigchos'],
  'El Oro': ['Machala', 'Pasaje', 'Santa Rosa', 'Huaquillas', 'El Guabo', 'Zaruma'],
  'Esmeraldas': ['Esmeraldas', 'Atacames', 'Muisne', 'Quinindé', 'San Lorenzo', 'Eloy Alfaro'],
  'Galápagos': ['San Cristóbal', 'Santa Cruz', 'Isabela'],
  'Guayas': ['Guayaquil', 'Durán', 'Milagro', 'Daule', 'Samborondón', 'Naranjal', 'Pedro Carbo'],
  'Imbabura': ['Ibarra', 'Otavalo', 'Cotacachi', 'Atuntaqui', 'Pimampiro', 'Urcuquí'],
  'Loja': ['Loja', 'Catamayo', 'Macará', 'Cariamanga', 'Catacocha', 'Zapotillo'],
  'Los Ríos': ['Babahoyo', 'Quevedo', 'Ventanas', 'Vinces', 'Valencia', 'Buena Fe'],
  'Manabí': ['Portoviejo', 'Manta', 'Montecristi', 'Jipijapa', 'Chone', 'Bahía de Caráquez', 'El Carmen'],
  'Morona Santiago': ['Macas', 'Gualaquiza', 'Sucúa', 'Méndez', 'Santiago', 'Palora'],
  'Napo': ['Tena', 'Archidona', 'El Chaco', 'Quijos', 'Carlos Julio Arosemena Tola'],
  'Orellana': ['Francisco de Orellana', 'La Joya de los Sachas', 'Loreto', 'Aguarico'],
  'Pastaza': ['Puyo', 'Mera', 'Santa Clara', 'Arajuno'],
  'Pichincha': ['Quito', 'Cayambe', 'Mejía', 'Pedro Moncayo', 'Rumiñahui', 'San Miguel de los Bancos'],
  'Santa Elena': ['Santa Elena', 'La Libertad', 'Salinas'],
  'Santo Domingo de los Tsáchilas': ['Santo Domingo'],
  'Sucumbíos': ['Nueva Loja', 'Shushufindi', 'Cascales', 'Cuyabeno', 'Gonzalo Pizarro', 'Putumayo', 'Sucumbíos'],
  'Tungurahua': ['Ambato', 'Baños de Agua Santa', 'Pelileo', 'Píllaro', 'Patate', 'Cevallos'],
  'Zamora Chinchipe': ['Zamora', 'Yantzaza', 'Chinchipe', 'El Pangui', 'Nangaritza'],
};

// CONTEXTO: Contenido editable de la página de inicio
export interface FeatureCard {
  id: string;
  icon: string;
  title: string;
  description: string;
  order: number;
}

export interface BenefitCard {
  id: string;
  icon: string;
  title: string;
  benefits: string[];
  order: number;
}

export interface HomeContent {
  heroTitle: string;
  heroSubtitle: string;
  contextTitle: string;
  contextParagraphs: string[];
  missionText: string;
  featureCards: FeatureCard[];
  benefitCards: BenefitCard[];
}

// Contenido por defecto de la página de inicio
export const DEFAULT_HOME_CONTENT: HomeContent = {
  heroTitle: 'Sistema de Gestión de Ferias Agroproductivas',
  heroSubtitle: 'Conectando productores agrícolas con oportunidades de comercialización',
  contextTitle: '¿Qué son las Ferias Agroproductivas?',
  contextParagraphs: [
    'Las ferias agroproductivas son eventos que reúnen a productores agrícolas locales con consumidores, comerciantes y otros actores del sector agrícola. Estos espacios permiten la comercialización directa de productos frescos, procesados y artesanales, fortaleciendo la economía local y promoviendo la agricultura sostenible.',
    'En Ecuador, las ferias agroproductivas han cobrado gran importancia como mecanismo para acortar la cadena de comercialización, garantizando precios justos tanto para productores como para consumidores, y fomentando el consumo de productos locales de calidad.'
  ],
  missionText: 'Facilitar la gestión integral de ferias agroproductivas mediante un sistema digital que optimiza la organización, inscripción, logística y comercialización, conectando de manera eficiente a todos los actores involucrados en el proceso y contribuyendo al desarrollo del sector agrícola ecuatoriano.',
  featureCards: [
    { id: '1', icon: '👨‍🌾', title: 'Inscripción de Productores', description: 'Registro completo de productores agrícolas con validación de datos y gestión de perfiles.', order: 1 },
    { id: '2', icon: '🎪', title: 'Calendario de Ferias', description: 'Gestión de ferias agroproductivas con fechas, ubicaciones y capacidad de participantes.', order: 2 },
    { id: '3', icon: '📝', title: 'Inscripciones', description: 'Sistema de inscripción a ferias con gestión de cupos y confirmación automática.', order: 3 },
    { id: '4', icon: '🚚', title: 'Logística de Transporte', description: 'Coordinación de transporte para productos desde el origen hasta la feria.', order: 4 },
    { id: '5', icon: '💰', title: 'Comercialización', description: 'Registro de ventas y seguimiento del rendimiento de cada productor.', order: 5 },
    { id: '6', icon: '📊', title: 'Reportes', description: 'Análisis y estadísticas para mejorar la toma de decisiones.', order: 6 },
  ],
  benefitCards: [
    { 
      id: '1', 
      icon: '🌱', 
      title: 'Para Productores', 
      benefits: ['Acceso directo al mercado', 'Mejores precios por sus productos', 'Visibilidad de su trabajo', 'Networking con otros productores'],
      order: 1
    },
    { 
      id: '2', 
      icon: '🛒', 
      title: 'Para Consumidores', 
      benefits: ['Productos frescos y de calidad', 'Precios competitivos', 'Conocimiento del origen de alimentos', 'Apoyo a la economía local'],
      order: 2
    },
    { 
      id: '3', 
      icon: '🏘️', 
      title: 'Para la Comunidad', 
      benefits: ['Fortalecimiento económico local', 'Promoción de cultura alimentaria', 'Espacios de encuentro social', 'Desarrollo rural sostenible'],
      order: 3
    },
  ],
};
