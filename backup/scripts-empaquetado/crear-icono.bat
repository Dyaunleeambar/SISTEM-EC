@echo off
title Crear Icono - Sistema de Estimulación
echo ================================================
echo    CREANDO ICONO PARA LA APLICACIÓN
echo ================================================
echo.

REM Crear carpeta assets si no existe
if not exist "assets" mkdir assets

REM Crear un archivo de texto que explique cómo crear el icono
(
    echo ================================================
    echo    INSTRUCCIONES PARA CREAR ICONO
    echo ================================================
    echo.
    echo Para crear un icono personalizado:
    echo.
    echo 1. Cree una imagen de 256x256 píxeles
    echo 2. Conviértala a formato .ico para Windows
    echo 3. Colóquela en la carpeta 'assets' con el nombre:
    echo    - icon.ico (para Windows)
    echo    - icon.icns (para macOS)
    echo    - icon.png (para Linux)
    echo.
    echo Herramientas recomendadas:
    echo - https://convertio.co/es/png-ico/
    echo - https://www.icoconverter.com/
    echo.
    echo Por ahora, la aplicación funcionará sin icono.
    echo.
    echo ================================================
) > "assets/INSTRUCCIONES-ICONO.txt"

echo ✓ Carpeta assets creada
echo ✓ Instrucciones para icono creadas
echo.
echo Para continuar sin icono, presione cualquier tecla...
pause 
