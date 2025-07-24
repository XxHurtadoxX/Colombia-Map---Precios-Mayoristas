/**
 * Configuración del entorno para el proyecto Colombia Price Map
 */

// Detectar si estamos en desarrollo, producción local o GitHub Pages
const isProduction = import.meta.env.MODE === 'production'
const isDevelopment = import.meta.env.MODE === 'development'
const isGitHubPages = isProduction && window.location.hostname.includes('github.io')

// Base URL para diferentes entornos
export const getBaseUrl = (): string => {
  if (isDevelopment) {
    return ''
  }
  
  if (isGitHubPages) {
    return '/Colombia-Map---Precios-Mayoristas'
  }
  
  return ''
}

// URL para cargar datos del DANE
export const getDaneDataUrl = (): string => {
  const base = getBaseUrl()
  return `${base}/data/dane_sipsa_data.json`
}

// Configuración del entorno
export const ENV_CONFIG = {
  isDevelopment,
  isProduction,
  isGitHubPages,
  baseUrl: getBaseUrl(),
  daneDataUrl: getDaneDataUrl()
}
