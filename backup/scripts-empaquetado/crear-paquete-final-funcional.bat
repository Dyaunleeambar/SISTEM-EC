@echo off
title Creando Paquete Final Funcional
color 0A

echo ========================================
echo    Creando Paquete Final Funcional
echo ========================================
echo.

REM Crear directorio del paquete final funcional
if exist "SistemaEstimulacion-Funcional" rmdir /s /q "SistemaEstimulacion-Funcional"
mkdir "SistemaEstimulacion-Funcional"

echo Copiando archivos necesarios...

REM Copiar el ejecutable actual
copy "SistemaEstimulacionMejorado.exe" "SistemaEstimulacion-Funcional\"

REM Copiar archivos de configuración
copy "config.env" "SistemaEstimulacion-Funcional\"

REM Crear directorio app y copiar archivos frontend
mkdir "SistemaEstimulacion-Funcional\app"
copy "index.html" "SistemaEstimulacion-Funcional\app\"
copy "app.js" "SistemaEstimulacion-Funcional\app\"
copy "styles.css" "SistemaEstimulacion-Funcional\app\"
copy "logic.js" "SistemaEstimulacion-Funcional\app\"

REM Crear script de inicio simple
echo @echo off > "SistemaEstimulacion-Funcional\INICIAR.bat"
echo title Sistema de Estimulacion - Version Funcional >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo color 0A >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo. >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo echo ======================================== >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo echo    Sistema de Estimulacion >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo echo    Version Funcional >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo echo ======================================== >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo echo. >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo echo Verificando puerto 3001... >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo netstat -ano ^| findstr :3001 ^>nul >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo if %%errorlevel%% equ 0 ^( >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo     echo [ADVERTENCIA] Puerto 3001 ocupado. >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo     echo Cerrando procesos existentes... >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo     for /f "tokens=5" %%%%a in ^('netstat -ano ^| findstr :3001'^) do ^( >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo         echo Cerrando PID: %%%%a >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo         taskkill /f /pid %%%%a ^>nul 2^>^&1 >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo     ^) >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo     timeout /t 3 /nobreak ^>nul >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo     echo Puerto liberado. >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo ^) else ^( >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo     echo Puerto 3001 libre. >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo ^) >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo. >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo echo Iniciando servidor... >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo echo NOTA: Si aparece una ventana negra, es normal. >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo echo El servidor se ejecuta en segundo plano. >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo echo. >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo start /min SistemaEstimulacionMejorado.exe >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo. >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo echo Esperando que el servidor esté listo... >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo echo. >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo REM Esperar y verificar >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo set /a attempts=0 >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo :wait_loop >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo timeout /t 2 /nobreak ^>nul >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo set /a attempts+=1 >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo. >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo REM Verificar si responde >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:3001' -TimeoutSec 3 ^| Out-Null; exit 0 } catch { exit 1 }" ^>nul 2^>^&1 >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo if %%errorlevel%% equ 0 ^( >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo     goto server_ready >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo ^) >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo. >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo if %%attempts%% lss 15 ^( >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo     echo Esperando... ^(intento %%attempts%%/15^) >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo     goto wait_loop >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo ^) else ^( >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo     echo. >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo     echo [ERROR] El servidor no responde después de 30 segundos. >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo     echo. >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo     echo Posibles causas: >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo     echo 1. MySQL no está ejecutándose >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo     echo 2. Contraseña de MySQL incorrecta ^(debe ser: Cuba123456^) >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo     echo 3. Puerto 3001 bloqueado por firewall >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo     echo. >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo     echo Soluciones: >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo     echo - Reinicie MySQL >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo     echo - Verifique la contraseña >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo     echo - Desactive temporalmente el firewall >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo     echo. >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo     pause >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo     exit /b 1 >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo ^) >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo. >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo :server_ready >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo echo. >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo echo ======================================== >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo echo    Servidor iniciado correctamente! >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo echo ======================================== >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo echo. >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo echo Abriendo navegador... >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo start http://localhost:3001 >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo. >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo echo Credenciales de acceso: >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo echo - Usuario: admin >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo echo - Contraseña: admin123 >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo echo. >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo echo El servidor está ejecutándose en segundo plano. >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo echo Para cerrar, presione cualquier tecla... >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo pause ^>nul >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo. >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo echo Cerrando servidor... >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo taskkill /f /im SistemaEstimulacionMejorado.exe ^>nul 2^>^&1 >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo echo Servidor cerrado correctamente. >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo echo. >> "SistemaEstimulacion-Funcional\INICIAR.bat"
echo pause >> "SistemaEstimulacion-Funcional\INICIAR.bat"

REM Crear archivo README funcional
echo ======================================== > "SistemaEstimulacion-Funcional\README.txt"
echo    SISTEMA DE ESTIMULACION >> "SistemaEstimulacion-Funcional\README.txt"
echo    VERSION FUNCIONAL >> "SistemaEstimulacion-Funcional\README.txt"
echo ======================================== >> "SistemaEstimulacion-Funcional\README.txt"
echo. >> "SistemaEstimulacion-Funcional\README.txt"
echo REQUISITOS PREVIOS: >> "SistemaEstimulacion-Funcional\README.txt"
echo - MySQL instalado y ejecutándose >> "SistemaEstimulacion-Funcional\README.txt"
echo - Contraseña de MySQL: Cuba123456 >> "SistemaEstimulacion-Funcional\README.txt"
echo - Puerto 3001 disponible >> "SistemaEstimulacion-Funcional\README.txt"
echo. >> "SistemaEstimulacion-Funcional\README.txt"
echo COMO USAR: >> "SistemaEstimulacion-Funcional\README.txt"
echo 1. Haga doble clic en "INICIAR.bat" >> "SistemaEstimulacion-Funcional\README.txt"
echo 2. Espere a que aparezca "Servidor iniciado correctamente!" >> "SistemaEstimulacion-Funcional\README.txt"
echo 3. El navegador se abrirá automáticamente >> "SistemaEstimulacion-Funcional\README.txt"
echo 4. Inicie sesión con: admin / admin123 >> "SistemaEstimulacion-Funcional\README.txt"
echo. >> "SistemaEstimulacion-Funcional\README.txt"
echo SI HAY PROBLEMAS: >> "SistemaEstimulacion-Funcional\README.txt"
echo - Verifique que MySQL esté ejecutándose >> "SistemaEstimulacion-Funcional\README.txt"
echo - Verifique la contraseña: Cuba123456 >> "SistemaEstimulacion-Funcional\README.txt"
echo - Cierre otros programas que usen puerto 3001 >> "SistemaEstimulacion-Funcional\README.txt"
echo - Reinicie el script >> "SistemaEstimulacion-Funcional\README.txt"
echo. >> "SistemaEstimulacion-Funcional\README.txt"
echo FUNCIONES DISPONIBLES: >> "SistemaEstimulacion-Funcional\README.txt"
echo - Gestión completa de colaboradores >> "SistemaEstimulacion-Funcional\README.txt"
echo - Sistema de autenticación con roles >> "SistemaEstimulacion-Funcional\README.txt"
echo - Exportación a Excel >> "SistemaEstimulacion-Funcional\README.txt"
echo - Auditoría del sistema >> "SistemaEstimulacion-Funcional\README.txt"
echo ======================================== >> "SistemaEstimulacion-Funcional\README.txt"

echo.
echo ========================================
echo    Paquete Funcional creado exitosamente!
echo ========================================
echo.
echo Ubicacion: SistemaEstimulacion-Funcional\
echo.
echo Archivos incluidos:
echo - SistemaEstimulacionMejorado.exe
echo - INICIAR.bat (script mejorado)
echo - config.env (configuracion)
echo - app/ (archivos frontend)
echo - README.txt (instrucciones)
echo.
echo Para usar:
echo 1. Vaya a la carpeta SistemaEstimulacion-Funcional
echo 2. Haga doble clic en INICIAR.bat
echo 3. Espere a que se abra el navegador
echo 4. Inicie sesion con: admin / admin123
echo.
pause 
