# Script de pruebas para la API de días hábiles
# Ejemplos basados en los casos de prueba proporcionados

Write-Host "=== Pruebas de la API de Días Hábiles ===" -ForegroundColor Green

# Función para hacer peticiones a la API
function Test-API {
    param(
        [string]$Description,
        [string]$Url,
        [string]$ExpectedPattern = ""
    )
    
    Write-Host "`n--- $Description ---" -ForegroundColor Yellow
    Write-Host "URL: $Url" -ForegroundColor Cyan
    
    try {
        $response = Invoke-WebRequest -Uri $Url -Method GET
        $jsonResponse = $response.Content | ConvertFrom-Json
        
        Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
        Write-Host "Response: $($response.Content)" -ForegroundColor White
        
        if ($ExpectedPattern -ne "" -and $jsonResponse.date -match $ExpectedPattern) {
            Write-Host "✓ Test PASSED - Response matches expected pattern" -ForegroundColor Green
        } elseif ($ExpectedPattern -ne "") {
            Write-Host "✗ Test FAILED - Response does not match expected pattern" -ForegroundColor Red
        }
        
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $errorContent = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorContent)
            $errorJson = $reader.ReadToEnd() | ConvertFrom-Json
            Write-Host "Error Response: $($errorJson | ConvertTo-Json)" -ForegroundColor Red
        }
    }
}

# Ejemplo 1: Error - Sin parámetros
Test-API -Description "Error: Sin parámetros" -Url "http://localhost:3000/api/working-days"

# Ejemplo 2: Solo días hábiles
Test-API -Description "Agregar 1 día hábil" -Url "http://localhost:3000/api/working-days?days=1"

# Ejemplo 3: Solo horas hábiles
Test-API -Description "Agregar 1 hora hábil" -Url "http://localhost:3000/api/working-days?hours=1"

# Ejemplo 4: Días y horas
Test-API -Description "Agregar 1 día y 4 horas hábiles" -Url "http://localhost:3000/api/working-days?days=1&hours=4"

# Ejemplo 5: Con fecha específica (usando una fecha de ejemplo)
$testDate = "2025-04-10T15:00:00.000Z"
Test-API -Description "Con fecha específica: $testDate, 5 días y 4 horas" -Url "http://localhost:3000/api/working-days?date=$testDate&days=5&hours=4"

# Ejemplo 6: Parámetros inválidos
Test-API -Description "Error: Días negativos" -Url "http://localhost:3000/api/working-days?days=-1"

# Ejemplo 7: Fecha inválida
Test-API -Description "Error: Fecha inválida" -Url "http://localhost:3000/api/working-days?date=invalid-date&hours=1"

Write-Host "`n=== Fin de las Pruebas ===" -ForegroundColor Green
