/**
 * Punto de entrada principal para Vercel
 */

const express = require('express');
const cors = require('cors');

// Importar la aplicación compilada
const { App } = require('../dist/app');

// Crear la aplicación
const app = new App();
const server = app.getApp();

// Exportar para Vercel
module.exports = server;