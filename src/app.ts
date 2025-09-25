/**
 * Configuración principal de la aplicación Express
 */

import express, { Application } from 'express';
import cors from 'cors';
import { HolidaysService } from './services/HolidaysService';
import { TimezoneService } from './services/TimezoneService';
import { WorkingDaysCalculator } from './services/WorkingDaysCalculator';
import { WorkingDaysController } from './controllers/WorkingDaysController';

export class App {
  public app: Application;
  private holidaysService!: HolidaysService;
  private timezoneService!: TimezoneService;
  private workingDaysCalculator!: WorkingDaysCalculator;
  private workingDaysController!: WorkingDaysController;

  constructor() {
    this.app = express();
    this.initializeServices();
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  /**
   * Inicializa todos los servicios
   */
  private initializeServices(): void {
    this.holidaysService = new HolidaysService();
    this.timezoneService = new TimezoneService();
    this.workingDaysCalculator = new WorkingDaysCalculator(
      this.holidaysService,
      this.timezoneService
    );
    this.workingDaysController = new WorkingDaysController(
      this.workingDaysCalculator,
      this.timezoneService
    );
  }

  /**
   * Configura middlewares de Express
   */
  private initializeMiddlewares(): void {
    // CORS
    this.app.use(cors({
      origin: '*', // En producción, especificar dominios permitidos
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Parse JSON bodies
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // Logging middleware
    this.app.use((req, res, next) => {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] ${req.method} ${req.path} - Query:`, req.query);
      next();
    });
  }

  /**
   * Configura las rutas de la API
   */
  private initializeRoutes(): void {
    // Ruta principal para el cálculo de días hábiles
    this.app.get('/api/working-days', (req, res) => {
      this.workingDaysController.calculateWorkingDays(req, res);
    });

    // Ruta de salud
    this.app.get('/health', (req, res) => {
      this.workingDaysController.healthCheck(req, res);
    });

    // Ruta raíz con información de la API
    this.app.get('/', (req, res) => {
      res.json({
        name: 'Working Days Calculator API',
        version: '1.0.0',
        description: 'API para calcular fechas hábiles en Colombia',
        endpoints: {
          'GET /api/working-days': 'Calcula fechas hábiles',
          'GET /health': 'Verificación de salud de la API'
        },
        parameters: {
          days: 'Número de días hábiles a sumar (opcional, entero positivo)',
          hours: 'Número de horas hábiles a sumar (opcional, entero positivo)',
          date: 'Fecha/hora inicial en UTC ISO 8601 con sufijo Z (opcional)'
        }
      });
    });

    // Middleware para manejar rutas no encontradas
    this.app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.originalUrl} not found`
      });
    });

    // Middleware global de manejo de errores
    this.app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('Unhandled error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred'
      });
    });
  }

  /**
   * Obtiene la instancia de la aplicación Express
   */
  public getApp(): Application {
    return this.app;
  }
}
