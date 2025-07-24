#!/usr/bin/env python3
"""
Script para generar datos JSON del DANE SIPSA para consumo de la aplicación React
Utiliza el cliente Python existente para obtener datos actualizados via SOAP
"""

import sys
import os
import json
import subprocess
from datetime import datetime, timedelta

def obtener_promedios_sipsa_ciudad():
    """Carga datos del DANE SIPSA desde el JSON estático generado previamente"""
    # Usar el archivo JSON estático para cargar los datos y evitar problemas de ETL
    json_path = os.path.join(os.path.dirname(__file__), '..', 'cliente-webservice-sipsa-main', 'data', 'promediosSipsaCiudad.json')
    if os.path.exists(json_path):
        with open(json_path, 'r', encoding='utf-8') as f:
            try:
                return json.load(f)
            except Exception as e:
                print(f"Error leyendo JSON estático: {e}")
                return []
    print(f"Archivo estático no encontrado: {json_path}")
    return []

def generar_coordenadas_ciudades():
    """Genera el mapeo de coordenadas para las ciudades colombianas"""
    return {
        'BOGOTÁ': {'lat': 4.7110, 'lng': -74.0721},
        'MEDELLÍN': {'lat': 6.2442, 'lng': -75.5812},
        'CALI': {'lat': 3.4516, 'lng': -76.5320},
        'BARRANQUILLA': {'lat': 10.9685, 'lng': -74.7813},
        'CARTAGENA': {'lat': 10.3910, 'lng': -75.4794},
        'CÚCUTA': {'lat': 7.8939, 'lng': -72.5078},
        'SAN JOSÉ DE CÚCUTA': {'lat': 7.8939, 'lng': -72.5078},  # Alias para Cúcuta
        'CARTAGENA DE INDIAS': {'lat': 10.3910, 'lng': -75.4794},  # Alias para Cartagena
        'BUCARAMANGA': {'lat': 7.1193, 'lng': -73.1227},
        'PEREIRA': {'lat': 4.8087, 'lng': -75.6906},
        'SANTA MARTA': {'lat': 11.2408, 'lng': -74.2120},
        'IBAGUÉ': {'lat': 4.4389, 'lng': -75.2322},
        'PASTO': {'lat': 1.2136, 'lng': -77.2811},
        'MANIZALES': {'lat': 5.0703, 'lng': -75.5138},
        'NEIVA': {'lat': 2.9273, 'lng': -75.2819},
        'VILLAVICENCIO': {'lat': 4.1420, 'lng': -73.6266},
        'ARMENIA': {'lat': 4.5339, 'lng': -75.6811},
        'VALLEDUPAR': {'lat': 10.4631, 'lng': -73.2532},
        'MONTERÍA': {'lat': 8.7479, 'lng': -75.8814},
        'SINCELEJO': {'lat': 9.3047, 'lng': -75.3978},
        'FLORENCIA': {'lat': 1.6144, 'lng': -75.6062},
        'POPAYÁN': {'lat': 2.4448, 'lng': -76.6147},
        'TUNJA': {'lat': 5.5353, 'lng': -73.3678},
        'QUIBDÓ': {'lat': 5.6947, 'lng': -76.6582},
        'ARAUCA': {'lat': 7.0906, 'lng': -70.7574},
        'YOPAL': {'lat': 5.3478, 'lng': -72.3959},
        'RIOHACHA': {'lat': 11.5444, 'lng': -72.9072},
        'INÍRIDA': {'lat': 3.8653, 'lng': -67.9239},
        'SAN JOSÉ DEL GUAVIARE': {'lat': 2.5649, 'lng': -72.6459},
        'MITÚ': {'lat': 1.2518, 'lng': -70.2340},
        'PUERTO CARREÑO': {'lat': 6.1889, 'lng': -67.4862},
        'LETICIA': {'lat': -4.2151, 'lng': -69.9406},
        'SAN ANDRÉS': {'lat': 12.5848, 'lng': -81.7006}
    }

def normalizar_ciudad_dane(nombre_ciudad):
    """
    Normaliza nombres de ciudades del DANE que vienen con codificación Unicode escape
    """
    if not nombre_ciudad:
        return ''
    
    try:
        # Decodificar unicode escape sequences como \u00cdN -> Í
        if '\\u' in nombre_ciudad:
            nombre_decodificado = nombre_ciudad.encode().decode('unicode_escape')
        else:
            nombre_decodificado = nombre_ciudad
        
        # Quitar sufijos tras coma y normalizar
        nombre_limpio = nombre_decodificado.split(',')[0].strip().upper()
        return nombre_limpio
    except Exception as e:
        print(f"⚠️ Error normalizando ciudad '{nombre_ciudad}': {e}")
        return nombre_ciudad.upper()

def procesar_datos_para_react(datos_sipsa):
    """
    Procesa los datos del DANE SIPSA para el formato esperado por React
    Nueva estrategia: Extraer 3 meses de datos, luego por cada ciudad/producto tomar la fecha más reciente
    """
    from datetime import datetime, timedelta
    from collections import defaultdict
    
    coordenadas = generar_coordenadas_ciudades()
    
    # Filtrar datos por fecha: últimos 90 días (3 meses) para mayor cobertura
    fecha_limite = datetime.now() - timedelta(days=90)
    print(f"🗓️  Extrayendo datos desde: {fecha_limite.strftime('%Y-%m-%d')} (últimos 3 meses)")
    
    datos_en_ventana = []
    datos_fuera_ventana = 0
    
    # Primero: filtrar por ventana de 3 meses
    for item in datos_sipsa:
        try:
            # Usar clave correcta para fecha de captura
            fecha_str = item.get('FechaCaptura', item.get('fechaCaptura', ''))
            if fecha_str:
                # Intentar varios formatos de fecha
                for formato in ['%Y-%m-%d %H:%M:%S%z', '%Y-%m-%d %H:%M:%S', '%Y-%m-%d']:
                    try:
                        fecha_captura = datetime.strptime(fecha_str.split('.')[0].replace('-05:00', ''), formato.replace('%z', ''))
                        break
                    except ValueError:
                        continue
                else:
                    fecha_captura = datetime.now()
                
                # Incluir si está en la ventana de 3 meses
                if fecha_captura >= fecha_limite:
                    item['fecha_procesada'] = fecha_captura
                    datos_en_ventana.append(item)
                else:
                    datos_fuera_ventana += 1
            else:
                # Si no tiene fecha, asumir fecha actual
                item['fecha_procesada'] = datetime.now()
                datos_en_ventana.append(item)
        except Exception as e:
            print(f"⚠️  Error procesando fecha: {e}")
            item['fecha_procesada'] = datetime.now()
            datos_en_ventana.append(item)
    
    print(f"📊 Datos en ventana de 3 meses: {len(datos_en_ventana)}")
    print(f"📊 Datos fuera de ventana: {datos_fuera_ventana}")
    
    # Segundo: Por cada ciudad/producto, tomar solo la fecha más reciente
    print("🔄 Seleccionando fecha más reciente por ciudad/producto...")
    
    # Estructura: ciudad -> producto -> {datos del más reciente}
    ciudad_producto_map = defaultdict(lambda: defaultdict(list))
    
    # Agrupar por ciudad y producto
    for item in datos_en_ventana:
        # Usar clave correcta para ciudad y código de producto
        ciudad_raw = item.get('NombreCiudad', item.get('ciudad', ''))
        ciudad = normalizar_ciudad_dane(ciudad_raw)
        cod_producto = item.get('CodigoProducto', item.get('codProducto', 0))
        
        if ciudad and cod_producto:
            ciudad_producto_map[ciudad][cod_producto].append(item)
    
    # Seleccionar el más reciente por ciudad/producto
    datos_filtrados = []
    productos_por_ciudad = defaultdict(int)
    
    for ciudad, productos in ciudad_producto_map.items():
        for cod_producto, registros in productos.items():
            # Ordenar por fecha y tomar el más reciente
            registro_mas_reciente = max(registros, key=lambda x: x['fecha_procesada'])
            datos_filtrados.append(registro_mas_reciente)
            productos_por_ciudad[ciudad] += 1
    
    print(f"✅ Datos después del filtrado por fecha más reciente:")
    print(f"   - Total registros únicos: {len(datos_filtrados)}")
    print(f"   - Ciudades con datos: {len(productos_por_ciudad)}")
    
    # Mostrar resumen por ciudad
    for ciudad, count in sorted(productos_por_ciudad.items()):
        print(f"   - {ciudad}: {count} productos únicos")
    
    # Agrupar datos finales por ciudad para React
    ciudades_map = {}
    productos_unicos = {}
    
    for item in datos_filtrados:
        ciudad_raw = item.get('ciudad', '')
        ciudad = normalizar_ciudad_dane(ciudad_raw)
        if not ciudad:
            continue
            
        # Agregar coordenadas
        coords = coordenadas.get(ciudad, {'lat': 4.7110, 'lng': -74.0721})
        
        # Debug: Mostrar si no se encontraron coordenadas específicas
        if ciudad not in coordenadas:
            print(f"⚠️  Coordenadas no encontradas para '{ciudad}', usando Bogotá como fallback")
        
        if ciudad not in ciudades_map:
            ciudades_map[ciudad] = {
                'ciudad': ciudad,
                'lat': coords['lat'],
                'lng': coords['lng'],
                'productos': []
            }
        
        # Agregar producto a la ciudad
        producto_info = {
            'codigo': item.get('CodigoProducto', item.get('codProducto', 0)),
            'nombre': item.get('NombreProducto', item.get('producto', '')),
            'precio': item.get('PrecioPromedio', item.get('precioPromedio', 0)),
            'fechaCaptura': item.get('FechaCaptura', item.get('fechaCaptura', '')),
            'unidad': 'kg'
        }
        
        ciudades_map[ciudad]['productos'].append(producto_info)
        
        # Mantener lista de productos únicos
        if producto_info['codigo'] not in productos_unicos:
            productos_unicos[producto_info['codigo']] = {
                'id': str(producto_info['codigo']),
                'name': producto_info['nombre'],
                'category': 'Mayorista',
                'unit': 'kg'
            }
    
    return {
        'ciudades': list(ciudades_map.values()),
        'productos': list(productos_unicos.values()),
        'metadatos': {
            'fechaGeneracion': datetime.now().isoformat(),
            'fechaLimite': fecha_limite.isoformat(),
            'estrategia': 'Fecha más reciente por ciudad/producto en ventana de 3 meses',
            'ventanaDias': 90,
            'totalCiudades': len(ciudades_map),
            'totalProductos': len(productos_unicos),
            'registrosUnicos': len(datos_filtrados),
            'registrosEnVentana': len(datos_en_ventana),
            'registrosFueraVentana': datos_fuera_ventana,
            'fuente': 'DANE SIPSA'
        }
    }

def procesar_datos_para_react_extendido(datos_sipsa, dias=90):
    """Procesa los datos del DANE SIPSA con ventana de tiempo extendida"""
    from datetime import datetime, timedelta
    
    coordenadas = generar_coordenadas_ciudades()
    
    # Filtrar datos por fecha: últimos N días
    fecha_limite = datetime.now() - timedelta(days=dias)
    print(f"🗓️  Filtrado extendido desde: {fecha_limite.strftime('%Y-%m-%d')} ({dias} días)")
    
    datos_filtrados = []
    datos_antiguos = 0
    
    for item in datos_sipsa:
        try:
            # Parsear fecha de captura usando clave correcta
            fecha_str = item.get('FechaCaptura', '')
            if fecha_str:
                # Intentar varios formatos de fecha
                for formato in ['%Y-%m-%d %H:%M:%S%z', '%Y-%m-%d %H:%M:%S', '%Y-%m-%d']:
                    try:
                        fecha_captura = datetime.strptime(fecha_str.split('.')[0].replace('-05:00', ''), formato.replace('%z', ''))
                        break
                    except ValueError:
                        continue
                else:
                    # Si no se puede parsear la fecha, usar fecha actual
                    fecha_captura = datetime.now()
                
                # Solo incluir si la fecha es dentro del rango
                if fecha_captura >= fecha_limite:
                    datos_filtrados.append(item)
                else:
                    datos_antiguos += 1
            else:
                # Si no tiene fecha, incluirlo
                datos_filtrados.append(item)
        except Exception as e:
            print(f"⚠️  Error procesando fecha para item: {e}")
            datos_filtrados.append(item)
    
    print(f"📊 Filtrado extendido completado:")
    print(f"   - Datos en rango (≤{dias} días): {len(datos_filtrados)}")
    print(f"   - Datos fuera de rango: {datos_antiguos}")
    
    # Agrupar datos por ciudad
    ciudades_map = {}
    productos_unicos = {}
    
    for item in datos_filtrados:
        # Usar claves según el retorno del cliente SOAP
        ciudad = item.get('NombreCiudad', '').upper()
        if not ciudad:
            continue
            
        coords = coordenadas.get(ciudad, {'lat': 4.7110, 'lng': -74.0721})
        
        if ciudad not in ciudades_map:
            ciudades_map[ciudad] = {
                'ciudad': ciudad,
                'lat': coords['lat'],
                'lng': coords['lng'],
                'productos': []
            }
        
        producto_info = {
            'codigo': item.get('CodigoProducto', 0),
            'nombre': item.get('NombreProducto', ''),
            'precio': item.get('PrecioPromedio', 0),
            'fechaCaptura': item.get('FechaCaptura', ''),
            'unidad': 'kg'
        }
        
        ciudades_map[ciudad]['productos'].append(producto_info)
        
        if producto_info['codigo'] not in productos_unicos:
            productos_unicos[producto_info['codigo']] = {
                'id': str(producto_info['codigo']),
                'name': producto_info['nombre'],
                'category': 'Mayorista',
                'unit': 'kg'
            }
    
    return {
        'ciudades': list(ciudades_map.values()),
        'productos': list(productos_unicos.values()),
        'metadatos': {
            'fechaGeneracion': datetime.now().isoformat(),
            'fechaLimite': fecha_limite.isoformat(),
            'ventanaDias': dias,
            'totalCiudades': len(ciudades_map),
            'totalProductos': len(productos_unicos),
            'registrosRecientes': len(datos_filtrados),
            'registrosAntiguos': datos_antiguos,
            'fuente': 'DANE SIPSA'
        }
    }

def main():
    print("🔄 Generando datos del DANE SIPSA (estrategia optimizada)...")
    print("📋 Estrategia: Extraer 3 meses + fecha más reciente por ciudad/producto")
    print("=" * 70)
    
    try:
        # Obtener datos del DANE via Python client
        print("📡 Consultando datos del DANE SIPSA...")
        datos_sipsa = obtener_promedios_sipsa_ciudad()
        
        if not datos_sipsa:
            print("❌ No se pudieron obtener datos del DANE")
            return False
        
        print(f"✅ Se obtuvieron {len(datos_sipsa)} registros del DANE SIPSA")
        
        # Procesar datos con nueva estrategia
        print("🔄 Aplicando estrategia de fecha más reciente por ciudad/producto...")
        datos_procesados = procesar_datos_para_react(datos_sipsa)
        
        # Crear directorio public/data si no existe
        data_dir = os.path.join(os.path.dirname(__file__), '..', 'public', 'data')
        os.makedirs(data_dir, exist_ok=True)
        
        # Guardar datos procesados
        output_file = os.path.join(data_dir, 'dane_sipsa_data.json')
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(datos_procesados, f, ensure_ascii=False, indent=2)
        
        print(f"✅ Datos guardados en: {output_file}")
        print(f"📊 Resumen Final:")
        print(f"   - Total registros DANE SIPSA: {len(datos_sipsa)}")
        print(f"   - Ciudades: {datos_procesados['metadatos']['totalCiudades']}")
        print(f"   - Productos únicos: {datos_procesados['metadatos']['totalProductos']}")
        print(f"   - Registros en ventana (90 días): {datos_procesados['metadatos'].get('registrosEnVentana', 'N/A')}")
        print(f"   - Fecha generación: {datos_procesados['metadatos']['fechaGeneracion']}")
        
        # Mostrar algunos productos encontrados para verificar diversidad
        print(f"\n🐟 Muestra de productos encontrados:")
        productos_muestra = datos_procesados['productos'][:15]  # Primeros 15 productos
        for i, producto in enumerate(productos_muestra, 1):
            print(f"   {i:2d}. {producto['name']} (ID: {producto['id']})")
        
        if len(datos_procesados['productos']) > 15:
            print(f"   ... y {len(datos_procesados['productos']) - 15} productos más")
        
        print("=" * 70)
        print("✅ ¡Datos optimizados generados exitosamente!")
        
        return True
        
    except Exception as e:
        print(f"❌ Error generando datos: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
