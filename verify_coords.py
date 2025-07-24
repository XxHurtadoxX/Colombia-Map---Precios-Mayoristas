import json

# Cargar datos y verificar coordenadas específicas
with open('public/data/dane_sipsa_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("Verificando coordenadas de ciudades problemáticas:")
ciudades_verificar = ['POPAYÁN', 'MONTERÍA', 'VALLEDUPAR', 'BOGOTÁ']

for ciudad_data in data['ciudades']:
    if ciudad_data['ciudad'] in ciudades_verificar:
        print(f"{ciudad_data['ciudad']}: lat={ciudad_data['lat']}, lng={ciudad_data['lng']}")

print("\nVerificando productos disponibles para POPAYÁN:")
for ciudad_data in data['ciudades']:
    if ciudad_data['ciudad'] == 'POPAYÁN':
        print(f"POPAYÁN tiene {len(ciudad_data['productos'])} productos")
        for i, producto in enumerate(ciudad_data['productos'][:3]):
            print(f"  {i+1}. {producto['nombre']} (ID: {producto['codigo']})")
        break
