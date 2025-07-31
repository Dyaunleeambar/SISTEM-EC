@echo off
REM Script de Restauración de MySQL
REM Sistema de Estimulación de Colaboradores
REM Autor: Sistema Automático
REM Fecha: %date% %time%

echo ========================================
echo    SISTEMA DE RESTAURACION
echo ========================================
echo.

REM Configuración de la base de datos
set DB_HOST=localhost
set DB_USER=root
set DB_PASSWORD=Cuba123456
set DB_NAME=colaboradores_db

REM Verificar si existen archivos de respaldo
if not exist "backups\*.zip" (
    echo No se encontraron archivos de respaldo en la carpeta 'backups'
    echo.
    echo Presione cualquier tecla para continuar...
    pause >nul
    exit /b 1
)

echo Archivos de respaldo disponibles:
echo.
dir /b backups\*.zip

echo.
echo ========================================
echo    INSTRUCCIONES DE RESTAURACION
echo ========================================
echo 1. Seleccione el archivo de respaldo que desea restaurar
echo 2. El sistema restaurará la base de datos %DB_NAME%
echo 3. Se creará un respaldo de la base actual antes de restaurar
echo 4. ADVERTENCIA: Esta operación sobrescribirá la base de datos actual
echo.

set /p BACKUP_FILE="Ingrese el nombre del archivo de respaldo (ej: colaboradores_db_backup_20241201_143022.sql.zip): "

REM Verificar si el archivo existe
if not exist "backups\%BACKUP_FILE%" (
    echo Error: El archivo 'backups\%BACKUP_FILE%' no existe.
    echo.
    echo Presione cualquier tecla para continuar...
    pause >nul
    exit /b 1
)

echo.
echo ========================================
echo    CONFIRMACION DE RESTAURACION
echo ========================================
echo Archivo a restaurar: %BACKUP_FILE%
echo Base de datos destino: %DB_NAME%
echo.
echo ADVERTENCIA: Esta operación sobrescribirá la base de datos actual.
echo.

set /p CONFIRM="¿Está seguro de que desea continuar? (S/N): "
if /i not "%CONFIRM%"=="S" (
    echo Restauración cancelada.
    echo.
    echo Presione cualquier tecla para continuar...
    pause >nul
    exit /b 0
)

echo.
echo ========================================
echo    INICIANDO RESTAURACION
echo ========================================

REM Crear respaldo de la base actual antes de restaurar
echo Creando respaldo de seguridad de la base actual...
call backup_mysql.bat

REM Extraer archivo comprimido
echo Extrayendo archivo de respaldo...
powershell -command "Expand-Archive -Path 'backups\%BACKUP_FILE%' -DestinationPath 'backups\temp' -Force"

REM Buscar el archivo .sql extraído
for %%f in (backups\temp\*.sql) do set SQL_FILE=%%f

REM Configurar ruta de MySQL
set MYSQL_PATH=C:\Program Files\MySQL\MySQL Server 8.0\bin

REM Restaurar la base de datos
echo Restaurando base de datos...
"%MYSQL_PATH%\mysql" -h %DB_HOST% -u %DB_USER% -p%DB_PASSWORD% %DB_NAME% < "%SQL_FILE%"

REM Verificar si la restauración fue exitosa
if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo    RESTAURACION EXITOSA
    echo ========================================
    echo La base de datos ha sido restaurada correctamente.
    echo Archivo restaurado: %BACKUP_FILE%
    echo Fecha: %date% %time%
    
) else (
    echo.
    echo ========================================
    echo    ERROR EN LA RESTAURACION
    echo ========================================
    echo Error al restaurar la base de datos.
    echo Verifique la configuración de MySQL.
    echo.
)

REM Limpiar archivos temporales
if exist "backups\temp" rmdir /s /q "backups\temp"

echo.
echo Presione cualquier tecla para continuar...
pause >nul 
