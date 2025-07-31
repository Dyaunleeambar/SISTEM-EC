@echo off
REM Script para convertir documentación a PDF
REM Sistema de Estimulación de Colaboradores

echo ========================================
echo    CONVERSION DE DOCUMENTACION A PDF
echo ========================================
echo.

REM Crear directorio docs si no existe
if not exist "docs" mkdir docs

echo 📁 Creando directorio de documentación...
echo.

echo 📋 Archivos disponibles para conversión:
echo.
echo 1. README.md - Documentación del Sistema
echo 2. GUIA-USUARIO.md - Guía de Usuario
echo 3. RESUMEN-EJECUTIVO.md - Resumen Ejecutivo
echo 4. SISTEMA_RESPALDOS.md - Sistema de Respaldos
echo 5. CHANGELOG.md - Historial de Cambios
echo.

echo ========================================
echo    INSTRUCCIONES DE CONVERSION
echo ========================================
echo.
echo Opción A: Conversión Automática (Recomendada)
echo - Ejecutar: node convertir-pdf.js
echo - Requiere: npm install puppeteer marked
echo.
echo Opción B: Conversión Manual
echo - Usar herramientas online como:
echo   * https://www.markdowntopdf.com/
echo   * https://md-to-pdf.fly.dev/
echo   * https://www.markdowntopdf.com/
echo.
echo Opción C: Usar herramientas locales
echo - Pandoc (si está instalado)
echo - Typora (editor Markdown)
echo.

echo ========================================
echo    CONVERSION AUTOMATICA
echo ========================================
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado
    echo Por favor instale Node.js desde: https://nodejs.org/
    echo.
    goto manual
)

REM Verificar si existen las dependencias
if not exist "node_modules" (
    echo 📦 Instalando dependencias...
    npm install puppeteer marked
    if %errorlevel% neq 0 (
        echo ❌ Error instalando dependencias
        echo.
        goto manual
    )
)

echo 🚀 Iniciando conversión automática...
node convertir-pdf.js

if %errorlevel% equ 0 (
    echo.
    echo ✅ Conversión completada exitosamente!
    echo 📁 Los archivos PDF están en el directorio "docs"
    echo.
    goto mostrar_archivos
) else (
    echo ❌ Error en la conversión automática
    echo.
    goto manual
)

:manual
echo ========================================
echo    CONVERSION MANUAL
echo ========================================
echo.
echo Para convertir manualmente:
echo.
echo 1. Abrir el archivo Markdown en un editor
echo 2. Copiar todo el contenido
echo 3. Ir a https://www.markdowntopdf.com/
echo 4. Pegar el contenido
echo 5. Descargar el PDF
echo 6. Guardar en la carpeta "docs"
echo.

echo 📋 Archivos recomendados para convertir:
echo.
echo ✅ README.md - Documentación principal
echo ✅ GUIA-USUARIO.md - Guía para usuarios
echo ✅ RESUMEN-EJECUTIVO.md - Resumen ejecutivo
echo ✅ SISTEMA_RESPALDOS.md - Sistema de respaldos
echo.

:mostrar_archivos
echo ========================================
echo    ARCHIVOS PDF GENERADOS
echo ========================================
echo.

if exist "docs\*.pdf" (
    dir docs\*.pdf /b
    echo.
    echo 📊 Total de archivos PDF: 
    dir docs\*.pdf /b | find /c /v ""
) else (
    echo 📁 No se encontraron archivos PDF en el directorio "docs"
    echo.
    echo 💡 Sugerencia: Use la conversión automática o manual
)

echo.
echo ========================================
echo    INFORMACION ADICIONAL
echo ========================================
echo.
echo 📚 Documentación disponible:
echo - README.md: Documentación técnica completa
echo - GUIA-USUARIO.md: Guía paso a paso
echo - RESUMEN-EJECUTIVO.md: Resumen para ejecutivos
echo - SISTEMA_RESPALDOS.md: Manual de respaldos
echo - CHANGELOG.md: Historial de cambios
echo.
echo 🎯 Archivos más importantes para el usuario final:
echo 1. GUIA-USUARIO.pdf - Guía completa de uso
echo 2. RESUMEN-EJECUTIVO.pdf - Resumen ejecutivo
echo 3. SISTEMA_RESPALDOS.pdf - Manual de respaldos
echo.

echo Presione cualquier tecla para continuar...
pause >nul 
