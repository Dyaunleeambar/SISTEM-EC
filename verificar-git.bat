@echo off
REM Script para verificar archivos que se subirán a Git
REM Sistema de Estimulación de Colaboradores

echo ========================================
echo    VERIFICACION DE ARCHIVOS PARA GIT
echo ========================================
echo.

echo 📋 Archivos que SE INCLUIRÁN en Git:
echo.

REM Mostrar archivos principales
echo ✅ ARCHIVOS PRINCIPALES:
echo - package.json
echo - package-lock.json
echo - README.md
echo - GUIA-USUARIO.md
echo - RESUMEN-EJECUTIVO.md
echo - CHANGELOG.md
echo - SISTEMA_RESPALDOS.md
echo - GENERAR-PDF.md
echo.

echo ✅ ARCHIVOS DE LA APLICACION:
echo - index.html
echo - styles.css
echo - app.js
echo - logic.js
echo - server.js
echo - config.env.example
echo.

echo ✅ ARCHIVOS DE ELECTRON:
echo - electron/main.js
echo - electron/server.js
echo - assets/icon.ico
echo - assets/icon.png
echo.

echo ✅ SISTEMA DE RESPALDOS:
echo - backup/backup_mysql.bat
echo - backup/restore_mysql.bat
echo - backup/configurar_respaldo_automatico.bat
echo - backup/gestionar_respaldos.bat
echo - backup/README_RESPALDOS.md
echo - respaldo_rapido.bat
echo.

echo ✅ SISTEMA DE PDF:
echo - convertir-pdf.js
echo - convertir-pdf.bat
echo - docs/ (directorio con PDFs)
echo.

echo ✅ ARCHIVOS DE CONFIGURACION:
echo - .gitignore
echo - LICENSE
echo - iniciar-aplicacion.bat
echo.

echo ========================================
echo    ARCHIVOS QUE SE EXCLUIRÁN
echo ========================================
echo.

echo ❌ ARCHIVOS EXCLUIDOS (por seguridad):
echo - config.env (contiene credenciales)
echo - node_modules/ (dependencias)
echo - backup/backups/ (respaldos de datos)
echo - logs/ (archivos de log)
echo - .env (variables de entorno)
echo.

echo ========================================
echo    COMANDOS PARA SUBIR A GITHUB
echo ========================================
echo.

echo 1. Inicializar repositorio (si es nuevo):
echo    git init
echo.

echo 2. Agregar todos los archivos:
echo    git add .
echo.

echo 3. Hacer commit inicial:
echo    git commit -m "Sistema de Estimulación v2.0 - Con respaldos automáticos y PDFs"
echo.

echo 4. Agregar repositorio remoto (reemplazar URL):
echo    git remote add origin https://github.com/tu-usuario/SistemaEstimulacion.git
echo.

echo 5. Subir a GitHub:
echo    git push -u origin main
echo.

echo ========================================
echo    VERIFICACION DE ARCHIVOS
echo ========================================
echo.

echo 📊 Archivos que se agregarán:
git status --porcelain

echo.
echo 📁 Total de archivos en el proyecto:
dir /b | find /c /v ""

echo.
echo Presione cualquier tecla para continuar...
pause >nul 
