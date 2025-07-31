@echo off
title Instalador - Sistema de Estimulación de Colaboradores
echo ======================================================
echo    INSTALADOR COMPLETO
echo    Sistema de Estimulación de Colaboradores
echo ======================================================
echo.

REM Verificar si Node.js está instalado
echo [1/4] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no está instalado
    echo.
    echo Por favor, instale Node.js desde: https://nodejs.org/
    echo Descargue la versión LTS (Long Term Support)
    echo.
    echo Después de instalar Node.js, ejecute este script nuevamente.
    pause
    exit /b 1
) else (
    echo ✓ Node.js está instalado
)

REM Verificar si MySQL está instalado
echo.
echo [2/4] Verificando MySQL...
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ADVERTENCIA: MySQL no está instalado o no está en el PATH
    echo.
    echo Para instalar MySQL:
    echo 1. Descargue MySQL desde: https://dev.mysql.com/downloads/
    echo 2. Instale MySQL Server
    echo 3. Configure la contraseña como: Cuba123456
    echo 4. Agregue MySQL al PATH del sistema
    echo.
    echo ¿Desea continuar sin MySQL? (S/N)
    set /p continuar=
    if /i "%continuar%"=="S" (
        echo Continuando sin MySQL...
    ) else (
        echo Instalación cancelada.
        pause
        exit /b 1
    )
) else (
    echo ✓ MySQL está instalado
)

REM Instalar dependencias
echo.
echo [3/4] Instalando dependencias...
if exist "node_modules" (
    echo Actualizando dependencias...
    npm install
) else (
    echo Instalando dependencias por primera vez...
    npm install
)

if %errorlevel% neq 0 (
    echo ERROR: No se pudieron instalar las dependencias
    pause
    exit /b 1
)

REM Crear archivo de configuración si no existe
echo.
echo [4/4] Configurando aplicación...
if not exist "config.env" (
    echo Creando archivo de configuración...
    (
        echo PORT=3001
        echo NODE_ENV=development
        echo DB_HOST=localhost
        echo DB_USER=root
        echo DB_PASSWORD=Cuba123456
        echo DB_NAME=colaboradores_db
        echo JWT_SECRET=sistema_estimulacion_secreto_jwt_2024
        echo JWT_EXPIRES_IN=24h
        echo JWT_REFRESH_EXPIRES_IN=7d
        echo BCRYPT_ROUNDS=12
        echo RATE_LIMIT_WINDOW_MS=900000
        echo RATE_LIMIT_MAX_REQUESTS=100
        echo PASSWORD_EXPIRY_DAYS=30
        echo MIN_PASSWORD_LENGTH=8
    ) > config.env
    echo ✓ Archivo de configuración creado
) else (
    echo ✓ Archivo de configuración ya existe
)

REM Crear acceso directo en el escritorio
echo.
echo Creando acceso directo...
set "desktop=%USERPROFILE%\Desktop"
set "shortcut=%desktop%\Sistema de Estimulación.lnk"

REM Crear script de inicio en el escritorio
(
    echo @echo off
    echo cd /d "%~dp0"
    echo start "" "iniciar-aplicacion.bat"
) > "%desktop%\Iniciar Sistema de Estimulación.bat"

echo.
echo ======================================================
echo    INSTALACIÓN COMPLETADA
echo ======================================================
echo.
echo ✓ Node.js verificado
echo ✓ Dependencias instaladas
echo ✓ Configuración creada
echo ✓ Acceso directo creado en el escritorio
echo.
echo Para iniciar la aplicación:
echo 1. Haga doble clic en "Iniciar Sistema de Estimulación.bat"
echo 2. O ejecute: iniciar-aplicacion.bat
echo.
echo Credenciales por defecto:
echo Usuario: admin
echo Contraseña: admin123
echo.
pause 
