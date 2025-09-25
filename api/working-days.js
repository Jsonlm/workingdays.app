/**
 * API endpoint para cálculo de días hábiles
 */

const { App } = require('../dist/app');

// Crear la aplicación una sola vez
const app = new App();
const expressApp = app.getApp();

// Exportar para Vercel
module.exports = expressApp;
