import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="ea-gradient-bg border-t border-gray-800 mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Derechos reservados a la izquierda */}
          <div className="text-sm">
            <p className="text-white font-medium">EA Tech Company</p>
            <p className="text-gray-400">© 2025 Todos los derechos reservados</p>
          </div>
          
          {/* Información del desarrollador a la derecha */}
          <div className="text-center md:text-right">
            <p className="text-gray-300 text-sm">
              Desarrollado por <span className="text-white font-medium">Daniel Hurtado</span>
            </p>
            <p className="text-gray-400 text-xs">
              Analista Económico y Desarrollador
            </p>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-800 text-center">
          {/* Fuente de datos */}
          <h4 className="text-white font-medium text-sm mb-2">Fuente de Datos</h4>
          <p className="text-gray-400 text-xs">
            DANE - Sistema de Información de Precios y Abastecimiento del Sector Agropecuario (SIPSA)
          </p>
          
          <div className="mt-4 pt-4 border-t border-gray-700 text-center">
            <p className="text-gray-500 text-xs">
              Esta herramienta procesa y visualiza datos oficiales del DANE para facilitar el análisis de precios mayoristas en Colombia
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
