# Script de pruebas para la API desplegada en Vercel
# Reemplaza YOUR_VERCEL_URL con la URL real de tu despliegue

param(
    [Parameter(Mandatory=$true)]
    [string]$VercelUrl
)

Write-Host "=== Pruebas de la API en Producción (Vercel) ===" -ForegroundColor Green
Write-Host "URL Base: $VercelUrl" -ForegroundColor Cyan

# Función para hacer peticiones a la API
function Test-ProductionAPI {
    param(
        [string]$Description,
        [string]$Endpoint,
        [string]$ExpectedPattern = ""
    )
    
    $fullUrl = "$VercelUrl$Endpoint"
    Write-Host "`n--- $Description ---" -ForegroundColor Yellow
    Write-Host "URL: $fullUrl" -ForegroundColor Cyan
    
    try {
        $response = Invoke-WebRequest -Uri $fullUrl -Method GET -TimeoutSec 30
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
            try {
                $errorContent = $_.Exception.Response.GetResponseStream()
                $reader = New-Object System.IO.StreamReader($errorContent)
                $errorJson = $reader.ReadToEnd() | ConvertFrom-Json
                Write-Host "Error Response: $($errorJson | ConvertTo-Json)" -ForegroundColor Red
            } catch {
                Write-Host "Could not parse error response" -ForegroundColor Red
            }
        }
    }
}

# Ejecutar pruebas
Test-ProductionAPI -Description "Health Check" -Endpoint "/health"

Test-ProductionAPI -Description "Error: Sin parámetros" -Endpoint "/api/working-days"

Test-ProductionAPI -Description "Agregar 1 día hábil" -Endpoint "/api/working-days?days=1"

Test-ProductionAPI -Description "Agregar 1 hora hábil" -Endpoint "/api/working-days?hours=1"

Test-ProductionAPI -Description "Agregar 1 día y 4 horas hábiles" -Endpoint "/api/working-days?days=1&hours=4"

Test-ProductionAPI -Description "Con fecha específica (10 abril 2025)" -Endpoint "/api/working-days?date=2025-04-10T15:00:00.000Z&days=5&hours=4"

Test-ProductionAPI -Description "Error: Días negativos" -Endpoint "/api/working-days?days=-1"

Test-ProductionAPI -Description "Error: Fecha inválida" -Endpoint "/api/working-days?date=invalid-date&hours=1"

Write-Host "`n=== Fin de las Pruebas de Producción ===" -ForegroundColor Green
