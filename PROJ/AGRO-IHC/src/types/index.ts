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

// CONTEXTO: Navegación del sistema
export type MenuOption = 
  | 'home' 
  | 'producers' 
  | 'fairs' 
  | 'registrations' 
  | 'transport' 
  | 'sales' 
  | 'reports';

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
