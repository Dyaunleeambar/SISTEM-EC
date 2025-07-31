@echo off
title Crear Paquete Completo - Sistema de Estimulación
echo ====================================================
echo    CREANDO PAQUETE COMPLETO
echo    Sistema de Estimulación de Colaboradores
echo ====================================================
echo.

REM Crear carpeta de distribución
if not exist "dist-package" mkdir dist-package
if not exist "dist-package\app" mkdir dist-package\app

REM Copiar archivos necesarios
echo Copiando archivos...
copy "SistemaEstimulacion.exe" "dist-package\"
copy "index.html" "dist-package\app\"
copy "app.js" "dist-package\app\"
copy "styles.css" "dist-package\app\"
copy "logic.js" "dist-package\app\"
copy "config.env" "dist-package\"

REM Crear script de inicio
(
    echo @echo off
    echo title Sistema de Estimulación de Colaboradores
    echo echo ========================================
    echo echo    Sistema de Estimulación
    echo echo    Iniciando servidor...
    echo echo ========================================
    echo echo.
    echo echo Iniciando servidor backend...
    echo start /min SistemaEstimulacion.exe
    echo.
    echo echo Esperando que el servidor esté listo...
    echo timeout /t 5 /nobreak ^>nul
    echo.
    echo echo Abriendo aplicación en el navegador...
    echo start http://localhost:3001
    echo.
    echo echo Servidor iniciado en segundo plano.
    echo echo Para cerrar, presione cualquier tecla...
    echo pause
    echo.
    echo echo Cerrando servidor...
    echo taskkill /f /im SistemaEstimulacion.exe ^>nul 2^>^&1
    echo echo Servidor cerrado.
    echo pause
) > "dist-package\Iniciar Sistema de Estimulación.bat"

REM Crear archivo de instrucciones
(
    echo ========================================
    echo    SISTEMA DE ESTIMULACIÓN
    echo    Paquete Completo
    echo ========================================
    echo.
    echo INSTRUCCIONES DE INSTALACIÓN:
    echo.
    echo 1. Asegúrese de que MySQL esté instalado y ejecutándose
    echo 2. Configure MySQL con la contraseña: Cuba123456
    echo 3. Haga doble clic en "Iniciar Sistema de Estimulación.bat"
    echo 4. Espere a que se abra el navegador automáticamente
    echo 5. Inicie sesión con las credenciales por defecto:
    echo    Usuario: admin
    echo    Contraseña: admin123
    echo.
    echo ARCHIVOS INCLUIDOS:
    echo - SistemaEstimulacion.exe (Servidor backend)
    echo - Iniciar Sistema de Estimulación.bat (Script de inicio)
    echo - app/ (Archivos de la interfaz web)
    echo - config.env (Configuración del sistema)
    echo.
    echo REQUISITOS:
    echo - Windows 10/11
    echo - MySQL 8.0+ (con contraseña: Cuba123456)
    echo - Navegador web (Chrome, Firefox, Edge)
    echo.
    echo SOLUCIÓN DE PROBLEMAS:
    echo - Si el puerto 3001 está ocupado, cierre otras aplicaciones
    echo - Si MySQL no conecta, verifique que esté ejecutándose
    echo - Para cerrar el servidor, presione Ctrl+C en la consola
    echo.
    echo ========================================
) > "dist-package\INSTRUCCIONES.txt"

REM Crear archivo README
(
    echo # Sistema de Estimulación de Colaboradores
    echo.
    echo ## Instalación Rápida
    echo.
    echo 1. **Instalar MySQL:**
    echo    - Descargue desde: https://dev.mysql.com/downloads/
    echo    - Configure contraseña como: `Cuba123456`
    echo.
    echo 2. **Ejecutar la aplicación:**
    echo    - Haga doble clic en `Iniciar Sistema de Estimulación.bat`
    echo    - Espere a que se abra el navegador
    echo    - Inicie sesión con: `admin` / `admin123`
    echo.
    echo ## Características
    echo.
    echo - ✅ Gestión completa de colaboradores
    echo - ✅ Cálculos automáticos de estimulación
    echo - ✅ Autenticación JWT con roles
    echo - ✅ Exportación a Excel
    echo - ✅ Interfaz moderna y responsiva
    echo.
    echo ## Soporte
    echo.
    echo Para problemas técnicos, consulte `INSTRUCCIONES.txt`
    echo.
) > "dist-package\README.md"

echo.
echo ====================================================
echo    PAQUETE COMPLETO CREADO EXITOSAMENTE
echo ====================================================
echo.
echo ✓ Ejecutable del servidor creado
echo ✓ Script de inicio creado
echo ✓ Archivos de la aplicación copiados
echo ✓ Instrucciones incluidas
echo.
echo Ubicación del paquete: dist-package\
echo.
echo Contenido del paquete:
echo - SistemaEstimulacion.exe (Servidor backend)
echo - Iniciar Sistema de Estimulación.bat (Script de inicio)
echo - app\ (Archivos de la interfaz web)
echo - config.env (Configuración)
echo - INSTRUCCIONES.txt (Instrucciones detalladas)
echo - README.md (Documentación)
echo.
echo Para distribuir:
echo 1. Comprima la carpeta dist-package\
echo 2. Envíe el archivo ZIP al usuario final
echo 3. El usuario solo necesita extraer y ejecutar
echo.
pause 
