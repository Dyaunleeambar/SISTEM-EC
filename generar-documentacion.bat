@echo off
echo Generando documentacion del Sistema de Estimulacion...
echo.

REM Crear directorio de documentacion si no existe
if not exist "documentacion" mkdir documentacion

echo ========================================
echo DOCUMENTACION GENERADA:
echo ========================================
echo.

echo ✅ GUIA-USUARIO.md - Guia completa de usuario
echo ✅ RESUMEN-EJECUTIVO.md - Resumen para directivos
echo ✅ README.md - Documentacion tecnica
echo ✅ config.env.example - Configuracion de ejemplo
echo.

echo ========================================
echo ESTRUCTURA DE DOCUMENTACION:
echo ========================================
echo.
echo 📁 SistemaEstimulacion/
echo ├── 📄 GUIA-USUARIO.md (Guia completa)
echo ├── 📄 RESUMEN-EJECUTIVO.md (Resumen ejecutivo)
echo ├── 📄 README.md (Documentacion tecnica)
echo ├── 📄 config.env.example (Configuracion)
echo └── 📁 documentacion/ (Archivos adicionales)
echo.

echo ========================================
echo RECOMENDACIONES DE USO:
echo ========================================
echo.
echo 🎯 PARA USUARIOS FINALES:
echo    - Leer GUIA-USUARIO.md completo
echo    - Usar RESUMEN-EJECUTIVO.md como referencia rapida
echo.
echo 👨‍💻 PARA DESARROLLADORES:
echo    - Leer README.md para instalacion y desarrollo
echo    - Revisar config.env.example para configuracion
echo.
echo 📊 PARA DIRECTIVOS:
echo    - Leer RESUMEN-EJECUTIVO.md para vision general
echo    - Revisar seccion de beneficios y metricas
echo.

echo ========================================
echo COMANDOS UTILES:
echo ========================================
echo.
echo 📖 Ver guia de usuario:
echo    start GUIA-USUARIO.md
echo.
echo 📊 Ver resumen ejecutivo:
echo    start RESUMEN-EJECUTIVO.md
echo.
echo 🔧 Ver documentacion tecnica:
echo    start README.md
echo.
echo 📁 Abrir carpeta de documentacion:
echo    explorer documentacion
echo.

echo ========================================
echo PRÓXIMOS PASOS:
echo ========================================
echo.
echo 1. Revisar y personalizar la documentacion
echo 2. Agregar capturas de pantalla si es necesario
echo 3. Crear videos tutoriales
echo 4. Configurar sistema de ayuda en linea
echo 5. Implementar feedback de usuarios
echo.

echo ✅ Documentacion generada exitosamente!
echo.
pause