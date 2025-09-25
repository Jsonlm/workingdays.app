# Working Days Calculator API

API REST para calcular fechas hábiles en Colombia, considerando días festivos, horarios laborales y zona horaria.

## 🚀 Características

- ✅ Cálculo preciso de días y horas hábiles en Colombia
- ✅ Considera días festivos nacionales (obtenidos desde API externa)
- ✅ Horario laboral: Lunes a Viernes, 8:00 AM - 5:00 PM (con almuerzo 12:00 PM - 1:00 PM)
- ✅ Manejo correcto de zona horaria (Colombia/UTC)
- ✅ Validación completa de parámetros
- ✅ Tipado estricto en TypeScript
- ✅ Manejo de errores robusto

## 📋 Requisitos

- Node.js 16+ 
- npm o yarn

## 🛠️ Instalación

1. Clonar el repositorio
2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Compilar el proyecto:
   ```bash
   npm run build
   ```

4. Iniciar el servidor:
   ```bash
   npm start
   ```

   Para desarrollo con auto-reload:
   ```bash
   npm run dev
   ```

## 🌐 Uso de la API

### Endpoint Principal

```
GET /api/working-days
```

### Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `days` | integer | No | Número de días hábiles a sumar (≥ 0) |
| `hours` | integer | No | Número de horas hábiles a sumar (≥ 0) |
| `date` | string | No | Fecha/hora inicial en UTC (ISO 8601 con Z) |

**Nota:** Al menos uno de `days` o `hours` debe ser proporcionado.

### Respuestas

#### Éxito (200 OK)
```json
{
  "date": "2025-04-21T20:00:00.000Z"
}
```

#### Error (400 Bad Request)
```json
{
  "error": "InvalidParameters",
  "message": "At least one of \"days\" or \"hours\" parameter must be provided"
}
```

#### Error (503 Service Unavailable)
```json
{
  "error": "ExternalApiError", 
  "message": "Unable to fetch holiday data from external service"
}
```

### Ejemplos de Uso

1. **Agregar 1 día hábil:**
   ```
   GET /api/working-days?days=1
   ```

2. **Agregar 1 hora hábil:**
   ```
   GET /api/working-days?hours=1
   ```

3. **Agregar 1 día y 4 horas hábiles:**
   ```
   GET /api/working-days?days=1&hours=4
   ```

4. **Con fecha específica (ejemplo del 10 de abril de 2025):**
   ```
   GET /api/working-days?date=2025-04-10T15:00:00.000Z&days=5&hours=4
   ```

### Otros Endpoints

#### Health Check
```
GET /health
```
Verifica que la API esté funcionando correctamente.

#### Información de la API
```
GET /
```
Devuelve información general sobre la API y sus endpoints.

## 🏗️ Arquitectura

El proyecto está estructurado de manera modular:

```
src/
├── controllers/          # Controladores de Express
├── services/            # Lógica de negocio
│   ├── HolidaysService.ts      # Gestión de días festivos
│   ├── TimezoneService.ts      # Manejo de zonas horarias
│   └── WorkingDaysCalculator.ts # Cálculo principal
├── types/               # Definiciones de tipos TypeScript
├── app.ts              # Configuración de Express
└── index.ts            # Punto de entrada
```

## 🔧 Reglas de Negocio

1. **Días hábiles:** Lunes a Viernes
2. **Horario laboral:** 8:00 AM - 5:00 PM (hora Colombia)
3. **Almuerzo:** 12:00 PM - 1:00 PM (no se cuenta como tiempo hábil)
4. **Días festivos:** Excluidos automáticamente (obtenidos de API externa)
5. **Zona horaria:** Cálculos en hora Colombia, respuesta en UTC
6. **Normalización:** Si la fecha está fuera del horario laboral, se ajusta al más cercano hacia atrás

## 🧪 Testing

Para probar la API localmente:

```bash
# Health check
curl http://localhost:3000/health

# Ejemplo básico
curl "http://localhost:3000/api/working-days?days=1"

# Con fecha específica
curl "http://localhost:3000/api/working-days?date=2025-04-10T15:00:00.000Z&days=5&hours=4"
```

## 📝 Notas Técnicas

- **TypeScript:** Tipado estricto en toda la aplicación
- **Dependencias principales:** Express, date-fns, date-fns-tz, axios
- **API Externa:** Obtiene días festivos de `https://content.capta.co/Recruitment/WorkingDays.json`
- **Cache:** Los días festivos se cachean por 24 horas
- **Manejo de errores:** Respuestas estructuradas con códigos HTTP apropiados

## 🚀 Despliegue

Para producción:

1. Compilar: `npm run build`
2. Iniciar: `npm start`
3. Configurar variables de entorno si es necesario

La aplicación está lista para ser desplegada en cualquier plataforma que soporte Node.js (Heroku, AWS, DigitalOcean, etc.).
