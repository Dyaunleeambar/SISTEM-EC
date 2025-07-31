@echo off
title Crear Acceso Directo - Sistema de Estimulación
echo ================================================
echo    CREANDO ACCESO DIRECTO
echo    Sistema de Estimulación de Colaboradores
echo ================================================
echo.

REM Obtener la ruta actual
set "currentDir=%~dp0"
set "desktop=%USERPROFILE%\Desktop"

REM Crear script de inicio mejorado
echo Creando script de inicio...
(
    echo @echo off
    echo title Sistema de Estimulación de Colaboradores
    echo echo ========================================
    echo echo    Sistema de Estimulación
    echo echo    Iniciando aplicacion...
    echo echo ========================================
    echo echo.
    echo echo Esperando que se inicie la aplicación...
    echo echo.
    echo cd /d "%currentDir%"
    echo npm run electron-dev
    echo pause
) > "%desktop%\Sistema de Estimulación.bat"

REM Crear un archivo de texto con instrucciones
(
    echo ========================================
    echo    SISTEMA DE ESTIMULACIÓN
    echo    Acceso Directo Creado
    echo ========================================
    echo.
    echo Para iniciar la aplicación:
    echo 1. Haga doble clic en "Sistema de Estimulación.bat"
    echo 2. Espere a que se abra la aplicación
    echo 3. Use las credenciales por defecto:
    echo    Usuario: admin
    echo    Contraseña: admin123
    echo.
    echo Para cerrar la aplicación:
    echo - Cierre la ventana de la aplicación
    echo - O presione Ctrl+C en la consola
    echo.
    echo ========================================
) > "%desktop%\INSTRUCCIONES - Sistema de Estimulación.txt"

echo.
echo ================================================
echo    ACCESO DIRECTO CREADO EXITOSAMENTE
echo ================================================
echo.
echo ✓ Script de inicio creado en el escritorio
echo ✓ Archivo de instrucciones creado
echo.
echo Ubicación de los archivos:
echo - %desktop%\Sistema de Estimulación.bat
echo - %desktop%\INSTRUCCIONES - Sistema de Estimulación.txt
echo.
echo Para usar la aplicación:
echo 1. Haga doble clic en "Sistema de Estimulación.bat"
echo 2. Espere a que se abra la aplicación
echo 3. Inicie sesión con admin / admin123
echo.
pause 
