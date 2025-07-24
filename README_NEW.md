# 🇨🇴 Colombia Price Map - DANE SIPSA

<div align="center">
  <img src="public/colombia-map-icon.svg" alt="Colombia Price Map" width="100" height="100">
  
  Una aplicación web interactiva que visualiza precios mayoristas de productos agrícolas en Colombia usando datos oficiales del DANE SIPSA.
  
  [![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-7.0-green.svg)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-blue.svg)](https://tailwindcss.com/)
</div>

## 🚀 Características Principales

- 🗺️ **Mapa interactivo** de 20 ciudades principales de Colombia
- 📊 **33 productos agrícolas** con precios mayoristas actualizados
- 🔄 **Datos del DANE SIPSA** procesados con ETL avanzado
- 🎯 **Filtros inteligentes** por producto con búsqueda
- 📱 **Diseño responsivo** optimizado para móviles
- ⚡ **Estrategia avanzada de datos** - fecha más reciente por ciudad/producto
- 🎨 **Interfaz moderna** con FluentUI y Tailwind CSS

## 📈 Datos y Cobertura

- **Fuente**: DANE - Sistema de Información de Precios y Abastecimiento del Sector Agropecuario (SIPSA)
- **Cobertura**: 20 ciudades principales de Colombia
- **Productos**: 33 productos agrícolas (frutas, verduras, tubérculos, hortalizas)
- **Actualización**: Datos de los últimos 3 meses, filtrados por fecha más reciente
- **Volumen**: 516 registros únicos procesados de 302,815 registros totales

## 🛠️ Tecnologías

### Frontend
- **React 18** - Biblioteca de interfaz de usuario con hooks
- **TypeScript 5.8** - Lenguaje con tipado estático
- **Vite 7.0** - Herramienta de desarrollo ultra-rápida
- **Tailwind CSS** - Framework de CSS utilitario
- **FluentUI** - Componentes de interfaz de Microsoft
- **Leaflet & React-Leaflet** - Mapas interactivos
- **Axios** - Cliente HTTP para APIs

### Backend/Datos
- **Python 3.13** - Procesamiento de datos ETL
- **JSON estático** - Datos pre-procesados optimizados
- **Unicode handling** - Manejo correcto de caracteres especiales
- **Estrategia de filtrado avanzada** - Optimización de datos

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js (v18 o superior)
- Python 3.13 (opcional, para generar datos)

### 1. Clonar el repositorio
```bash
git clone https://github.com/ea-tech-company/colombia-price-map.git
cd colombia-price-map
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar la aplicación
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5174`

### 4. Generar datos actualizados (opcional)
```bash
python scripts/generate_dane_data.py
```

## 📊 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Vista previa de la construcción
- `npm run lint` - Ejecutar ESLint

## 📁 Estructura del Proyecto

```
├── public/
│   └── data/
│       └── dane_sipsa_data.json    # Datos procesados del DANE
├── scripts/
│   └── generate_dane_data.py       # ETL para datos DANE
├── src/
│   ├── components/                 # Componentes React
│   │   ├── Header.tsx             # Encabezado de la aplicación
│   │   ├── ProductFilter.tsx      # Filtro de productos
│   │   ├── ColombiaMap_new.tsx    # Mapa interactivo
│   │   └── Footer.tsx             # Pie de página
│   ├── services/                  # Servicios de API
│   │   └── daneService.ts         # Servicio JSON optimizado
│   ├── config/                    # Configuraciones
│   │   └── daneConfig.ts          # Configuración DANE
│   ├── types/                     # Tipos TypeScript
│   │   └── index.ts               # Interfaces principales
│   └── assets/                    # Recursos estáticos
```

## 🎯 Uso de la Aplicación

1. **Seleccionar Producto**: Usa el filtro lateral para seleccionar un producto de la lista
2. **Consultar Precios**: Haz clic en "Consultar Precios" para cargar los datos
3. **Explorar el Mapa**: Los puntos en el mapa representan diferentes ciudades:
   - 🟢 Verde: Precios bajos
   - 🟡 Amarillo: Precios medios  
   - 🔴 Rojo: Precios altos
4. **Ver Detalles**: Haz clic en cualquier punto del mapa para ver información detallada

## 🔧 Características Técnicas

### Procesamiento de Datos
- **ETL avanzado**: Filtrado de 302K+ registros a 516 únicos
- **Unicode normalization**: Manejo correcto de BOGOTÁ, MEDELLÍN, etc.
- **Ventana temporal**: Últimos 3 meses de datos
- **Estrategia latest-per-city**: Precio más reciente por ciudad/producto

### Optimizaciones
- **JSON estático**: Sin latencia de API en producción
- **Código limpio**: Eliminación de fallbacks y código redundante
- **Carga rápida**: Datos pre-procesados optimizados
- **Coordenadas precisas**: Ubicaciones geográficas verificadas

## 🌍 Ciudades Cubiertas

**20 Ciudades Principales**:
Bogotá, Medellín, Cali, Barranquilla, Cartagena, Bucaramanga, Pereira, Ibagué, Santa Marta, Manizales, Villavicencio, Neiva, Pasto, Armenia, Montería, Sincelejo, Popayán, Valledupar, Riohacha, Quibdó.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu característica (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto utiliza datos oficiales del **DANE Colombia** (Departamento Administrativo Nacional de Estadística) a través del Sistema SIPSA.

---

**Desarrollado con ❤️ para Colombia 🇨🇴**
