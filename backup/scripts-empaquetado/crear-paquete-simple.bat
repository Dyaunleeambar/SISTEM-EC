@echo off
title Creando Paquete Simple
color 0A

echo ========================================
echo    Creando Paquete Simple
echo ========================================
echo.

REM Crear directorio del paquete
if exist "SistemaEstimulacion-Simple" rmdir /s /q "SistemaEstimulacion-Simple"
mkdir "SistemaEstimulacion-Simple"

echo Copiando archivos necesarios...

REM Copiar el ejecutable
copy "SistemaEstimulacionMejorado.exe" "SistemaEstimulacion-Simple\"

REM Copiar archivos de configuración
copy "config.env" "SistemaEstimulacion-Simple\"

REM Crear directorio app y copiar archivos frontend
mkdir "SistemaEstimulacion-Simple\app"
copy "index.html" "SistemaEstimulacion-Simple\app\"
copy "app.js" "SistemaEstimulacion-Simple\app\"
copy "styles.css" "SistemaEstimulacion-Simple\app\"
copy "logic.js" "SistemaEstimulacion-Simple\app\"

REM Crear script de inicio simple
echo @echo off > "SistemaEstimulacion-Simple\INICIAR.bat"
echo title Sistema de Estimulacion >> "SistemaEstimulacion-Simple\INICIAR.bat"
echo color 0A >> "SistemaEstimulacion-Simple\INICIAR.bat"
echo. >> "SistemaEstimulacion-Simple\INICIAR.bat"
echo echo ======================================== >> "SistemaEstimulacion-Simple\INICIAR.bat"
echo echo    Sistema de Estimulacion >> "SistemaEstimulacion-Simple\INICIAR.bat"
echo echo ======================================== >> "SistemaEstimulacion-Simple\INICIAR.bat"
echo echo. >> "SistemaEstimulacion-Simple\INICIAR.bat"
echo echo Verificando puerto 3001... >> "SistemaEstimulacion-Simple\INICIAR.bat"
echo netstat -ano ^| findstr :3001 ^>nul >> "SistemaEstimulacion-Simple\INICIAR.bat"
echo if %%errorlevel%% equ 0 ^( >> "SistemaEstimulacion-Simple\INICIAR.bat"
echo     echo Puerto 3001 ocupado. Cerrando procesos... >> "SistemaEstimulacion-Simple\INICIAR.bat"
echo     for /f "tokens=5" %%%%a in ^('netstat -ano ^| findstr :3001'^) do taskkill /f /pid %%%%a ^>nul 2^>^&1 >> "SistemaEstimulacion-Simple\INICIAR.bat"
echo     timeout /t 3 /nobreak ^>nul >> "SistemaEstimulacion-Simple\INICIAR.bat"
echo ^) >> "SistemaEstimulacion-Simple\INICIAR.bat"
echo echo. >> "SistemaEstimulacion-Simple\INICIAR.bat"
echo echo Iniciando servidor... >> "SistemaEstimulacion-Simple\INICIAR.bat"
echo start /min SistemaEstimulacionMejorado.exe >> "SistemaEstimulacion-Simple\INICIAR.bat"
echo echo. >> "SistemaEstimulacion-Simple\INICIAR.bat"
echo echo Esperando 8 segundos... >> "SistemaEstimulacion-Simple\INICIAR.bat"
echo timeout /t 8 /nobreak ^>nul >> "SistemaEstimulacion-Simple\INICIAR.bat"
echo echo. >> "SistemaEstimulacion-Simple\INICIAR.bat"
echo echo Abriendo navegador... >> "SistemaEstimulacion-Simple\INICIAR.bat"
echo start http://localhost:3001 >> "SistemaEstimulacion-Simple\INICIAR.bat"
echo echo. >> "SistemaEstimulacion-Simple\INICIAR.bat"
echo echo Credenciales: admin / admin123 >> "SistemaEstimulacion-Simple\INICIAR.bat"
echo echo. >> "SistemaEstimulacion-Simple\INICIAR.bat"
echo echo Presione cualquier tecla para cerrar... >> "SistemaEstimulacion-Simple\INICIAR.bat"
echo pause ^>nul >> "SistemaEstimulacion-Simple\INICIAR.bat"
echo echo. >> "SistemaEstimulacion-Simple\INICIAR.bat"
echo echo Cerrando servidor... >> "SistemaEstimulacion-Simple\INICIAR.bat"
echo taskkill /f /im SistemaEstimulacionMejorado.exe ^>nul 2^>^&1 >> "SistemaEstimulacion-Simple\INICIAR.bat"
echo echo Servidor cerrado. >> "SistemaEstimulacion-Simple\INICIAR.bat"
echo pause >> "SistemaEstimulacion-Simple\INICIAR.bat"

REM Crear archivo de instrucciones
echo ======================================== > "SistemaEstimulacion-Simple\INSTRUCCIONES.txt"
echo    SISTEMA DE ESTIMULACION >> "SistemaEstimulacion-Simple\INSTRUCCIONES.txt"
echo ======================================== >> "SistemaEstimulacion-Simple\INSTRUCCIONES.txt"
echo. >> "SistemaEstimulacion-Simple\INSTRUCCIONES.txt"
echo REQUISITOS: >> "SistemaEstimulacion-Simple\INSTRUCCIONES.txt"
echo - MySQL instalado y ejecutandose >> "SistemaEstimulacion-Simple\INSTRUCCIONES.txt"
echo - Contraseña MySQL: Cuba123456 >> "SistemaEstimulacion-Simple\INSTRUCCIONES.txt"
echo. >> "SistemaEstimulacion-Simple\INSTRUCCIONES.txt"
echo COMO USAR: >> "SistemaEstimulacion-Simple\INSTRUCCIONES.txt"
echo 1. Haga doble clic en INICIAR.bat >> "SistemaEstimulacion-Simple\INSTRUCCIONES.txt"
echo 2. Espere a que se abra el navegador >> "SistemaEstimulacion-Simple\INSTRUCCIONES.txt"
echo 3. Inicie sesion con: admin / admin123 >> "SistemaEstimulacion-Simple\INSTRUCCIONES.txt"
echo. >> "SistemaEstimulacion-Simple\INSTRUCCIONES.txt"
echo SI NO FUNCIONA: >> "SistemaEstimulacion-Simple\INSTRUCCIONES.txt"
echo - Verifique que MySQL este ejecutandose >> "SistemaEstimulacion-Simple\INSTRUCCIONES.txt"
echo - Cierre otros programas que usen puerto 3001 >> "SistemaEstimulacion-Simple\INSTRUCCIONES.txt"
echo - Reinicie el script >> "SistemaEstimulacion-Simple\INSTRUCCIONES.txt"
echo ======================================== >> "SistemaEstimulacion-Simple\INSTRUCCIONES.txt"

echo.
echo ========================================
echo    Paquete creado exitosamente!
echo ========================================
echo.
echo Ubicacion: SistemaEstimulacion-Simple\
echo.
echo Archivos incluidos:
echo - SistemaEstimulacionMejorado.exe
echo - INICIAR.bat (script de inicio)
echo - config.env (configuracion)
echo - app\ (archivos frontend)
echo - INSTRUCCIONES.txt
echo.
echo Para usar:
echo 1. Vaya a la carpeta SistemaEstimulacion-Simple
echo 2. Haga doble clic en INICIAR.bat
echo.
pause 
