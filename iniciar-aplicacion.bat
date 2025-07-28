@echo off
title Sistema de Estimulación de Colaboradores
echo ========================================
echo    Sistema de Estimulación
echo    Iniciando aplicacion...
echo ========================================
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no está instalado o no está en el PATH
    echo Por favor, instale Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar si MySQL está ejecutándose
echo Verificando conexión a MySQL...
timeout /t 2 >nul

REM Instalar dependencias si no existen
if not exist "node_modules" (
    echo Instalando dependencias...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: No se pudieron instalar las dependencias
        pause
        exit /b 1
    )
)

REM Iniciar la aplicación
echo Iniciando Sistema de Estimulación...
echo.
echo La aplicación se abrirá automáticamente en unos segundos.
echo.
echo Presione Ctrl+C para cerrar la aplicación
echo.

REM Iniciar en modo desarrollo con Electron
npm run electron-dev

pause 