import { useState, useEffect } from 'react'
import type { Product, PriceData } from '../types'
import { daneService } from '../services/daneService'
// ...existing imports above...

interface ProductFilterProps {
  onProductSelect: (product: Product | null) => void
  onPriceDataUpdate: (data: PriceData[]) => void
}

const ProductFilter: React.FC<ProductFilterProps> = ({ 
  onProductSelect, 
  onPriceDataUpdate 
}) => {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<string>('')
  const [searchValue, setSearchValue] = useState<string>('') // Para autocomplete
  const [loading, setLoading] = useState(false)
  const [loadingPrices, setLoadingPrices] = useState(false)
  const [serviceStatus, setServiceStatus] = useState<{ available: boolean; message: string } | null>(null)

  useEffect(() => {
    // Cargar productos
    loadProducts()
    checkServiceStatus()
  }, [])

  const checkServiceStatus = async () => {
    try {
      // El nuevo servicio no tiene getServiceStatus, usar getProducts como verificación
      await daneService.getProducts()
      setServiceStatus({ 
        available: true, 
        message: 'Servicio DANE SIPSA disponible' 
      })
    } catch (error) {
      setServiceStatus({ 
        available: false, 
        message: 'Error verificando estado del servicio' 
      })
    }
  }

  const loadProducts = async () => {
    setLoading(true)
    try {
      console.log('Cargando productos del DANE SIPSA...')
      
      // Usar el método correcto del nuevo servicio
      const productList = await daneService.getProducts()
      
      console.log('Productos cargados:', productList)
      setProducts(productList)
      
    } catch (error) {
      console.error('Error al cargar productos:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleProductSelect = async (productId: string) => {
    setSelectedProduct(productId)
    const product = products.find(p => p.id === productId)
    onProductSelect(product || null)

    if (product) {
      setLoadingPrices(true)
      try {
        console.log(`Cargando precios para producto ${productId}...`)
        // Usar el método correcto del nuevo servicio
        const priceData = await daneService.getPricesByProduct(productId)
        
        console.log(`Precios encontrados: ${priceData.length}`)
        onPriceDataUpdate(priceData)
      } catch (error) {
        console.error('Error loading price data:', error)
        onPriceDataUpdate([])
      } finally {
        setLoadingPrices(false)
      }
    } else {
      onPriceDataUpdate([])
    }
  }

  return (
    <div className="ea-card h-fit">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-white text-center">Precios Mayoristas SIPSA - DANE</h2>
        <p className="text-xs text-gray-400 text-center mt-1">Sistema de Información de Precios y Abastecimiento del Sector Agropecuario</p>
      </div>

      {/* Estado del servicio DANE */}
      {serviceStatus && (
        <div className={`mb-4 p-2 rounded border text-xs ${
          serviceStatus.available 
            ? 'bg-green-900 border-green-700 text-green-300' 
            : 'bg-yellow-900 border-yellow-700 text-yellow-300'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              serviceStatus.available ? 'bg-green-400' : 'bg-yellow-400'
            }`}></div>
            <span>{serviceStatus.message}</span>
          </div>
          {!serviceStatus.available && (
            <p className="mt-1 text-xs">Usando datos de respaldo para demostración</p>
          )}
        </div>
      )}

      <div className="space-y-4">
        <div>
          {loading ? (
            <div className="flex items-center gap-2 p-3 border border-gray-700 rounded-none bg-gray-800">
              <div className="loading-spinner"></div>
              <span className="text-gray-300">Cargando productos del DANE...</span>
            </div>
          ) : (
          <>
            {/* Selector tradicional de productos */}
            <div className="space-y-2">
              <label className="block text-xs text-gray-300">Seleccionar producto:</label>
              <select
                className="ea-select w-full"
                value={selectedProduct}
                onChange={(e) => {
                  const productId = e.target.value
                  setSelectedProduct(productId)
                  if (productId) {
                    handleProductSelect(productId)
                  } else {
                    onProductSelect(null)
                    onPriceDataUpdate([])
                  }
                }}
                disabled={loading}
              >
                <option value="">-- Selecciona un producto --</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Búsqueda alternativa para productos con muchas opciones */}
            {products.length > 10 && (
              <div className="space-y-2">
                <label className="block text-xs text-gray-300">O buscar producto:</label>
                <div className="relative">
                  <input
                    className="ea-select w-full"
                    placeholder="Escribe para buscar..."
                    value={searchValue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const text = e.target.value
                      setSearchValue(text)
                    }}
                    disabled={loading}
                  />
                  {searchValue && (
                    <ul className="absolute z-20 w-full max-h-48 overflow-y-auto rounded shadow-xl mt-1" 
                        style={{
                          background: 'linear-gradient(145deg, #0a0a0a 0%, #1a1a1a 100%)',
                          border: '1px solid #333333',
                          listStyle: 'none',
                          padding: '0',
                          margin: '0'
                        }}>
                      {products
                        .filter(p => p.name.toLowerCase().includes(searchValue.toLowerCase()))
                        .slice(0, 10)
                        .map(p => (
                          <li
                            key={p.id}
                            className="cursor-pointer text-white transition-colors"
                            style={{
                              listStyle: 'none',
                              padding: '0.75rem 1rem',
                              backgroundColor: 'transparent',
                              borderBottom: '1px solid #333333',
                              margin: '0'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#4a4a4a'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent'
                            }}
                            onClick={() => {
                              setSearchValue('')
                              setSelectedProduct(p.id)
                              handleProductSelect(p.id)
                            }}
                          >
                            {p.name}
                          </li>
                        ))}
                      {products.filter(p => p.name.toLowerCase().includes(searchValue.toLowerCase())).length === 0 && (
                        <li className="text-gray-400 italic" style={{
                          listStyle: 'none',
                          padding: '0.75rem 1rem',
                          margin: '0'
                        }}>
                          No se encontraron productos
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </>
          )}
        </div>

        {loadingPrices && (
          <div className="flex items-center gap-2 p-3 bg-gray-800 rounded-none border border-gray-700">
            <div className="loading-spinner"></div>
            <span className="text-gray-300">Consultando SIPSA DANE...</span>
          </div>
        )}

        {selectedProduct && !loadingPrices && (
          <div className="p-3 bg-gray-800 rounded-none border border-gray-700">
            <p className="text-sm text-white">
              <strong>Producto seleccionado:</strong> {products.find(p => p.id === selectedProduct)?.name}
            </p>
            <p className="text-xs text-gray-300 mt-1">
              Precios mayoristas del DANE SIPSA
            </p>
            <p className="text-xs text-gray-300">
              Los precios se visualizan en el mapa por ciudad
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <button 
            onClick={() => handleProductSelect(selectedProduct)}
            disabled={!selectedProduct || loadingPrices}
            className="ea-button flex-1 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {loadingPrices ? 'Consultando DANE...' : 'Actualizar Precios'}
          </button>
          
          {selectedProduct && (
            <button 
              onClick={() => {
                setSelectedProduct('')
                setSearchValue('')
                onProductSelect(null)
                onPriceDataUpdate([])
              }}
              className="px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-none text-sm transition-colors"
              title="Limpiar selección"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductFilter
