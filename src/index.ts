/**
 * Punto de entrada principal de la aplicación
 */

import { App } from './app';
import { Server } from 'http';

const PORT = process.env.PORT || 3000;

async function startServer(): Promise<void> {
  try {
    const app = new App();
    const expressApp = app.getApp();

    // Iniciar servidor
    const server: Server = expressApp.listen(PORT, () => {
      console.log(`🚀 Working Days API is running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`📊 API endpoint: http://localhost:${PORT}/api/working-days`);
      console.log(`🌍 Timezone: America/Bogota (Colombia)`);
      console.log(`⏰ Current Colombia time: ${new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' })}`);
    });

    // Manejo graceful de cierre
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received. Shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Iniciar servidor
startServer();
