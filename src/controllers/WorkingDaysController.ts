/**
 * Controlador para el endpoint de cálculo de días hábiles
 */

import { Request, Response } from 'express';
import { WorkingDaysRequest, WorkingDaysResponse, ErrorResponse, ErrorType } from '../types';
import { WorkingDaysCalculator } from '../services/WorkingDaysCalculator';
import { TimezoneService } from '../services/TimezoneService';

export class WorkingDaysController {
  constructor(
    private workingDaysCalculator: WorkingDaysCalculator,
    private timezoneService: TimezoneService
  ) {}

  /**
   * Maneja la petición GET para calcular días hábiles
   */
  public async calculateWorkingDays(req: Request, res: Response): Promise<void> {
    try {
      console.log('Received request:', req.query);

      // Validar y parsear parámetros
      const requestData = this.validateAndParseRequest(req.query);
      
      // Determinar fecha de inicio
      const startDate = this.getStartDate(requestData);
      
      console.log(`Starting calculation from: ${startDate.toISOString()} (Colombia time)`);

      // Calcular fecha resultante
      const resultDate = await this.workingDaysCalculator.calculateWorkingDateTime(
        startDate,
        requestData.days || 0,
        requestData.hours || 0
      );

      // Convertir resultado a UTC y formatear respuesta
      const utcResult = this.timezoneService.formatColombiaToUtc(resultDate);
      
      const response: WorkingDaysResponse = {
        date: utcResult
      };

      console.log(`Calculation result: ${response.date}`);
      res.status(200).json(response);

    } catch (error) {
      console.error('Error in calculateWorkingDays:', error);
      this.handleError(error, res);
    }
  }

  /**
   * Valida y parsea los parámetros de la petición
   */
  private validateAndParseRequest(query: any): WorkingDaysRequest {
    const { days, hours, date } = query;

    // Verificar que al menos uno de los parámetros days o hours esté presente
    if (days === undefined && hours === undefined) {
      throw new Error('At least one of "days" or "hours" parameter must be provided');
    }

    const requestData: WorkingDaysRequest = {};

    // Validar y parsear días
    if (days !== undefined) {
      const parsedDays = parseInt(days, 10);
      if (isNaN(parsedDays) || parsedDays < 0 || !Number.isInteger(parsedDays)) {
        throw new Error('Parameter "days" must be a non-negative integer');
      }
      requestData.days = parsedDays;
    }

    // Validar y parsear horas
    if (hours !== undefined) {
      const parsedHours = parseInt(hours, 10);
      if (isNaN(parsedHours) || parsedHours < 0 || !Number.isInteger(parsedHours)) {
        throw new Error('Parameter "hours" must be a non-negative integer');
      }
      requestData.hours = parsedHours;
    }

    // Validar fecha si se proporciona
    if (date !== undefined) {
      if (typeof date !== 'string') {
        throw new Error('Parameter "date" must be a string');
      }
      
      if (!this.timezoneService.isValidUtcIsoString(date)) {
        throw new Error('Parameter "date" must be a valid ISO 8601 UTC date string ending with "Z"');
      }
      
      requestData.date = date;
    }

    return requestData;
  }

  /**
   * Obtiene la fecha de inicio basada en los parámetros
   */
  private getStartDate(requestData: WorkingDaysRequest): Date {
    if (requestData.date) {
      // Usar la fecha proporcionada, convertir de UTC a Colombia
      return this.timezoneService.parseUtcAndConvertToColombia(requestData.date);
    } else {
      // Usar la fecha actual en Colombia
      return this.timezoneService.getCurrentColombiaTime();
    }
  }

  /**
   * Maneja errores y envía respuesta apropiada
   */
  private handleError(error: unknown, res: Response): void {
    let errorResponse: ErrorResponse;
    let statusCode = 500;

    if (error instanceof Error) {
      const message = error.message;
      
      if (message.includes('Parameter') || message.includes('must be provided') || message.includes('Invalid')) {
        errorResponse = {
          error: ErrorType.INVALID_PARAMETERS,
          message: message
        };
        statusCode = 400;
      } else if (message.includes('Failed to fetch holidays') || message.includes('External API')) {
        errorResponse = {
          error: ErrorType.EXTERNAL_API_ERROR,
          message: 'Unable to fetch holiday data from external service'
        };
        statusCode = 503;
      } else {
        errorResponse = {
          error: ErrorType.INTERNAL_ERROR,
          message: 'An internal error occurred while processing the request'
        };
        statusCode = 500;
      }
    } else {
      errorResponse = {
        error: ErrorType.INTERNAL_ERROR,
        message: 'An unknown error occurred'
      };
      statusCode = 500;
    }

    res.status(statusCode).json(errorResponse);
  }

  /**
   * Endpoint de salud para verificar que la API está funcionando
   */
  public async healthCheck(req: Request, res: Response): Promise<void> {
    const healthResponse = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      timezone: 'America/Bogota',
      service: 'Working Days Calculator API'
    };
    
    res.status(200).json(healthResponse);
  }
}
