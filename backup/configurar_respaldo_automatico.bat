@echo off
REM Script de Configuración de Respaldos Automáticos
REM Sistema de Estimulación de Colaboradores
REM Autor: Sistema Automático
REM Fecha: %date% %time%

echo ========================================
echo    CONFIGURACION DE RESPALDOS AUTOMATICOS
echo ========================================
echo.

REM Obtener la ruta actual del script
set SCRIPT_PATH=%~dp0
set BACKUP_SCRIPT=%SCRIPT_PATH%backup_mysql.bat

echo Configurando respaldos automáticos...
echo Script de respaldo: %BACKUP_SCRIPT%
echo.

REM Crear tarea programada para respaldo diario
echo Creando tarea programada para respaldo diario...
schtasks /create /tn "SistemaEstimulacion_RespaldoDiario" /tr "%BACKUP_SCRIPT%" /sc daily /st 02:00 /f

if %errorlevel% equ 0 (
    echo Tarea programada creada exitosamente para respaldo diario a las 2:00 AM
) else (
    echo Error al crear la tarea programada diaria
)

echo.

REM Crear tarea programada para respaldo semanal
echo Creando tarea programada para respaldo semanal...
schtasks /create /tn "SistemaEstimulacion_RespaldoSemanal" /tr "%BACKUP_SCRIPT%" /sc weekly /d SUN /st 03:00 /f

if %errorlevel% equ 0 (
    echo Tarea programada creada exitosamente para respaldo semanal los domingos a las 3:00 AM
) else (
    echo Error al crear la tarea programada semanal
)

echo.

REM Crear tarea programada para respaldo mensual
echo Creando tarea programada para respaldo mensual...
schtasks /create /tn "SistemaEstimulacion_RespaldoMensual" /tr "%BACKUP_SCRIPT%" /sc monthly /d 1 /st 04:00 /f

if %errorlevel% equ 0 (
    echo Tarea programada creada exitosamente para respaldo mensual el día 1 a las 4:00 AM
) else (
    echo Error al crear la tarea programada mensual
)

echo.
echo ========================================
echo    CONFIGURACION COMPLETADA
echo ========================================
echo.
echo Respaldos automáticos configurados:
echo - Diario: 2:00 AM
echo - Semanal: Domingos 3:00 AM  
echo - Mensual: Día 1 del mes 4:00 AM
echo.
echo Para ver las tareas programadas:
echo schtasks /query /tn "SistemaEstimulacion_*"
echo.
echo Para eliminar una tarea:
echo schtasks /delete /tn "NombreDeLaTarea" /f
echo.

echo Presione cualquier tecla para continuar...
pause >nul 