/**
 * Tipos e interfaces para la API de cálculo de fechas hábiles
 */

// Tipos para la respuesta de la API externa de días festivos
export type HolidayApiResponse = string[]; // Array simple de fechas en formato "YYYY-MM-DD"

export interface Holiday {
  date: string; // Formato: "YYYY-MM-DD"
  name: string;
  type: 'national' | 'regional' | 'local';
}

// Tipos para la petición a nuestra API
export interface WorkingDaysRequest {
  days?: number;
  hours?: number;
  date?: string; // ISO 8601 con Z (UTC)
}

// Tipos para la respuesta de nuestra API
export interface WorkingDaysResponse {
  date: string; // ISO 8601 con Z (UTC)
}

export interface ErrorResponse {
  error: string;
  message: string;
}

// Tipos para la lógica interna
export interface BusinessHours {
  start: number; // Hora de inicio (8 = 8:00 AM)
  end: number;   // Hora de fin (17 = 5:00 PM)
  lunchStart: number; // Hora de inicio del almuerzo (12 = 12:00 PM)
  lunchEnd: number;   // Hora de fin del almuerzo (13 = 1:00 PM)
}

export interface TimeSlot {
  start: Date;
  end: Date;
}

// Enums para mayor claridad
export enum DayOfWeek {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6
}

export enum ErrorType {
  INVALID_PARAMETERS = 'InvalidParameters',
  INVALID_DATE_FORMAT = 'InvalidDateFormat',
  EXTERNAL_API_ERROR = 'ExternalApiError',
  INTERNAL_ERROR = 'InternalError'
}

// Constantes de configuración
export const COLOMBIA_TIMEZONE = 'America/Bogota';
export const WORKING_DAYS: DayOfWeek[] = [
  DayOfWeek.MONDAY,
  DayOfWeek.TUESDAY,
  DayOfWeek.WEDNESDAY,
  DayOfWeek.THURSDAY,
  DayOfWeek.FRIDAY
];

export const BUSINESS_HOURS: BusinessHours = {
  start: 8,    // 8:00 AM
  end: 17,     // 5:00 PM
  lunchStart: 12, // 12:00 PM
  lunchEnd: 13    // 1:00 PM
};

export const HOLIDAYS_API_URL = 'https://content.capta.co/Recruitment/WorkingDays.json';
