@echo off
title Creando Paquete Completo Final
color 0A

echo ========================================
echo    Creando Paquete Completo Final
echo ========================================
echo.

REM Crear directorio del paquete final
if exist "SistemaEstimulacion-Final" rmdir /s /q "SistemaEstimulacion-Final"
mkdir "SistemaEstimulacion-Final"

echo Copiando archivos necesarios...

REM Copiar el ejecutable
copy "SistemaEstimulacionMejorado.exe" "SistemaEstimulacion-Final\"

REM Copiar archivos de configuración
copy "config.env" "SistemaEstimulacion-Final\"

REM Crear directorio app y copiar archivos frontend
mkdir "SistemaEstimulacion-Final\app"
copy "index.html" "SistemaEstimulacion-Final\app\"
copy "app.js" "SistemaEstimulacion-Final\app\"
copy "styles.css" "SistemaEstimulacion-Final\app\"
copy "logic.js" "SistemaEstimulacion-Final\app\"

REM Crear script de inicio mejorado
echo @echo off > "SistemaEstimulacion-Final\INICIAR.bat"
echo title Sistema de Estimulacion - Version Final >> "SistemaEstimulacion-Final\INICIAR.bat"
echo color 0A >> "SistemaEstimulacion-Final\INICIAR.bat"
echo. >> "SistemaEstimulacion-Final\INICIAR.bat"
echo echo ======================================== >> "SistemaEstimulacion-Final\INICIAR.bat"
echo echo    Sistema de Estimulacion >> "SistemaEstimulacion-Final\INICIAR.bat"
echo echo    Version Final >> "SistemaEstimulacion-Final\INICIAR.bat"
echo echo ======================================== >> "SistemaEstimulacion-Final\INICIAR.bat"
echo echo. >> "SistemaEstimulacion-Final\INICIAR.bat"
echo echo Verificando MySQL... >> "SistemaEstimulacion-Final\INICIAR.bat"
echo sc query mysql ^>nul 2^>^&1 >> "SistemaEstimulacion-Final\INICIAR.bat"
echo if %%errorlevel%% neq 0 ^( >> "SistemaEstimulacion-Final\INICIAR.bat"
echo     echo [ADVERTENCIA] MySQL no parece estar ejecutandose. >> "SistemaEstimulacion-Final\INICIAR.bat"
echo     echo Por favor, inicie MySQL antes de continuar. >> "SistemaEstimulacion-Final\INICIAR.bat"
echo     echo. >> "SistemaEstimulacion-Final\INICIAR.bat"
echo     echo Para iniciar MySQL: >> "SistemaEstimulacion-Final\INICIAR.bat"
echo     echo 1. Abra el Administrador de servicios ^(services.msc^) >> "SistemaEstimulacion-Final\INICIAR.bat"
echo     echo 2. Busque "MySQL" o "MySQL80" >> "SistemaEstimulacion-Final\INICIAR.bat"
echo     echo 3. Haga clic en "Iniciar" >> "SistemaEstimulacion-Final\INICIAR.bat"
echo     echo. >> "SistemaEstimulacion-Final\INICIAR.bat"
echo     pause >> "SistemaEstimulacion-Final\INICIAR.bat"
echo     exit /b 1 >> "SistemaEstimulacion-Final\INICIAR.bat"
echo ^) >> "SistemaEstimulacion-Final\INICIAR.bat"
echo echo MySQL OK. >> "SistemaEstimulacion-Final\INICIAR.bat"
echo. >> "SistemaEstimulacion-Final\INICIAR.bat"
echo echo Verificando puerto 3001... >> "SistemaEstimulacion-Final\INICIAR.bat"
echo netstat -ano ^| findstr :3001 ^>nul >> "SistemaEstimulacion-Final\INICIAR.bat"
echo if %%errorlevel%% equ 0 ^( >> "SistemaEstimulacion-Final\INICIAR.bat"
echo     echo [ADVERTENCIA] Puerto 3001 ocupado. >> "SistemaEstimulacion-Final\INICIAR.bat"
echo     echo Cerrando procesos existentes... >> "SistemaEstimulacion-Final\INICIAR.bat"
echo     for /f "tokens=5" %%%%a in ^('netstat -ano ^| findstr :3001'^) do ^( >> "SistemaEstimulacion-Final\INICIAR.bat"
echo         echo Cerrando PID: %%%%a >> "SistemaEstimulacion-Final\INICIAR.bat"
echo         taskkill /f /pid %%%%a ^>nul 2^>^&1 >> "SistemaEstimulacion-Final\INICIAR.bat"
echo     ^) >> "SistemaEstimulacion-Final\INICIAR.bat"
echo     timeout /t 3 /nobreak ^>nul >> "SistemaEstimulacion-Final\INICIAR.bat"
echo     echo Puerto liberado. >> "SistemaEstimulacion-Final\INICIAR.bat"
echo ^) else ^( >> "SistemaEstimulacion-Final\INICIAR.bat"
echo     echo Puerto 3001 libre. >> "SistemaEstimulacion-Final\INICIAR.bat"
echo ^) >> "SistemaEstimulacion-Final\INICIAR.bat"
echo. >> "SistemaEstimulacion-Final\INICIAR.bat"
echo echo Iniciando servidor... >> "SistemaEstimulacion-Final\INICIAR.bat"
echo echo NOTA: Si aparece una ventana negra, es normal. >> "SistemaEstimulacion-Final\INICIAR.bat"
echo echo El servidor se ejecuta en segundo plano. >> "SistemaEstimulacion-Final\INICIAR.bat"
echo echo. >> "SistemaEstimulacion-Final\INICIAR.bat"
echo start /min SistemaEstimulacionMejorado.exe >> "SistemaEstimulacion-Final\INICIAR.bat"
echo. >> "SistemaEstimulacion-Final\INICIAR.bat"
echo echo Esperando que el servidor esté listo... >> "SistemaEstimulacion-Final\INICIAR.bat"
echo echo. >> "SistemaEstimulacion-Final\INICIAR.bat"
echo REM Esperar y verificar >> "SistemaEstimulacion-Final\INICIAR.bat"
echo set /a attempts=0 >> "SistemaEstimulacion-Final\INICIAR.bat"
echo :wait_loop >> "SistemaEstimulacion-Final\INICIAR.bat"
echo timeout /t 2 /nobreak ^>nul >> "SistemaEstimulacion-Final\INICIAR.bat"
echo set /a attempts+=1 >> "SistemaEstimulacion-Final\INICIAR.bat"
echo. >> "SistemaEstimulacion-Final\INICIAR.bat"
echo REM Verificar si responde >> "SistemaEstimulacion-Final\INICIAR.bat"
echo powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:3001' -TimeoutSec 3 ^| Out-Null; exit 0 } catch { exit 1 }" ^>nul 2^>^&1 >> "SistemaEstimulacion-Final\INICIAR.bat"
echo if %%errorlevel%% equ 0 ^( >> "SistemaEstimulacion-Final\INICIAR.bat"
echo     goto server_ready >> "SistemaEstimulacion-Final\INICIAR.bat"
echo ^) >> "SistemaEstimulacion-Final\INICIAR.bat"
echo. >> "SistemaEstimulacion-Final\INICIAR.bat"
echo if %%attempts%% lss 15 ^( >> "SistemaEstimulacion-Final\INICIAR.bat"
echo     echo Esperando... ^(intento %%attempts%%/15^) >> "SistemaEstimulacion-Final\INICIAR.bat"
echo     goto wait_loop >> "SistemaEstimulacion-Final\INICIAR.bat"
echo ^) else ^( >> "SistemaEstimulacion-Final\INICIAR.bat"
echo     echo. >> "SistemaEstimulacion-Final\INICIAR.bat"
echo     echo [ERROR] El servidor no responde después de 30 segundos. >> "SistemaEstimulacion-Final\INICIAR.bat"
echo     echo. >> "SistemaEstimulacion-Final\INICIAR.bat"
echo     echo Posibles causas: >> "SistemaEstimulacion-Final\INICIAR.bat"
echo     echo 1. MySQL no está ejecutándose >> "SistemaEstimulacion-Final\INICIAR.bat"
echo     echo 2. Contraseña de MySQL incorrecta ^(debe ser: Cuba123456^) >> "SistemaEstimulacion-Final\INICIAR.bat"
echo     echo 3. Puerto 3001 bloqueado por firewall >> "SistemaEstimulacion-Final\INICIAR.bat"
echo     echo. >> "SistemaEstimulacion-Final\INICIAR.bat"
echo     echo Soluciones: >> "SistemaEstimulacion-Final\INICIAR.bat"
echo     echo - Reinicie MySQL >> "SistemaEstimulacion-Final\INICIAR.bat"
echo     echo - Verifique la contraseña >> "SistemaEstimulacion-Final\INICIAR.bat"
echo     echo - Desactive temporalmente el firewall >> "SistemaEstimulacion-Final\INICIAR.bat"
echo     echo. >> "SistemaEstimulacion-Final\INICIAR.bat"
echo     pause >> "SistemaEstimulacion-Final\INICIAR.bat"
echo     exit /b 1 >> "SistemaEstimulacion-Final\INICIAR.bat"
echo ^) >> "SistemaEstimulacion-Final\INICIAR.bat"
echo. >> "SistemaEstimulacion-Final\INICIAR.bat"
echo :server_ready >> "SistemaEstimulacion-Final\INICIAR.bat"
echo echo. >> "SistemaEstimulacion-Final\INICIAR.bat"
echo echo ======================================== >> "SistemaEstimulacion-Final\INICIAR.bat"
echo echo    Servidor iniciado correctamente! >> "SistemaEstimulacion-Final\INICIAR.bat"
echo echo ======================================== >> "SistemaEstimulacion-Final\INICIAR.bat"
echo echo. >> "SistemaEstimulacion-Final\INICIAR.bat"
echo echo Abriendo navegador... >> "SistemaEstimulacion-Final\INICIAR.bat"
echo start http://localhost:3001 >> "SistemaEstimulacion-Final\INICIAR.bat"
echo. >> "SistemaEstimulacion-Final\INICIAR.bat"
echo echo Credenciales de acceso: >> "SistemaEstimulacion-Final\INICIAR.bat"
echo echo - Usuario: admin >> "SistemaEstimulacion-Final\INICIAR.bat"
echo echo - Contraseña: admin123 >> "SistemaEstimulacion-Final\INICIAR.bat"
echo echo. >> "SistemaEstimulacion-Final\INICIAR.bat"
echo echo El servidor está ejecutándose en segundo plano. >> "SistemaEstimulacion-Final\INICIAR.bat"
echo echo Para cerrar, presione cualquier tecla... >> "SistemaEstimulacion-Final\INICIAR.bat"
echo pause ^>nul >> "SistemaEstimulacion-Final\INICIAR.bat"
echo. >> "SistemaEstimulacion-Final\INICIAR.bat"
echo echo Cerrando servidor... >> "SistemaEstimulacion-Final\INICIAR.bat"
echo taskkill /f /im SistemaEstimulacionMejorado.exe ^>nul 2^>^&1 >> "SistemaEstimulacion-Final\INICIAR.bat"
echo echo Servidor cerrado correctamente. >> "SistemaEstimulacion-Final\INICIAR.bat"
echo echo. >> "SistemaEstimulacion-Final\INICIAR.bat"
echo pause >> "SistemaEstimulacion-Final\INICIAR.bat"

REM Crear archivo README final
echo ======================================== > "SistemaEstimulacion-Final\README.txt"
echo    SISTEMA DE ESTIMULACION >> "SistemaEstimulacion-Final\README.txt"
echo    VERSION FINAL >> "SistemaEstimulacion-Final\README.txt"
echo ======================================== >> "SistemaEstimulacion-Final\README.txt"
echo. >> "SistemaEstimulacion-Final\README.txt"
echo REQUISITOS PREVIOS: >> "SistemaEstimulacion-Final\README.txt"
echo - MySQL instalado y ejecutándose >> "SistemaEstimulacion-Final\README.txt"
echo - Contraseña de MySQL: Cuba123456 >> "SistemaEstimulacion-Final\README.txt"
echo - Puerto 3001 disponible >> "SistemaEstimulacion-Final\README.txt"
echo. >> "SistemaEstimulacion-Final\README.txt"
echo COMO USAR: >> "SistemaEstimulacion-Final\README.txt"
echo 1. Haga doble clic en "INICIAR.bat" >> "SistemaEstimulacion-Final\README.txt"
echo 2. Espere a que aparezca "Servidor iniciado correctamente!" >> "SistemaEstimulacion-Final\README.txt"
echo 3. El navegador se abrirá automáticamente >> "SistemaEstimulacion-Final\README.txt"
echo 4. Inicie sesión con: admin / admin123 >> "SistemaEstimulacion-Final\README.txt"
echo. >> "SistemaEstimulacion-Final\README.txt"
echo SI HAY PROBLEMAS: >> "SistemaEstimulacion-Final\README.txt"
echo - Verifique que MySQL esté ejecutándose >> "SistemaEstimulacion-Final\README.txt"
echo - Verifique la contraseña: Cuba123456 >> "SistemaEstimulacion-Final\README.txt"
echo - Cierre otros programas que usen puerto 3001 >> "SistemaEstimulacion-Final\README.txt"
echo - Reinicie el script >> "SistemaEstimulacion-Final\README.txt"
echo. >> "SistemaEstimulacion-Final\README.txt"
echo FUNCIONES DISPONIBLES: >> "SistemaEstimulacion-Final\README.txt"
echo - Gestión completa de colaboradores >> "SistemaEstimulacion-Final\README.txt"
echo - Sistema de autenticación con roles >> "SistemaEstimulacion-Final\README.txt"
echo - Exportación a Excel >> "SistemaEstimulacion-Final\README.txt"
echo - Auditoría del sistema >> "SistemaEstimulacion-Final\README.txt"
echo ======================================== >> "SistemaEstimulacion-Final\README.txt"

echo.
echo ========================================
echo    Paquete Final creado exitosamente!
echo ========================================
echo.
echo Ubicacion: SistemaEstimulacion-Final\
echo.
echo Archivos incluidos:
echo - SistemaEstimulacionMejorado.exe
echo - INICIAR.bat (script mejorado)
echo - config.env (configuracion)
echo - app/ (archivos frontend)
echo - README.txt (instrucciones)
echo.
echo Para usar:
echo 1. Vaya a la carpeta SistemaEstimulacion-Final
echo 2. Haga doble clic en INICIAR.bat
echo 3. Espere a que se abra el navegador
echo 4. Inicie sesion con: admin / admin123
echo.
pause 
