/**
 * Servicio principal para calcular días y horas hábiles en Colombia
 */

import { addDays, addHours, getDay, isWeekend, startOfDay, setHours, setMinutes, setSeconds, setMilliseconds } from 'date-fns';
import { DayOfWeek, WORKING_DAYS, BUSINESS_HOURS } from '../types';
import { HolidaysService } from './HolidaysService';
import { TimezoneService } from './TimezoneService';

export class WorkingDaysCalculator {
  constructor(
    private holidaysService: HolidaysService,
    private timezoneService: TimezoneService
  ) {}

  /**
   * Calcula la fecha resultante después de agregar días y horas hábiles
   */
  public async calculateWorkingDateTime(
    startDate: Date,
    workingDays: number = 0,
    workingHours: number = 0
  ): Promise<Date> {
    let currentDate = this.normalizeToWorkingTime(startDate);
    
    console.log(`Starting calculation from: ${currentDate.toISOString()} (Colombia time)`);
    console.log(`Adding ${workingDays} working days and ${workingHours} working hours`);

    // Primero agregar días hábiles
    if (workingDays > 0) {
      currentDate = await this.addWorkingDays(currentDate, workingDays);
      console.log(`After adding ${workingDays} working days: ${currentDate.toISOString()}`);
    }

    // Luego agregar horas hábiles
    if (workingHours > 0) {
      currentDate = await this.addWorkingHours(currentDate, workingHours);
      console.log(`After adding ${workingHours} working hours: ${currentDate.toISOString()}`);
    }

    return currentDate;
  }

  /**
   * Normaliza una fecha al horario laboral más cercano hacia atrás
   */
  private normalizeToWorkingTime(date: Date): Date {
    let normalizedDate = new Date(date);

    // Si es fin de semana, retroceder al viernes anterior a las 5:00 PM
    if (isWeekend(normalizedDate)) {
      const daysToSubtract = getDay(normalizedDate) === DayOfWeek.SATURDAY ? 1 : 2;
      normalizedDate = addDays(normalizedDate, -daysToSubtract);
      normalizedDate = this.setToEndOfWorkingDay(normalizedDate);
      return normalizedDate;
    }

    const hour = normalizedDate.getHours();

    // Si está antes del horario laboral, retroceder al día anterior a las 5:00 PM
    if (hour < BUSINESS_HOURS.start) {
      normalizedDate = addDays(normalizedDate, -1);
      normalizedDate = this.setToEndOfWorkingDay(normalizedDate);
      return normalizedDate;
    }

    // Si está después del horario laboral, retroceder a las 5:00 PM del mismo día
    if (hour >= BUSINESS_HOURS.end) {
      normalizedDate = this.setToEndOfWorkingDay(normalizedDate);
      return normalizedDate;
    }

    // Si está en horario de almuerzo, retroceder al inicio del horario de almuerzo
    if (hour >= BUSINESS_HOURS.lunchStart && hour < BUSINESS_HOURS.lunchEnd) {
      normalizedDate = this.setToLunchStart(normalizedDate);
      return normalizedDate;
    }

    return normalizedDate;
  }

  /**
   * Agrega días hábiles a una fecha
   */
  private async addWorkingDays(startDate: Date, daysToAdd: number): Promise<Date> {
    let currentDate = new Date(startDate);
    let daysAdded = 0;

    while (daysAdded < daysToAdd) {
      currentDate = addDays(currentDate, 1);
      
      // Verificar si es día hábil (no fin de semana y no festivo)
      if (await this.isWorkingDay(currentDate)) {
        daysAdded++;
        // Establecer al inicio del día laboral
        currentDate = this.setToStartOfWorkingDay(currentDate);
      }
    }

    return currentDate;
  }

  /**
   * Agrega horas hábiles a una fecha
   */
  private async addWorkingHours(startDate: Date, hoursToAdd: number): Promise<Date> {
    let currentDate = new Date(startDate);
    let hoursAdded = 0;

    while (hoursAdded < hoursToAdd) {
      const nextHour = addHours(currentDate, 1);
      const nextHourColombia = this.timezoneService.utcToColombia(nextHour);
      
      // Verificar si la siguiente hora está en horario laboral
      if (await this.isWithinWorkingHours(nextHourColombia)) {
        currentDate = nextHour;
        hoursAdded++;
      } else {
        // Avanzar al siguiente día hábil al inicio del horario laboral
        currentDate = await this.moveToNextWorkingDayStart(currentDate);
      }
    }

    return currentDate;
  }

  /**
   * Verifica si una fecha es día hábil (no fin de semana y no festivo)
   */
  private async isWorkingDay(date: Date): Promise<boolean> {
    // Verificar si no es fin de semana
    if (isWeekend(date)) {
      return false;
    }

    // Verificar si no es día festivo
    return !(await this.holidaysService.isHoliday(date));
  }

  /**
   * Verifica si una hora está dentro del horario laboral
   */
  private async isWithinWorkingHours(date: Date): Promise<boolean> {
    // Primero verificar si es día hábil
    if (!(await this.isWorkingDay(date))) {
      return false;
    }

    const hour = date.getHours();
    
    // Verificar si está en horario laboral (8 AM - 5 PM)
    if (hour < BUSINESS_HOURS.start || hour >= BUSINESS_HOURS.end) {
      return false;
    }

    // Verificar que no esté en horario de almuerzo (12 PM - 1 PM)
    if (hour >= BUSINESS_HOURS.lunchStart && hour < BUSINESS_HOURS.lunchEnd) {
      return false;
    }

    return true;
  }

  /**
   * Mueve a el inicio del siguiente día hábil
   */
  private async moveToNextWorkingDayStart(date: Date): Promise<Date> {
    let nextDate = addDays(date, 1);
    
    while (!(await this.isWorkingDay(nextDate))) {
      nextDate = addDays(nextDate, 1);
    }

    return this.setToStartOfWorkingDay(nextDate);
  }

  /**
   * Establece una fecha al inicio del día laboral (8:00 AM)
   */
  private setToStartOfWorkingDay(date: Date): Date {
    const colombiaDate = this.timezoneService.utcToColombia(date);
    const startOfDayDate = startOfDay(colombiaDate);
    const workingStartDate = setHours(startOfDayDate, BUSINESS_HOURS.start);
    const finalDate = setMinutes(workingStartDate, 0);
    return this.timezoneService.colombiaToUtc(finalDate);
  }

  /**
   * Establece una fecha al final del día laboral (5:00 PM)
   */
  private setToEndOfWorkingDay(date: Date): Date {
    const colombiaDate = this.timezoneService.utcToColombia(date);
    const startOfDayDate = startOfDay(colombiaDate);
    const workingEndDate = setHours(startOfDayDate, BUSINESS_HOURS.end);
    const finalDate = setMinutes(workingEndDate, 0);
    return this.timezoneService.colombiaToUtc(finalDate);
  }

  /**
   * Establece una fecha al inicio del horario de almuerzo (12:00 PM)
   */
  private setToLunchStart(date: Date): Date {
    const colombiaDate = this.timezoneService.utcToColombia(date);
    const startOfDayDate = startOfDay(colombiaDate);
    const lunchStartDate = setHours(startOfDayDate, BUSINESS_HOURS.lunchStart);
    const finalDate = setMinutes(lunchStartDate, 0);
    return this.timezoneService.colombiaToUtc(finalDate);
  }
}
