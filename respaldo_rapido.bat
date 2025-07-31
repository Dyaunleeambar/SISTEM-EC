@echo off
REM Acceso Rápido al Sistema de Respaldos
REM Sistema de Estimulación de Colaboradores

echo ========================================
echo    SISTEMA DE RESPALDOS - ACCESO RAPIDO
echo ========================================
echo.

REM Cambiar al directorio de respaldos
cd /d "%~dp0backup"

REM Ejecutar el gestor de respaldos
call gestionar_respaldos.bat

REM Volver al directorio original
cd /d "%~dp0" 