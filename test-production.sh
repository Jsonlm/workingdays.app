#!/bin/bash

# Script de pruebas para la API desplegada en Vercel
# Uso: ./test-production.sh https://tu-app.vercel.app

if [ -z "$1" ]; then
    echo "Uso: $0 <URL_DE_VERCEL>"
    echo "Ejemplo: $0 https://working-days-api.vercel.app"
    exit 1
fi

VERCEL_URL="$1"

echo "=== Pruebas de la API en Producción (Vercel) ==="
echo "URL Base: $VERCEL_URL"

# Función para hacer pruebas
test_api() {
    local description="$1"
    local endpoint="$2"
    local expected_pattern="$3"
    
    local full_url="${VERCEL_URL}${endpoint}"
    echo ""
    echo "--- $description ---"
    echo "URL: $full_url"
    
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" "$full_url" -o /tmp/response.json)
    http_code=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    
    if [ $http_code -eq 200 ]; then
        echo "Status: $http_code"
        echo "Response: $(cat /tmp/response.json)"
        
        if [ -n "$expected_pattern" ]; then
            if grep -q "$expected_pattern" /tmp/response.json; then
                echo "✓ Test PASSED - Response matches expected pattern"
            else
                echo "✗ Test FAILED - Response does not match expected pattern"
            fi
        fi
    else
        echo "Error: HTTP $http_code"
        echo "Response: $(cat /tmp/response.json)"
    fi
    
    rm -f /tmp/response.json
}

# Ejecutar pruebas
test_api "Health Check" "/health"
test_api "Error: Sin parámetros" "/api/working-days"
test_api "Agregar 1 día hábil" "/api/working-days?days=1"
test_api "Agregar 1 hora hábil" "/api/working-days?hours=1"
test_api "Agregar 1 día y 4 horas hábiles" "/api/working-days?days=1&hours=4"
test_api "Con fecha específica (10 abril 2025)" "/api/working-days?date=2025-04-10T15:00:00.000Z&days=5&hours=4"
test_api "Error: Días negativos" "/api/working-days?days=-1"
test_api "Error: Fecha inválida" "/api/working-days?date=invalid-date&hours=1"

echo ""
echo "=== Fin de las Pruebas de Producción ==="
