# 🚀 Guía de Despliegue en Vercel

## Pasos para desplegar correctamente:

### 1. **Subir código a GitHub:**
```bash
git init
git add .
git commit -m "Working Days API - Ready for deployment"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
git push -u origin main
```

### 2. **Configuración en Vercel:**

1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en "New Project"
3. Importa tu repositorio de GitHub
4. **Configuración importante:**
   - **Framework Preset:** Other
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

### 3. **Variables de entorno (opcional):**
Si necesitas configurar variables de entorno en Vercel:
- `NODE_ENV=production`
- `PORT=3000` (Vercel lo maneja automáticamente)

### 4. **Verificar el despliegue:**
Una vez desplegado, deberías poder acceder a:
- `https://tu-app.vercel.app/` - Información de la API
- `https://tu-app.vercel.app/health` - Health check
- `https://tu-app.vercel.app/api/working-days?days=1` - API principal

## 🔧 **Solución de problemas comunes:**

### Error: "NOT_FOUND"
- Verifica que el build fue exitoso
- Asegúrate de que `dist/index.js` existe
- Revisa los logs de build en Vercel

### Error: "Build failed"
- Verifica que todas las dependencias estén en `dependencies` (no `devDependencies`)
- Asegúrate de que TypeScript compile sin errores
- Revisa que el comando `npm run build` funcione localmente

### Error: "Function not found"
- Verifica que `vercel.json` esté configurado correctamente
- Asegúrate de que `dist/index.js` sea el punto de entrada

## 📝 **Archivos importantes para el despliegue:**

- ✅ `package.json` - Dependencias y scripts
- ✅ `vercel.json` - Configuración de Vercel
- ✅ `dist/index.js` - Archivo compilado
- ✅ `src/` - Código fuente TypeScript

## 🧪 **Probar el despliegue:**

Una vez desplegado, puedes usar:
```bash
# Con PowerShell
.\test-production.ps1 -VercelUrl "https://tu-app.vercel.app"

# Con curl
curl https://tu-app.vercel.app/health
curl "https://tu-app.vercel.app/api/working-days?days=1"
```
