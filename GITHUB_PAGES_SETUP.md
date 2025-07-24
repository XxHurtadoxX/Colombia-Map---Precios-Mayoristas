# Desplegar Colombia Price Map en GitHub Pages

Este documento explica cómo configurar y desplegar el proyecto Colombia Price Map en GitHub Pages.

## Configuración automática realizada

### 1. Configuración de Vite (`vite.config.ts`)
- Se agregó `base: '/Colombia-Map---Precios-Mayoristas/'` para asegurar que las rutas funcionen correctamente en GitHub Pages.

### 2. Package.json actualizado
- Se agregó el script `deploy` para despliegue manual con gh-pages
- Se agregó `gh-pages` como dependencia de desarrollo
- Se actualizó la URL del repositorio y homepage

### 3. GitHub Actions Workflow
- Se creó `.github/workflows/deploy.yml` para despliegue automático
- Se configura para ejecutarse en cada push a la rama main
- Utiliza Node.js 20 y las GitHub Actions más recientes

### 4. Archivo .nojekyll
- Se agregó `public/.nojekyll` para evitar que GitHub trate el sitio como Jekyll

## Pasos para activar GitHub Pages

### Opción 1: Despliegue automático con GitHub Actions (Recomendado)

1. **Hacer push de los cambios al repositorio:**
   ```bash
   git add .
   git commit -m "Configurar GitHub Pages con Actions"
   git push origin main
   ```

2. **Configurar GitHub Pages en el repositorio:**
   - Ve a tu repositorio en GitHub: `https://github.com/XxHurtadoxX/Colombia-Map---Precios-Mayoristas`
   - Ve a Settings → Pages
   - En "Source", selecciona "GitHub Actions"
   - ¡Listo! El sitio se desplegará automáticamente en cada push

### Opción 2: Despliegue manual

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Compilar y desplegar:**
   ```bash
   npm run deploy
   ```

## URL del sitio

Una vez configurado, tu sitio estará disponible en:
**https://xxhurtadoxx.github.io/Colombia-Map---Precios-Mayoristas/**

## Notas importantes

- El primer despliegue puede tardar unos minutos en aparecer
- Los cambios se propagan automáticamente cuando haces push a main
- Los datos del DANE se cargan desde el archivo JSON incluido en el proyecto
- El sitio es completamente estático y funciona sin servidor backend

## Troubleshooting

### Si el sitio no carga correctamente:
1. Verifica que GitHub Pages esté habilitado en Settings → Pages
2. Revisa el log de GitHub Actions para errores de compilación
3. Asegúrate de que la rama main tenga los archivos más recientes

### Si las rutas no funcionan:
- Verifica que `vite.config.ts` tenga el `base` correcto
- Comprueba que todas las rutas en el código sean relativas
