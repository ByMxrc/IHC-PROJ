/**
 * Utilidades de validación
 * REQUISITOS: Eficiencia en validación de datos
 */

// Validación de email
export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validación de teléfono peruano
export const validatePhone = (phone: string): boolean => {
  const regex = /^[0-9]{9}$/;
  return regex.test(phone.replace(/\s/g, ''));
};

// Validación de DNI
export const validateDNI = (dni: string): boolean => {
  const regex = /^[0-9]{8}$/;
  return regex.test(dni);
};

// Validación de RUC
export const validateRUC = (ruc: string): boolean => {
  const regex = /^[0-9]{11}$/;
  return regex.test(ruc);
};

// Validación de campo requerido
export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

// Validación de longitud mínima
export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.trim().length >= minLength;
};

// Validación de longitud máxima
export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.trim().length <= maxLength;
};

// Validación de solo letras y espacios (nombres, apellidos)
export const validateOnlyLetters = (value: string): boolean => {
  const regex = /^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/;
  return regex.test(value);
};

// Validación de texto sin símbolos especiales (direcciones)
export const validateNoSpecialSymbols = (value: string): boolean => {
  const regex = /^[a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s.,#-]+$/;
  return regex.test(value);
};

// Validación de solo letras y números (sin símbolos)
export const validateAlphanumeric = (value: string): boolean => {
  const regex = /^[a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s]+$/;
  return regex.test(value);
};

// Validación de número positivo
export const validatePositiveNumber = (value: number): boolean => {
  return !isNaN(value) && value > 0;
};

// Validación de fecha futura
export const validateFutureDate = (date: Date): boolean => {
  return date > new Date();
};

// Validación de rango de fechas
export const validateDateRange = (startDate: Date, endDate: Date): boolean => {
  return startDate < endDate;
};

// Formatear fecha a string legible
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

// Formatear moneda
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(amount);
};
