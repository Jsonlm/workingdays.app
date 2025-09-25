/**
 * Servicio para obtener y manejar días festivos de Colombia
 */

import axios, { AxiosResponse } from 'axios';
import { Holiday, HolidayApiResponse, HOLIDAYS_API_URL } from '../types';

export class HolidaysService {
  private holidaysCache: Set<string> = new Set();
  private lastCacheUpdate: Date | null = null;
  private readonly CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 horas

  /**
   * Obtiene los días festivos desde la API externa
   */
  public async fetchHolidays(): Promise<Set<string>> {
    try {
      const response: AxiosResponse<HolidayApiResponse> = await axios.get(HOLIDAYS_API_URL, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'WorkingDays-API/1.0'
        }
      });

      const holidays: Set<string> = new Set();
      
      // La API devuelve un array simple de fechas, todas son días festivos nacionales
      response.data.forEach(dateString => {
        holidays.add(dateString);
      });

      return holidays;
    } catch (error) {
      console.error('Error fetching holidays:', error);
      throw new Error(`Failed to fetch holidays: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Verifica si una fecha es día festivo
   */
  public async isHoliday(date: Date): Promise<boolean> {
    await this.ensureHolidaysCache();
    
    const dateString = this.formatDateForComparison(date);
    return this.holidaysCache.has(dateString);
  }

  /**
   * Obtiene todos los días festivos (para debugging/logging)
   */
  public async getAllHolidays(): Promise<string[]> {
    await this.ensureHolidaysCache();
    return Array.from(this.holidaysCache).sort();
  }

  /**
   * Asegura que el cache de días festivos esté actualizado
   */
  private async ensureHolidaysCache(): Promise<void> {
    const now = new Date();
    
    // Si no hay cache o ha expirado, actualizarlo
    if (!this.lastCacheUpdate || 
        (now.getTime() - this.lastCacheUpdate.getTime()) > this.CACHE_DURATION_MS) {
      
      console.log('Updating holidays cache...');
      this.holidaysCache = await this.fetchHolidays();
      this.lastCacheUpdate = now;
      console.log(`Holidays cache updated with ${this.holidaysCache.size} holidays`);
    }
  }

  /**
   * Formatea una fecha para comparación (YYYY-MM-DD)
   */
  private formatDateForComparison(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Limpia el cache (útil para testing)
   */
  public clearCache(): void {
    this.holidaysCache.clear();
    this.lastCacheUpdate = null;
  }
}
