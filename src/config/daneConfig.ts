/**
 * Configuración para el servicio DANE SIPSA
 * Centraliza todas las URLs y configuraciones relacionadas con el DANE
 */
// URL base del servicio SIPSA del DANE
// Ruta base relativa para proxy en Vite (/sipsaWS -> https://appweb.dane.gov.co/sipsaWS)
export const DANE_SIPSA_BASE = '/sipsaWS'
// Endpoint para servicio UPRA (SOAP) de promedios por ciudad, relativo para proxy
export const DANE_UPRA_ENDPOINT = `${DANE_SIPSA_BASE}/SrvSipsaUpraBeanService`
// WSDL completo para operaciones SOAP (añadir ?wsdl)
export const DANE_UPRA_WSDL = `${DANE_UPRA_ENDPOINT}?wsdl`

// Configuración de endpoints del DANE SIPSA
export const DANE_ENDPOINTS = {
  // Servicios SIPSA Rural
  rural: {
    productos: `${DANE_SIPSA_BASE}/SipsaRural.asmx/ConsultarProductos`,
    precios: `${DANE_SIPSA_BASE}/SipsaRural.asmx/ConsultarPrecios`,
    departamentos: `${DANE_SIPSA_BASE}/SipsaRural.asmx/ConsultarDepartamentos`,
    mercados: `${DANE_SIPSA_BASE}/SipsaRural.asmx/ConsultarMercados`,
    municipios: `${DANE_SIPSA_BASE}/SipsaRural.asmx/ConsultarMunicipios`
  },
  
  // Servicios SIPSA Minorista
  minorista: {
    productos: `${DANE_SIPSA_BASE}/SipsaMinorista.asmx/ConsultarProductos`,
    precios: `${DANE_SIPSA_BASE}/SipsaMinorista.asmx/ConsultarPrecios`,
    departamentos: `${DANE_SIPSA_BASE}/SipsaMinorista.asmx/ConsultarDepartamentos`,
    mercados: `${DANE_SIPSA_BASE}/SipsaMinorista.asmx/ConsultarMercados`,
    municipios: `${DANE_SIPSA_BASE}/SipsaMinorista.asmx/ConsultarMunicipios`
  },

  // Servicios SIPSA Mayorista
  mayorista: {
    productos: `${DANE_SIPSA_BASE}/SipsaMayorista.asmx/ConsultarProductos`,
    precios: `${DANE_SIPSA_BASE}/SipsaMayorista.asmx/ConsultarPrecios`,
    departamentos: `${DANE_SIPSA_BASE}/SipsaMayorista.asmx/ConsultarDepartamentos`,
    mercados: `${DANE_SIPSA_BASE}/SipsaMayorista.asmx/ConsultarMercados`
  }
}

// (El endpoint Pentaho ya no se usa)

// Configuración de la aplicación
export const DANE_CONFIG = {
  // Tiempo de caché en milisegundos (15 minutos)
  CACHE_DURATION: 15 * 60 * 1000,
  
  // Timeout para las requests en milisegundos (10 segundos)
  REQUEST_TIMEOUT: 10000,
  
  // Número máximo de reintentos
  MAX_RETRY_ATTEMPTS: 3,
  
  // Delay entre reintentos en milisegundos
  RETRY_DELAY: 1000,
  
  // Máximo número de productos a consultar en getAllPrices
  MAX_PRODUCTS_BATCH: 5,
  
  // Headers por defecto para las requests
  DEFAULT_HEADERS: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json, application/xml, text/xml, */*'
  }
}

// Tipos de mercado disponibles en SIPSA
export const MARKET_TYPES = {
  RURAL: 'rural',
  MINORISTA: 'minorista',
  MAYORISTA: 'mayorista'
} as const

export type MarketType = typeof MARKET_TYPES[keyof typeof MARKET_TYPES]

// Categorías de productos comunes en SIPSA
export const PRODUCT_CATEGORIES = {
  CEREALES: 'Cereales',
  LEGUMINOSAS: 'Leguminosas',
  TUBERCULOS: 'Tubérculos',
  FRUTAS: 'Frutas',
  HORTALIZAS: 'Hortalizas',
  LACTEOS: 'Lácteos',
  CARNES: 'Carnes',
  ACEITES: 'Aceites y Grasas',
  AZUCARES: 'Azúcares',
  OTROS: 'Otros'
} as const

// Unidades de medida comunes
export const UNITS = {
  KG: 'kg',
  LITRO: 'litro',
  UNIDAD: 'unidad',
  LIBRA: 'libra',
  ARROBA: 'arroba',
  BULTO: 'bulto'
} as const

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conectividad con el servicio DANE SIPSA',
  CORS_ERROR: 'Error de CORS. Usando datos de respaldo.',
  PARSE_ERROR: 'Error al procesar la respuesta del servidor',
  NO_DATA: 'No se encontraron datos para la consulta',
  TIMEOUT: 'Tiempo de espera agotado al consultar DANE SIPSA',
  SERVICE_UNAVAILABLE: 'Servicio DANE SIPSA no disponible temporalmente'
} as const
