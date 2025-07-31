@echo off
REM Script para subir el proyecto a GitHub
REM Sistema de Estimulación de Colaboradores

echo ========================================
echo    SUBIDA A GITHUB - SISTEMA ESTIMULACION
echo ========================================
echo.

echo 🚀 Iniciando proceso de subida a GitHub...
echo.

REM Verificar si git está instalado
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git no está instalado
    echo Por favor instale Git desde: https://git-scm.com/
    echo.
    pause
    exit /b 1
)

echo ✅ Git está instalado
echo.

REM Verificar si es un repositorio git
if not exist ".git" (
    echo 📁 Inicializando repositorio Git...
    git init
    echo ✅ Repositorio inicializado
) else (
    echo ✅ Repositorio Git ya existe
)

echo.

REM Mostrar archivos que se van a agregar
echo 📋 Archivos que se agregarán:
git status --porcelain
echo.

REM Preguntar si continuar
set /p continuar="¿Desea continuar con la subida? (S/N): "
if /i not "%continuar%"=="S" (
    echo Subida cancelada.
    pause
    exit /b 0
)

echo.

REM Agregar todos los archivos
echo 📦 Agregando archivos...
git add .
if %errorlevel% neq 0 (
    echo ❌ Error agregando archivos
    pause
    exit /b 1
)
echo ✅ Archivos agregados

REM Hacer commit
echo 📝 Creando commit...
git commit -m "Sistema de Estimulación v2.0 - Con respaldos automáticos y PDFs"
if %errorlevel% neq 0 (
    echo ❌ Error creando commit
    pause
    exit /b 1
)
echo ✅ Commit creado

echo.

REM Preguntar por la URL del repositorio
echo ========================================
echo    CONFIGURACION DEL REPOSITORIO
echo ========================================
echo.
echo Por favor ingrese la URL de su repositorio en GitHub
echo Ejemplo: https://github.com/tu-usuario/SistemaEstimulacion.git
echo.

set /p repo_url="URL del repositorio: "

if "%repo_url%"=="" (
    echo ❌ URL no válida
    pause
    exit /b 1
)

REM Agregar repositorio remoto
echo 🔗 Agregando repositorio remoto...
git remote remove origin 2>nul
git remote add origin "%repo_url%"
if %errorlevel% neq 0 (
    echo ❌ Error agregando repositorio remoto
    pause
    exit /b 1
)
echo ✅ Repositorio remoto agregado

REM Subir a GitHub
echo 🚀 Subiendo a GitHub...
git push -u origin main
if %errorlevel% neq 0 (
    echo.
    echo ⚠️  Posibles problemas:
    echo 1. Verificar que la URL sea correcta
    echo 2. Verificar credenciales de GitHub
    echo 3. Verificar que el repositorio exista en GitHub
    echo.
    echo 💡 Comandos manuales:
    echo git remote -v
    echo git push -u origin main
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo    ✅ SUBIDA EXITOSA
echo ========================================
echo.
echo 🎉 El proyecto se ha subido correctamente a GitHub
echo 📁 Repositorio: %repo_url%
echo.
echo 📋 Archivos incluidos:
echo - ✅ Código fuente completo
echo - ✅ Documentación actualizada
echo - ✅ Sistema de respaldos
echo - ✅ PDFs generados
echo - ✅ Configuración de Electron
echo.
echo 📚 Documentación disponible:
echo - README.md: Documentación técnica
echo - GUIA-USUARIO.md: Guía de usuario
echo - RESUMEN-EJECUTIVO.md: Resumen ejecutivo
echo - SISTEMA_RESPALDOS.md: Manual de respaldos
echo - CHANGELOG.md: Historial de cambios
echo.
echo 🎯 Próximos pasos:
echo 1. Verificar que todos los archivos estén en GitHub
echo 2. Configurar el README.md en GitHub
echo 3. Crear releases para versiones importantes
echo 4. Compartir el repositorio con el equipo
echo.

echo Presione cualquier tecla para continuar...
pause >nul 
