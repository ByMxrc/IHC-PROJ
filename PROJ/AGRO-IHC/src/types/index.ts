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
