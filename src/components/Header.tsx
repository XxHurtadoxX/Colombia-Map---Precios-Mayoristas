import React from 'react'

const Header: React.FC = () => {
  return (
    <>
    {/* Header con estructura similar al ejemplo MUI usando Tailwind */}
    <header className="bg-black shadow-sm">
        <div className="flex justify-center items-center min-h-[64px] px-4">
            <div className="flex items-center">
                {/* Logo con tamaño fijo similar al ejemplo */}
                <img 
                src="https://i.imgur.com/Q57HCQU_d.png?maxwidth=75&shape=thumb&fidelity=high" 
                alt="Logo" 
                className="h-auto w-auto mr-2 brightness-0 invert" 
                />
                
                {/* Título/Nombre de la empresa */}
                <h1 className="text-white text-xl font-medium hover:no-underline cursor-pointer">
                Colombia Price Map - EA Tech Company
                </h1>
            </div>
        </div>
    </header>
      
      {/* Título principal */}
      <div className="ea-gradient-bg border-b border-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
            Precios Mayoristas DANE SIPSA
          </h1>
          <p className="text-lg text-gray-300 text-center mt-2">
            Datos oficiales de 33 productos agrícolas en 20 ciudades principales
          </p>
          <p className="text-sm text-gray-400 text-center mt-1">
            Información actualizada del Sistema de Información de Precios y Abastecimiento del Sector Agropecuario
          </p>
        </div>
      </div>
    </>
  )
}

export default Header
