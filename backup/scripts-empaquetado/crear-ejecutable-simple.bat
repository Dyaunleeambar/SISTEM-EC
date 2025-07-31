@echo off
title Crear Ejecutable Simple - Sistema de Estimulación
echo ====================================================
echo    CREANDO EJECUTABLE SIMPLE
echo    Sistema de Estimulación de Colaboradores
echo ====================================================
echo.

REM Verificar si pkg está instalado
echo Verificando dependencias...
npm list pkg >nul 2>&1
if %errorlevel% neq 0 (
    echo Instalando pkg...
    npm install pkg --save-dev
)

REM Crear ejecutable
echo.
echo Creando ejecutable...
echo.
npm run build-exe

if %errorlevel% equ 0 (
    echo.
    echo ====================================================
    echo    EJECUTABLE CREADO EXITOSAMENTE
    echo ====================================================
    echo.
    echo ✓ Ejecutable creado: SistemaEstimulacion.exe
    echo.
    echo Para usar el ejecutable:
    echo 1. Asegúrese de que MySQL esté ejecutándose
    echo 2. Ejecute: SistemaEstimulacion.exe
    echo 3. Abra su navegador en: http://localhost:3001
    echo 4. Inicie sesión con admin / admin123
    echo.
    echo Nota: Este ejecutable solo incluye el servidor backend.
    echo Para la aplicación completa, use los scripts de Electron.
    echo.
) else (
    echo.
    echo ====================================================
    echo    ERROR AL CREAR EJECUTABLE
    echo ====================================================
    echo.
    echo ❌ No se pudo crear el ejecutable
    echo.
    echo Soluciones:
    echo 1. Verifique que Node.js esté instalado
    echo 2. Ejecute: npm install
    echo 3. Intente nuevamente
    echo.
)

pause 
