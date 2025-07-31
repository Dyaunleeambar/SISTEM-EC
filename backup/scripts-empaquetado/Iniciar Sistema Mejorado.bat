@echo off
title Sistema de Estimulación de Colaboradores - Versión Mejorada
color 0A

echo ========================================
echo    Sistema de Estimulación
echo    Versión Mejorada
echo ========================================
echo.

REM Verificar si el puerto 3001 está en uso
echo Verificando puerto 3001...
netstat -ano | findstr :3001 >nul
if %errorlevel% equ 0 (
    echo [ADVERTENCIA] El puerto 3001 ya está en uso.
    echo.
    echo Procesos usando el puerto 3001:
    netstat -ano | findstr :3001
    echo.
    echo Cerrando procesos existentes...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
        echo Cerrando proceso PID: %%a
        taskkill /f /pid %%a >nul 2>&1
    )
    echo.
    echo Esperando 3 segundos para que se libere el puerto...
    timeout /t 3 /nobreak >nul
    echo.
)

REM Verificar si MySQL está ejecutándose
echo Verificando MySQL...
sc query mysql >nul 2>&1
if %errorlevel% neq 0 (
    echo [ADVERTENCIA] MySQL no parece estar ejecutándose.
    echo Por favor, inicie MySQL antes de continuar.
    echo.
    echo Para iniciar MySQL manualmente:
    echo 1. Abra el Administrador de servicios
    echo 2. Busque "MySQL"
    echo 3. Haga clic en "Iniciar"
    echo.
    pause
    exit /b 1
)

echo Iniciando servidor backend...
echo.
echo NOTA: Si el servidor se cierra inmediatamente, verifique:
echo 1. MySQL está ejecutándose
echo 2. La contraseña de MySQL es: Cuba123456
echo 3. El puerto 3001 está libre
echo.
echo Presione cualquier tecla para continuar...
pause >nul

start /min SistemaEstimulacionMejorado.exe

echo Esperando que el servidor esté listo...
echo.

REM Esperar y verificar que el servidor esté funcionando
set /a attempts=0
:wait_loop
timeout /t 2 /nobreak >nul
set /a attempts+=1

REM Verificar si el servidor responde
powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:3001' -TimeoutSec 3 | Out-Null; exit 0 } catch { exit 1 }" >nul 2>&1
if %errorlevel% equ 0 (
    goto server_ready
)

if %attempts% lss 10 (
    echo Esperando... (intento %attempts%/10)
    goto wait_loop
) else (
    echo.
    echo [ERROR] El servidor no responde después de 20 segundos.
    echo.
    echo Posibles soluciones:
    echo 1. Verifique que MySQL esté ejecutándose
    echo 2. Verifique la contraseña de MySQL: Cuba123456
    echo 3. Cierre otros procesos que usen el puerto 3001
    echo 4. Reinicie el script
    echo.
    pause
    exit /b 1
)

:server_ready
echo.
echo ========================================
echo    Servidor iniciado correctamente!
echo ========================================
echo.
echo Abriendo aplicación en el navegador...
start http://localhost:3001

echo.
echo Credenciales de acceso:
echo - Usuario: admin
echo - Contraseña: admin123
echo.
echo El servidor está ejecutándose en segundo plano.
echo Para cerrar el servidor, presione cualquier tecla...
pause

echo.
echo Cerrando servidor...
taskkill /f /im SistemaEstimulacionMejorado.exe >nul 2>&1
echo Servidor cerrado correctamente.
echo.
pause 
