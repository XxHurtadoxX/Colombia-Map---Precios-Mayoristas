import { useState } from 'react'
import Header from './components/Header'
import ProductFilter from './components/ProductFilter'
import ColombiaMap from './components/ColombiaMap_new'
import Footer from './components/Footer'
import type { Product, PriceData } from './types'
import './App.css'

function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [priceData, setPriceData] = useState<PriceData[]>([]);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Columna del Filtro */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-8">
              <ProductFilter 
                onProductSelect={setSelectedProduct}
                onPriceDataUpdate={setPriceData}
              />
            </div>
          </div>
          
          {/* Columna del Mapa */}
          <div className="lg:col-span-8 xl:col-span-9">
            <ColombiaMap 
              selectedProduct={selectedProduct}
              priceData={priceData}
            />
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App
