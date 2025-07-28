@echo off
echo Limpiando proyecto Sistema de Estimulacion...
echo.

REM Crear directorio de backup
if not exist "backup" mkdir backup
if not exist "backup\empaquetados-fallidos" mkdir backup\empaquetados-fallidos
if not exist "backup\scripts-empaquetado" mkdir backup\scripts-empaquetado

echo Moviendo directorios de empaquetado fallidos...
if exist "SistemaEstimulacion-Final" (
    move "SistemaEstimulacion-Final" "backup\empaquetados-fallidos\"
    echo - SistemaEstimulacion-Final movido
)

if exist "SistemaEstimulacion-Funcional" (
    move "SistemaEstimulacion-Funcional" "backup\empaquetados-fallidos\"
    echo - SistemaEstimulacion-Funcional movido
)

if exist "SistemaEstimulacion-Simple" (
    move "SistemaEstimulacion-Simple" "backup\empaquetados-fallidos\"
    echo - SistemaEstimulacion-Simple movido
)

if exist "dist-package" (
    move "dist-package" "backup\empaquetados-fallidos\"
    echo - dist-package movido
)

if exist "dist" (
    move "dist" "backup\empaquetados-fallidos\"
    echo - dist movido
)

echo.
echo Moviendo archivos de empaquetado fallidos...
if exist "SistemaEstimulacion.exe" (
    move "SistemaEstimulacion.exe" "backup\empaquetados-fallidos\"
    echo - SistemaEstimulacion.exe movido
)

if exist "SistemaEstimulacionMejorado.exe" (
    move "SistemaEstimulacionMejorado.exe" "backup\empaquetados-fallidos\"
    echo - SistemaEstimulacionMejorado.exe movido
)

echo.
echo Moviendo scripts de empaquetado...
move "crear-paquete-final-funcional.bat" "backup\scripts-empaquetado\"
move "crear-ejecutable-definitivo.bat" "backup\scripts-empaquetado\"
move "crear-paquete-completo-final.bat" "backup\scripts-empaquetado\"
move "crear-ejecutable-con-frontend.bat" "backup\scripts-empaquetado\"
move "crear-paquete-simple.bat" "backup\scripts-empaquetado\"
move "crear-ejecutable-mejorado.bat" "backup\scripts-empaquetado\"
move "crear-ejecutable-simple.bat" "backup\scripts-empaquetado\"
move "crear-paquete-completo.bat" "backup\scripts-empaquetado\"
move "crear-icono.bat" "backup\scripts-empaquetado\"
move "crear-acceso-directo.bat" "backup\scripts-empaquetado\"
move "instalador-completo.bat" "backup\scripts-empaquetado\"
move "Iniciar Sistema Mejorado.bat" "backup\scripts-empaquetado\"

echo.
echo Moviendo archivos de documentacion adicional...
move "GUIA-USUARIO-FINAL.md" "backup\"
move "README-ELECTRON.md" "backup\"
move "crear-usuarios-test.js" "backup\"

echo.
echo Eliminando archivo corrupto...
if exist "{" del "{"

echo.
echo Limpieza completada!
echo.
echo Archivos esenciales mantenidos:
echo - app.js, server.js, logic.js, index.html, styles.css
echo - config.env, package.json, package-lock.json
echo - electron/main.js, electron/server.js
echo - README.md, LICENSE
echo - app.test.js, server.test.js
echo.
echo Para ejecutar la aplicacion: npm run electron-dev
echo.
pause 
