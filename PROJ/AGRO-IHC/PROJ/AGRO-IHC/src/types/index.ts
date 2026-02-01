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
  role: 'admin' | 'coordinator' | 'producer' | 'user';
  email?: string;
  fullName?: string;
  phone?: string;
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
  | 'profile'
  | 'user-registration'
  | 'edit-home'
  | 'translations'
  | 'producer-home'
  | 'products'
  | 'admin-panel'
  | 'producer-tools'
  | 'coordinator-panel';

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

// CONTEXTO: Temas de accesibilidad
export type ThemeMode = 'light' | 'dark' | 'deuteranopia' | 'protanopia' | 'tritanopia';

export type Language = 'es' | 'en';

export interface AccessibilitySettings {
  theme: ThemeMode;
  language: Language;
}

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
    'Las ferias agroproductivas conectan productores locales con consumidores, fortaleciendo la economía local.',
    'En Ecuador, estas ferias garantizan precios justos y fomentan productos locales de calidad.'
  ],
  missionText: 'Facilitar la gestión de ferias agroproductivas mediante un sistema digital eficiente.',
  featureCards: [
    { id: '1', icon: '👨‍🌾', title: 'Inscripción de Productores', description: 'Registro de productores agrícolas con validación de datos.', order: 1 },
    { id: '2', icon: '🎪', title: 'Calendario de Ferias', description: 'Gestión de ferias con fechas y ubicaciones.', order: 2 },
    { id: '3', icon: '📝', title: 'Inscripciones', description: 'Sistema de inscripción con gestión de cupos.', order: 3 },
    { id: '4', icon: '🚚', title: 'Logística de Transporte', description: 'Coordinación de transporte para productos.', order: 4 },
    { id: '5', icon: '💰', title: 'Comercialización', description: 'Registro de ventas y seguimiento.', order: 5 },
    { id: '6', icon: '📊', title: 'Reportes', description: 'Análisis y estadísticas.', order: 6 },
  ],
  benefitCards: [
    { 
      id: '1', 
      icon: '🌱', 
      title: 'Para Productores', 
      benefits: ['Acceso directo al mercado', 'Mejores precios', 'Visibilidad', 'Networking'],
      order: 1
    },
    { 
      id: '2', 
      icon: '🛒', 
      title: 'Para Consumidores', 
      benefits: ['Productos frescos', 'Precios justos', 'Origen conocido', 'Apoyo local'],
      order: 2
    },
    { 
      id: '3', 
      icon: '🏘️', 
      title: 'Para la Comunidad', 
      benefits: ['Economía local', 'Cultura alimentaria', 'Encuentro social', 'Desarrollo rural'],
      order: 3
    },
  ],
};

// Contenido por defecto en inglés
export const DEFAULT_HOME_CONTENT_EN: HomeContent = {
  heroTitle: 'Agricultural Fair Management System',
  heroSubtitle: 'Connecting agricultural producers with marketing opportunities',
  contextTitle: 'What are Agricultural Fairs?',
  contextParagraphs: [
    'Agricultural fairs connect local producers with consumers, strengthening the local economy.',
    'In Ecuador, these fairs ensure fair prices and promote quality local products.'
  ],
  missionText: 'To facilitate the management of agricultural fairs through an efficient digital system.',
  featureCards: [
    { id: '1', icon: '👨‍🌾', title: 'Producer Registration', description: 'Agricultural producer registration with data validation.', order: 1 },
    { id: '2', icon: '🎪', title: 'Fair Calendar', description: 'Fair management with dates and locations.', order: 2 },
    { id: '3', icon: '📝', title: 'Registrations', description: 'Registration system with quota management.', order: 3 },
    { id: '4', icon: '🚚', title: 'Transport Logistics', description: 'Product transport coordination.', order: 4 },
    { id: '5', icon: '💰', title: 'Marketing', description: 'Sales recording and tracking.', order: 5 },
    { id: '6', icon: '📊', title: 'Reports', description: 'Analysis and statistics.', order: 6 },
  ],
  benefitCards: [
    { 
      id: '1', 
      icon: '🌱', 
      title: 'For Producers', 
      benefits: ['Direct market access', 'Better prices', 'Visibility', 'Networking'],
      order: 1
    },
    { 
      id: '2', 
      icon: '🛒', 
      title: 'For Consumers', 
      benefits: ['Fresh products', 'Fair prices', 'Known origin', 'Local support'],
      order: 2
    },
    { 
      id: '3', 
      icon: '🏘️', 
      title: 'For the Community', 
      benefits: ['Local economy', 'Food culture', 'Social gathering', 'Rural development'],
      order: 3
    },
  ],
};
