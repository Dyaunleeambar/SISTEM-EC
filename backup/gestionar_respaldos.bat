@echo off
REM Script de Gestión de Respaldos
REM Sistema de Estimulación de Colaboradores
REM Autor: Sistema Automático
REM Fecha: %date% %time%

:menu
cls
echo ========================================
echo    GESTION DE RESPALDOS
echo ========================================
echo.
echo 1. Ver respaldos disponibles
echo 2. Crear respaldo manual
echo 3. Restaurar respaldo
echo 4. Limpiar respaldos antiguos
echo 5. Configurar respaldos automáticos
echo 6. Ver tareas programadas
echo 7. Salir
echo.
set /p opcion="Seleccione una opción (1-7): "

if "%opcion%"=="1" goto ver_respaldos
if "%opcion%"=="2" goto crear_respaldo
if "%opcion%"=="3" goto restaurar_respaldo
if "%opcion%"=="4" goto limpiar_respaldos
if "%opcion%"=="5" goto configurar_automatico
if "%opcion%"=="6" goto ver_tareas
if "%opcion%"=="7" goto salir
goto menu

:ver_respaldos
cls
echo ========================================
echo    RESPALDOS DISPONIBLES
echo ========================================
echo.

if not exist "backups\*.zip" (
    echo No se encontraron archivos de respaldo.
    echo.
    echo Presione cualquier tecla para continuar...
    pause >nul
    goto menu
)

echo Lista de respaldos disponibles:
echo.
dir /b /o-d backups\*.zip
echo.
echo Total de archivos: 
dir /b backups\*.zip 2>nul | find /c /v ""
echo.
echo Presione cualquier tecla para continuar...
pause >nul
goto menu

:crear_respaldo
cls
echo ========================================
echo    CREAR RESPALDO MANUAL
echo ========================================
echo.
echo Creando respaldo manual...
call backup_mysql.bat
echo.
echo Presione cualquier tecla para continuar...
pause >nul
goto menu

:restaurar_respaldo
cls
echo ========================================
echo    RESTAURAR RESPALDO
echo ========================================
echo.
call restore_mysql.bat
echo.
echo Presione cualquier tecla para continuar...
pause >nul
goto menu

:limpiar_respaldos
cls
echo ========================================
echo    LIMPIAR RESPALDOS ANTIGUOS
echo ========================================
echo.
echo Esta opción eliminará los respaldos más antiguos,
echo manteniendo solo los últimos 10 archivos.
echo.
set /p confirm="¿Desea continuar? (S/N): "
if /i not "%confirm%"=="S" goto menu

echo Limpiando respaldos antiguos...
for /f "skip=10 delims=" %%i in ('dir /b /o-d backups\*.zip 2^>nul') do (
    echo Eliminando: %%i
    del "backups\%%i"
)

echo.
echo Limpieza completada.
echo Presione cualquier tecla para continuar...
pause >nul
goto menu

:configurar_automatico
cls
echo ========================================
echo    CONFIGURAR RESPALDOS AUTOMATICOS
echo ========================================
echo.
call configurar_respaldo_automatico.bat
echo.
echo Presione cualquier tecla para continuar...
pause >nul
goto menu

:ver_tareas
cls
echo ========================================
echo    TAREAS PROGRAMADAS
echo ========================================
echo.
echo Tareas programadas del sistema:
echo.
schtasks /query /tn "SistemaEstimulacion_*" /fo table
echo.
echo Presione cualquier tecla para continuar...
pause >nul
goto menu

:salir
echo.
echo Gracias por usar el Sistema de Gestión de Respaldos.
echo.
exit /b 0 