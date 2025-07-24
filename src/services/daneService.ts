import type { Product, PriceData } from '../types'
import { DANE_CONFIG } from '../config/daneConfig'
import { getDaneDataUrl } from '../config/environment'

/**
 * Servicio para consumir los datos del DANE SIPSA
 * Utiliza exclusivamente datos del archivo JSON generado por el script Python
 */
class DaneService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private readonly CACHE_DURATION = DANE_CONFIG.CACHE_DURATION

  /**
   * Verifica si los datos en caché son válidos
   */
  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key)
    if (!cached) return false
    return Date.now() - cached.timestamp < this.CACHE_DURATION
  }

  /**
   * Obtiene datos del caché o null si no existen o han expirado
   */
  private getCachedData<T>(key: string): T | null {
    if (this.isCacheValid(key)) {
      return this.cache.get(key)?.data || null
    }
    return null
  }

  /**
   * Almacena datos en caché
   */
  private setCacheData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  /**
   * Carga los datos del archivo JSON del DANE SIPSA
   */
  private async loadDaneData(): Promise<any> {
    const dataUrl = getDaneDataUrl()
    console.log(`Cargando datos del DANE desde: ${dataUrl}`)
    
    const response = await fetch(dataUrl)
    if (!response.ok) {
      throw new Error(`Error cargando datos del DANE: ${response.status}`)
    }
    return response.json()
  }

  /**
   * Obtiene todos los productos disponibles del DANE SIPSA
   */
  async getProducts(): Promise<Product[]> {
    const cacheKey = 'products_dane_real'
    const cachedData = this.getCachedData<Product[]>(cacheKey)
    if (cachedData) return cachedData

    try {
      console.log('Cargando productos del DANE SIPSA desde archivo JSON...')
      
      const data = await this.loadDaneData()
      const products = data.productos || []
      
      console.log(`✅ Productos del DANE cargados: ${products.length}`)
      console.log(`📊 Datos del DANE SIPSA disponibles (${data.metadatos?.registrosEnVentana || 'N/A'} registros en ventana de ${data.metadatos?.ventanaDias || 90} días)`)
      
      // Guardar en caché
      this.setCacheData(cacheKey, products)
      
      return products
    } catch (error) {
      console.error('Error cargando productos del DANE:', error)
      throw new Error('No se pudieron cargar los productos del DANE SIPSA')
    }
  }

  /**
   * Obtiene precios por producto del DANE SIPSA
   */
  async getPricesByProduct(productId: string): Promise<PriceData[]> {
    const cacheKey = `prices_${productId}`
    const cachedData = this.getCachedData<PriceData[]>(cacheKey)
    if (cachedData) return cachedData

    try {
      console.log(`Consultando precios del producto ${productId}...`)
      
      const data = await this.loadDaneData()
      const ciudades = data.ciudades || []
      
      const priceData: PriceData[] = []
      
      // Buscar el producto en todas las ciudades
      ciudades.forEach((ciudad: any) => {
        const producto = ciudad.productos?.find((p: any) => String(p.codigo) === productId)
        if (producto) {
          const cityData = {
            productId: String(producto.codigo),
            productName: producto.nombre,
            department: '', // No disponible en el JSON actual
            city: ciudad.ciudad,
            market: 'Mayorista',
            price: parseFloat(producto.precio) || 0,
            unit: producto.unidad || 'kg',
            date: producto.fechaCaptura || '',
            latitude: ciudad.lat,
            longitude: ciudad.lng
          }
          
          // Debug: Verificar coordenadas específicas para ciudades problemáticas
          if (['POPAYÁN', 'MONTERÍA', 'VALLEDUPAR'].includes(ciudad.ciudad)) {
            console.log(`🗺️ DEBUG ${ciudad.ciudad}: lat=${ciudad.lat}, lng=${ciudad.lng}`)
          }
          
          priceData.push(cityData)
        }
      })
      
      this.setCacheData(cacheKey, priceData)
      console.log(`Precios obtenidos para producto ${productId}: ${priceData.length} ciudades`)
      return priceData
      
    } catch (error) {
      console.error('Error obteniendo precios:', error)
      return []
    }
  }

  /**
   * Obtiene todos los precios disponibles
   */
  async getAllPrices(): Promise<PriceData[]> {
    const cacheKey = 'all_prices'
    
    // Verificar caché
    const cachedData = this.getCachedData<PriceData[]>(cacheKey)
    if (cachedData) {
      return cachedData
    }

    try {
      console.log('Obteniendo todos los precios del DANE SIPSA desde JSON...')
      
      const data = await this.loadDaneData()
      const ciudades = data.ciudades || []
      
      const allPrices: PriceData[] = []
      
      // Procesar todas las ciudades y productos
      ciudades.forEach((ciudad: any) => {
        if (ciudad.productos) {
          ciudad.productos.forEach((producto: any) => {
            const priceItem = {
              productId: String(producto.codigo),
              productName: producto.nombre,
              department: '', // No disponible en el JSON actual
              city: ciudad.ciudad,
              market: 'Mayorista',
              price: parseFloat(producto.precio) || 0,
              unit: producto.unidad || 'kg',
              date: producto.fechaCaptura || '',
              latitude: ciudad.lat,
              longitude: ciudad.lng
            }
            
            allPrices.push(priceItem)
          })
        }
      })
      
      // Guardar en caché
      this.setCacheData(cacheKey, allPrices)
      console.log(`Total de precios obtenidos del JSON: ${allPrices.length}`)
      
      return allPrices
    } catch (error) {
      console.error('Error obteniendo todos los precios:', error)
      return []
    }
  }

  /**
   * Obtiene información de departamentos (funcionalidad básica)
   */
  async getDepartments(): Promise<any[]> {
    try {
      const data = await this.loadDaneData()
      const ciudades = data.ciudades || []
      
      // Extraer departamentos únicos (aunque no están en el JSON actual)
      const departments = ciudades.map((ciudad: any) => ({
        name: ciudad.ciudad,
        code: ciudad.ciudad,
        latitude: ciudad.lat,
        longitude: ciudad.lng
      }))
      
      return departments
    } catch (error) {
      console.error('Error obteniendo departamentos:', error)
      return []
    }
  }
}

// Exportar una instancia única del servicio
export const daneService = new DaneService()
export default daneService
