@echo off
REM Script de Respaldo Automático de MySQL
REM Sistema de Estimulación de Colaboradores
REM Autor: Sistema Automático
REM Fecha: %date% %time%

echo ========================================
echo    SISTEMA DE RESPALDO AUTOMATICO
echo ========================================
echo.

REM Configuración de la base de datos
set DB_HOST=localhost
set DB_USER=root
set DB_PASSWORD=Cuba123456
set DB_NAME=colaboradores_db

REM Crear directorio de respaldos si no existe
if not exist "backups" (
    mkdir backups
    echo Directorio de respaldos creado: backups
)

REM Generar nombre del archivo con fecha y hora
for /f "tokens=1-3 delims=/ " %%a in ('date /t') do set "DD=%%a" & set "MM=%%b" & set "YYYY=%%c"
for /f "tokens=1-2 delims=: " %%a in ('time /t') do set "HH=%%a" & set "Min=%%b"
set "datestamp=%YYYY%%MM%%DD%_%HH%%Min%"

REM Nombre del archivo de respaldo
set BACKUP_FILE=backups\colaboradores_db_backup_%datestamp%.sql

echo Iniciando respaldo de la base de datos...
echo Base de datos: %DB_NAME%
echo Archivo: %BACKUP_FILE%
echo.

REM Configurar ruta de MySQL
set MYSQL_PATH=C:\Program Files\MySQL\MySQL Server 8.0\bin

REM Ejecutar mysqldump
"%MYSQL_PATH%\mysqldump" -h %DB_HOST% -u %DB_USER% -p%DB_PASSWORD% --single-transaction --routines --triggers %DB_NAME% > "%BACKUP_FILE%"

REM Verificar si el respaldo fue exitoso
if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo    RESPALDO EXITOSO
    echo ========================================
    echo Archivo creado: %BACKUP_FILE%
    
    REM Comprimir el archivo
    echo Comprimiendo archivo...
    powershell -command "Compress-Archive -Path '%BACKUP_FILE%' -DestinationPath '%BACKUP_FILE%.zip' -Force"
    
    REM Eliminar archivo original (solo si la compresión fue exitosa)
    if exist "%BACKUP_FILE%.zip" (
        del "%BACKUP_FILE%"
        echo Archivo comprimido: %BACKUP_FILE%.zip
    )
    
    REM Limpiar respaldos antiguos (mantener solo los últimos 10)
    echo Limpiando respaldos antiguos...
    for /f "skip=10 delims=" %%i in ('dir /b /o-d backups\*.zip 2^>nul') do del "backups\%%i"
    
    echo.
    echo Respaldo completado exitosamente!
    echo Fecha: %date% %time%
    
) else (
    echo.
    echo ========================================
    echo    ERROR EN EL RESPALDO
    echo ========================================
    echo Error al crear el respaldo de la base de datos.
    echo Verifique la configuración de MySQL.
    echo.
)

echo.
echo Presione cualquier tecla para continuar...
pause >nul 
