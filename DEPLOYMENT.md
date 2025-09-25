# 🚀 Guía de Despliegue en Vercel y Render

## 🎯 Despliegue en Render

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
   - **Start Command:** `npm start`
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
  - Start Command sea: `npm start`
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

## 📝 **Archivos importantes para el despliegue:**

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
