import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import type { Product, PriceData } from '../types'
import 'leaflet/dist/leaflet.css'

interface ColombiaMapProps {
  selectedProduct: Product | null
  priceData: PriceData[]
}

// Coordenadas del centro de Colombia
const COLOMBIA_CENTER: [number, number] = [4.7110, -74.0721]
const ZOOM_LEVEL = 6

// Componente para ajustar la vista del mapa
const MapUpdater: React.FC<{ priceData: PriceData[] }> = ({ priceData }) => {
  const map = useMap()

  useEffect(() => {
    if (priceData.length > 0) {
      // Calcular bounds para mostrar todos los puntos
      const group = new (window as any).L.featureGroup(
        priceData
          .filter(data => data.latitude && data.longitude)
          .map(data => (window as any).L.marker([data.latitude!, data.longitude!]))
      )
      
      if (group.getLayers().length > 0) {
        map.fitBounds(group.getBounds(), { padding: [20, 20] })
      }
    }
  }, [priceData, map])

  return null
}

const ColombiaMap: React.FC<ColombiaMapProps> = ({ selectedProduct, priceData }) => {
  const mapRef = useRef<any>(null)

  // Función para determinar el color basado en el precio
  const getColorByPrice = (price: number, minPrice: number, maxPrice: number) => {
    const ratio = (price - minPrice) / (maxPrice - minPrice)
    if (ratio < 0.33) return '#22c55e' // Verde - precio bajo
    if (ratio < 0.66) return '#eab308' // Amarillo - precio medio
    return '#ef4444' // Rojo - precio alto
  }

  // Calcular min y max de precios para el gradiente de colores
  const prices = priceData.map(data => data.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)

  // Debug: Log de coordenadas para verificar ubicaciones
  useEffect(() => {
    if (priceData.length > 0) {
      console.log('🗺️ Datos de coordenadas en el mapa:')
      priceData.forEach(data => {
        console.log(`   ${data.city}: lat=${data.latitude}, lng=${data.longitude}`)
      })
    }
  }, [priceData])

  return (
    <div className="ea-card h-[600px] lg:h-full">
      <div className="relative w-full h-[500px] lg:h-[calc(100%-50px)] rounded-lg overflow-hidden border border-gray-700">
        <MapContainer
          center={COLOMBIA_CENTER}
          zoom={ZOOM_LEVEL}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          
          <MapUpdater priceData={priceData} />

          {priceData
            .filter(data => data.latitude && data.longitude)
            .map((data, index) => (
              <CircleMarker
                key={`${data.department}-${index}`}
                center={[data.latitude!, data.longitude!]}
                radius={8}
                pathOptions={{
                  fillColor: getColorByPrice(data.price, minPrice, maxPrice),
                  color: '#ffffff',
                  weight: 2,
                  opacity: 1,
                  fillOpacity: 0.8
                }}
                className="ea-map-marker"
              >
                <Popup>
                  <div className="p-2 bg-white text-gray-900 rounded border border-gray-200">
                    <div className="space-y-1">
                      <div><strong>Producto:</strong> {data.productName}</div>
                      <div><strong>Ciudad:</strong> {data.city}</div>
                      <div><strong>Mercado:</strong> {data.market}</div>
                      <div className="flex items-center gap-2">
                        <strong>Precio:</strong>
                        <span className="bg-gray-900 text-white px-2 py-1 rounded text-sm font-medium">
                          ${data.price.toLocaleString()} / {data.unit}
                        </span>
                      </div>
                      <div><strong>Fecha:</strong> {data.date}</div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
        </MapContainer>

        {!selectedProduct && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-95 rounded-lg">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-gray-600">
                Selecciona un producto para ver los precios en el mapa
              </p>
            </div>
          </div>
        )}

        {selectedProduct && priceData.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-95 rounded-lg">
            <div className="text-center">
              <p className="text-gray-600">
                No se encontraron datos de precios para este producto
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ColombiaMap
