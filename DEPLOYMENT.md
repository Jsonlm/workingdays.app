# 🚀 Guía de Despliegue - Múltiples Plataformas

## 🚀 **Recomendación: Railway (Más Fácil)**

### 1. **Subir código a GitHub:**
```bash
git init
git add .
git commit -m "Working Days API - Ready for deployment"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
git push -u origin main
```

### 2. **Configuración en Railway:**
1. Ve a [railway.app](https://railway.app)
2. Haz clic en "Start a New Project"
3. Selecciona "Deploy from GitHub repo"
4. Conecta tu cuenta de GitHub e importa tu repositorio
5. **Railway detecta automáticamente:**
   - ✅ Node.js
   - ✅ Scripts de package.json
   - ✅ Puerto correcto
   - ✅ Variables de entorno

### 3. **Verificar el despliegue:**
Una vez desplegado, deberías poder acceder a:
- `https://tu-app.railway.app/` - Información de la API
- `https://tu-app.railway.app/health` - Health check
- `https://tu-app.railway.app/api/working-days?days=1` - API principal

---

## 🎯 **Alternativa: Fly.io (Muy Confiable)**

### 1. **Instalar Fly CLI:**
```bash
# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex
```

### 2. **Login y deploy:**
```bash
fly auth login
fly launch
fly deploy
```

### 3. **Verificar el despliegue:**
- `https://tu-app.fly.dev/` - Información de la API
- `https://tu-app.fly.dev/health` - Health check
- `https://tu-app.fly.dev/api/working-days?days=1` - API principal

---

## 🎯 **Alternativa: Heroku (Clásico)**

### 1. **Crear app en Heroku:**
```bash
heroku create tu-app-name
git push heroku main
```

### 2. **Verificar el despliegue:**
- `https://tu-app.herokuapp.com/` - Información de la API
- `https://tu-app.herokuapp.com/health` - Health check
- `https://tu-app.herokuapp.com/api/working-days?days=1` - API principal

---

## 🎯 **Despliegue en Render (Si quieres intentar de nuevo)**

### 1. **Subir código a GitHub:**
```bash
git init
git add .
git commit -m "Working Days API - Ready for deployment"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
git push -u origin main
```

### 2. **Configuración en Render:**

1. Ve a [render.com](https://render.com)
2. Haz clic en "New +" y selecciona "Web Service"
3. Conecta tu cuenta de GitHub e importa tu repositorio
4. **Configuración importante:**
   - **Name:** `working-days-api` (o el nombre que prefieras)
   - **Environment:** `Node`
   - **Node Version:** `20.19.4` (especifica la versión exacta)
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `cd src && node ../dist/index.js`
   - **Plan:** `Free`

### 3. **Variables de entorno (opcional):**
Si necesitas configurar variables de entorno en Render:
- `NODE_ENV=production`
- `PORT=10000` (Render usa el puerto 10000 por defecto)

### 4. **Verificar el despliegue:**
Una vez desplegado, deberías poder acceder a:
- `https://tu-app.onrender.com/` - Información de la API
- `https://tu-app.onrender.com/health` - Health check
- `https://tu-app.onrender.com/api/working-days?days=1` - API principal

## 🔧 **Solución de problemas comunes en Render:**

### Error: "Cannot find module '/opt/render/project/src/dist/index.js'"
- **Problema:** Render está buscando el archivo en una ruta incorrecta
- **Solución:** Asegúrate de que:
  - Build Command sea: `npm install && npm run build`
  - Start Command sea: `cd src && node ../dist/index.js`
  - El archivo `render.yaml` esté presente en la raíz del proyecto

### Error: "Build failed"
- Verifica que todas las dependencias estén en `dependencies` (no `devDependencies`)
- Asegúrate de que TypeScript compile sin errores
- Revisa que el comando `npm run build` funcione localmente

### Error: "Module not found"
- Verifica que el build fue exitoso
- Asegúrate de que `dist/index.js` existe
- Revisa los logs de build en Render

## 🎯 **Despliegue en Vercel (Alternativa)**

### Configuración en Vercel:
1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en "New Project"
3. Importa tu repositorio de GitHub
4. **Configuración importante:**
   - **Framework Preset:** Other
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

## 📊 **Comparación de Plataformas:**

| Plataforma | Facilidad | Confiabilidad | Plan Gratuito | Recomendación |
|------------|-----------|---------------|---------------|---------------|
| **Railway** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Generoso | ✅ **Recomendado** |
| **Fly.io** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 3 apps gratis | ✅ Muy bueno |
| **Heroku** | ⭐⭐⭐ | ⭐⭐⭐⭐ | Limitado (duerme) | ✅ Clásico |
| **Render** | ⭐⭐⭐ | ⭐⭐⭐ | Generoso | ⚠️ Problemas de path |
| **Vercel** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Generoso | ✅ Solo para frontend |

## 📝 **Archivos importantes para el despliegue:**

### Para Railway:
- ✅ `package.json` - Dependencias y scripts
- ✅ `railway.json` - Configuración de Railway (opcional)
- ✅ `dist/index.js` - Archivo compilado
- ✅ `src/` - Código fuente TypeScript

### Para Fly.io:
- ✅ `package.json` - Dependencias y scripts
- ✅ `fly.toml` - Configuración de Fly.io
- ✅ `dist/index.js` - Archivo compilado
- ✅ `src/` - Código fuente TypeScript

### Para Heroku:
- ✅ `package.json` - Dependencias y scripts
- ✅ `Procfile` - Configuración de Heroku
- ✅ `dist/index.js` - Archivo compilado
- ✅ `src/` - Código fuente TypeScript

### Para Render:
- ✅ `package.json` - Dependencias y scripts
- ✅ `render.yaml` - Configuración de Render
- ✅ `dist/index.js` - Archivo compilado
- ✅ `src/` - Código fuente TypeScript

### Para Vercel:
- ✅ `package.json` - Dependencias y scripts
- ✅ `vercel.json` - Configuración de Vercel
- ✅ `dist/index.js` - Archivo compilado
- ✅ `src/` - Código fuente TypeScript

## 🧪 **Probar el despliegue:**

Una vez desplegado, puedes usar:

### Para Railway:
```bash
# Con PowerShell
.\test-production.ps1 -VercelUrl "https://tu-app.railway.app"

# Con curl
curl https://tu-app.railway.app/health
curl "https://tu-app.railway.app/api/working-days?days=1"
```

### Para Fly.io:
```bash
# Con PowerShell
.\test-production.ps1 -VercelUrl "https://tu-app.fly.dev"

# Con curl
curl https://tu-app.fly.dev/health
curl "https://tu-app.fly.dev/api/working-days?days=1"
```

### Para Heroku:
```bash
# Con PowerShell
.\test-production.ps1 -VercelUrl "https://tu-app.herokuapp.com"

# Con curl
curl https://tu-app.herokuapp.com/health
curl "https://tu-app.herokuapp.com/api/working-days?days=1"
```

### Para Render:
```bash
# Con PowerShell
.\test-production.ps1 -VercelUrl "https://tu-app.onrender.com"

# Con curl
curl https://tu-app.onrender.com/health
curl "https://tu-app.onrender.com/api/working-days?days=1"
```

### Para Vercel:
```bash
# Con PowerShell
.\test-production.ps1 -VercelUrl "https://tu-app.vercel.app"

# Con curl
curl https://tu-app.vercel.app/health
curl "https://tu-app.vercel.app/api/working-days?days=1"
```
