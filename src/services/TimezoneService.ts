/**
 * Servicio para manejo de zonas horarias (Colombia/UTC)
 */

import { format, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { parseISO } from 'date-fns';
import { COLOMBIA_TIMEZONE } from '../types';

export class TimezoneService {
  /**
   * Convierte una fecha UTC a hora de Colombia
   */
  public utcToColombia(utcDate: Date): Date {
    return utcToZonedTime(utcDate, COLOMBIA_TIMEZONE);
  }

  /**
   * Convierte una fecha de Colombia a UTC
   */
  public colombiaToUtc(colombiaDate: Date): Date {
    return zonedTimeToUtc(colombiaDate, COLOMBIA_TIMEZONE);
  }

  /**
   * Obtiene la fecha actual en Colombia
   */
  public getCurrentColombiaTime(): Date {
    const utcNow = new Date();
    return this.utcToColombia(utcNow);
  }

  /**
   * Parsea una fecha ISO 8601 UTC y la convierte a Colombia
   */
  public parseUtcAndConvertToColombia(isoString: string): Date {
    try {
      const utcDate = parseISO(isoString);
      
      // Verificar que la fecha sea válida
      if (isNaN(utcDate.getTime())) {
        throw new Error('Invalid date format');
      }

      return this.utcToColombia(utcDate);
    } catch (error) {
      throw new Error(`Failed to parse date: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Formatea una fecha de Colombia a ISO 8601 UTC
   */
  public formatColombiaToUtc(colombiaDate: Date): string {
    const utcDate = this.colombiaToUtc(colombiaDate);
    return utcDate.toISOString();
  }

  /**
   * Valida que una cadena sea una fecha ISO 8601 válida con sufijo Z
   */
  public isValidUtcIsoString(dateString: string): boolean {
    try {
      // Debe terminar en Z para indicar UTC
      if (!dateString.endsWith('Z')) {
        return false;
      }

      const date = parseISO(dateString);
      return !isNaN(date.getTime());
    } catch {
      return false;
    }
  }

  /**
   * Obtiene información de debugging sobre la conversión de zonas horarias
   */
  public getTimezoneDebugInfo(date: Date): {
    utc: string;
    colombia: string;
    utcFormatted: string;
    colombiaFormatted: string;
  } {
    const utcDate = date;
    const colombiaDate = this.utcToColombia(date);

    return {
      utc: utcDate.toISOString(),
      colombia: colombiaDate.toISOString(),
      utcFormatted: format(utcDate, 'yyyy-MM-dd HH:mm:ss', { timeZone: 'UTC' }) + ' UTC',
      colombiaFormatted: format(colombiaDate, 'yyyy-MM-dd HH:mm:ss', { timeZone: COLOMBIA_TIMEZONE }) + ' COT'
    };
  }
}
