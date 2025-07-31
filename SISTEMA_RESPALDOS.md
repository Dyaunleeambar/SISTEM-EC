# 🗂️ Sistema de Respaldos Automáticos - Documentación Completa

## 📋 Descripción General

El **Sistema de Respaldos Automáticos** es una solución integral para la gestión y protección de datos del Sistema de Estimulación de Colaboradores. Proporciona respaldos automáticos, manuales, restauración segura y gestión completa de archivos de respaldo.

## 🎯 Objetivos del Sistema

- **Protección de Datos**: Respaldo automático de la base de datos MySQL
- **Recuperación Rápida**: Restauración segura en caso de pérdida de datos
- **Gestión Automática**: Respaldos programados sin intervención manual
- **Optimización de Espacio**: Compresión automática y limpieza de archivos antiguos
- **Interfaz Amigable**: Gestión completa a través de menús intuitivos

## 🗂️ Estructura de Archivos

```
backup/
├── backup_mysql.bat                    # Script principal de respaldo
├── restore_mysql.bat                   # Script de restauración
├── configurar_respaldo_automatico.bat # Configuración de tareas programadas
├── gestionar_respaldos.bat            # Gestión completa de respaldos
├── README_RESPALDOS.md                # Documentación técnica
└── backups/                           # Directorio de respaldos (se crea automáticamente)
    └── *.zip                          # Archivos de respaldo comprimidos

respaldo_rapido.bat                    # Acceso rápido desde la raíz del proyecto
```

## 🚀 Funcionalidades Principales

### 1. **Respaldos Automáticos**
- **Diario**: 2:00 AM - Respaldo diario de seguridad
- **Semanal**: Domingos 3:00 AM - Respaldo semanal completo
- **Mensual**: Día 1 del mes 4:00 AM - Respaldo mensual de archivo

### 2. **Respaldos Manuales**
- **Creación bajo demanda**: Respaldo inmediato cuando sea necesario
- **Compresión automática**: Archivos .zip para optimizar espacio
- **Validación de integridad**: Verificación de que el respaldo sea exitoso

### 3. **Restauración Segura**
- **Confirmación obligatoria**: Previene restauraciones accidentales
- **Respaldo de seguridad**: Crea respaldo antes de restaurar
- **Validación de archivos**: Verifica que el archivo de respaldo sea válido

### 4. **Gestión de Archivos**
- **Limpieza automática**: Mantiene solo los últimos 10 archivos
- **Compresión**: Reduce el tamaño de archivos en un 70-80%
- **Organización**: Archivos con fecha y hora para fácil identificación

## 📖 Guía de Uso

### 🔧 Configuración Inicial

#### Paso 1: Configurar Respaldos Automáticos
```cmd
# Ejecutar como Administrador
backup\configurar_respaldo_automatico.bat
```

**Resultado esperado:**
```
=======================================
   CONFIGURACION DE RESPALDOS AUTOMATICOS
=======================================

Configurando respaldos automáticos...
Script de respaldo: D:\ruta\backup\backup_mysql.bat

Creando tarea programada para respaldo diario...
Tarea programada creada exitosamente para respaldo diario a las 2:00 AM

Creando tarea programada para respaldo semanal...
Tarea programada creada exitosamente para respaldo semanal los domingos a las 3:00 AM

Creando tarea programada para respaldo mensual...
Tarea programada creada exitosamente para respaldo mensual el día 1 a las 4:00 AM

=======================================
   CONFIGURACION COMPLETADA
=======================================

Respaldos automáticos configurados:
- Diario: 2:00 AM
- Semanal: Domingos 3:00 AM  
- Mensual: Día 1 del mes 4:00 AM
```

#### Paso 2: Verificar Configuración
```cmd
# Ver tareas programadas
schtasks /query /tn "SistemaEstimulacion_*"
```

### 📊 Uso Diario

#### Crear Respaldo Manual
```cmd
# Desde la raíz del proyecto
backup\backup_mysql.bat

# O desde el directorio backup
cd backup
backup_mysql.bat
```

**Resultado esperado:**
```
========================================
   SISTEMA DE RESPALDO AUTOMATICO
========================================

Iniciando respaldo de la base de datos...
Base de datos: colaboradores_db
Archivo: backups\colaboradores_db_backup_20241201_143022.sql

========================================
   RESPALDO EXITOSO
========================================
Archivo creado: backups\colaboradores_db_backup_20241201_143022.sql
Comprimiendo archivo...
Archivo comprimido: backups\colaboradores_db_backup_20241201_143022.sql.zip
Limpiando respaldos antiguos...

Respaldo completado exitosamente!
Fecha: Thu 12/01/2024  14:30:22.45
```

#### Gestión Completa de Respaldos
```cmd
# Acceso rápido desde la raíz
respaldo_rapido.bat

# O desde el directorio backup
backup\gestionar_respaldos.bat
```

**Menú de gestión:**
```
========================================
   GESTION DE RESPALDOS
========================================

1. Ver respaldos disponibles
2. Crear respaldo manual
3. Restaurar respaldo
4. Limpiar respaldos antiguos
5. Configurar respaldos automáticos
6. Ver tareas programadas
7. Salir

Seleccione una opción (1-7):
```

### 🔄 Restauración de Respaldos

#### Paso 1: Seleccionar Archivo
```cmd
backup\restore_mysql.bat
```

#### Paso 2: Confirmar Restauración
```
========================================
   SISTEMA DE RESTAURACION
========================================

Archivos de respaldo disponibles:

colaboradores_db_backup_20241201_143022.sql.zip
colaboradores_db_backup_20241201_143045.sql.zip
colaboradores_db_backup_20241201_143100.sql.zip

========================================
   INSTRUCCIONES DE RESTAURACION
========================================
1. Seleccione el archivo de respaldo que desea restaurar
2. El sistema restaurará la base de datos colaboradores_db
3. Se creará un respaldo de la base actual antes de restaurar
4. ADVERTENCIA: Esta operación sobrescribirá la base de datos actual

Ingrese el nombre del archivo de respaldo: colaboradores_db_backup_20241201_143022.sql.zip

========================================
   CONFIRMACION DE RESTAURACION
========================================
Archivo a restaurar: colaboradores_db_backup_20241201_143022.sql.zip
Base de datos destino: colaboradores_db

ADVERTENCIA: Esta operación sobrescribirá la base de datos actual.

¿Está seguro de que desea continuar? (S/N): S
```

## ⚙️ Configuración Técnica

### Base de Datos
- **Host**: localhost
- **Usuario**: root
- **Contraseña**: Cuba123456
- **Base de datos**: colaboradores_db

### Características del Respaldo
- **Formato**: SQL comprimido (.zip)
- **Incluye**: Estructura, datos, rutinas, triggers
- **Transacción**: Única (--single-transaction)
- **Retención**: Últimos 10 archivos
- **Compresión**: Automática con PowerShell

### Rutas de MySQL
- **mysqldump**: `C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump`
- **mysql**: `C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql`

## 🔧 Comandos Avanzados

### Ver Tareas Programadas
```cmd
schtasks /query /tn "SistemaEstimulacion_*"
```

### Eliminar Tarea Programada
```cmd
schtasks /delete /tn "SistemaEstimulacion_RespaldoDiario" /f
```

### Crear Tarea Personalizada
```cmd
schtasks /create /tn "MiRespaldo" /tr "ruta\backup_mysql.bat" /sc daily /st 15:00
```

### Verificar Respaldos
```cmd
dir backup\backups\*.zip
```

### Verificar Tamaño de Respaldos
```cmd
powershell "Get-ChildItem backup\backups\*.zip | Select-Object Name, Length, LastWriteTime"
```

## 📊 Monitoreo y Mantenimiento

### Verificar Estado del Sistema
```cmd
# Verificar MySQL
mysql -u root -p -e "SELECT VERSION();"

# Verificar respaldos
dir backup\backups\*.zip

# Verificar tareas
schtasks /query /tn "SistemaEstimulacion_*"
```

### Limpieza Manual de Archivos
```cmd
# Eliminar respaldos antiguos manualmente
for /f "skip=10 delims=" %i in ('dir /b /o-d backup\backups\*.zip') do del "backup\backups\%i"
```

### Verificar Espacio en Disco
```cmd
# Verificar espacio disponible
wmic logicaldisk get size,freespace,caption
```

## 🛡️ Seguridad

### Características de Seguridad
- **Confirmación**: Antes de restaurar
- **Respaldo de seguridad**: Antes de restaurar
- **Validación**: Verificación de archivos
- **Logs**: Registro de operaciones

### Recomendaciones
1. **Copia externa**: Realizar copias en ubicación externa
2. **Verificación**: Probar restauraciones periódicamente
3. **Monitoreo**: Revisar logs de tareas programadas
4. **Actualización**: Mantener scripts actualizados

## 🔍 Solución de Problemas

### Error: "mysqldump no se reconoce"
**Solución**: Verificar que MySQL esté instalado y en el PATH
```cmd
set PATH=%PATH%;C:\Program Files\MySQL\MySQL Server 8.0\bin
```

### Error: "Acceso denegado"
**Solución**: Ejecutar como Administrador

### Error: "Puerto en uso"
**Solución**: Verificar que MySQL esté ejecutándose
```cmd
net start mysql
```

### Error: "Archivo no encontrado"
**Solución**: Verificar ruta del script
```cmd
cd /d "ruta\completa\del\proyecto"
```

### Error: "No se puede crear el directorio"
**Solución**: Verificar permisos de escritura
```cmd
mkdir backup\backups
```

## 📞 Soporte
- **Email**: danielf@mre.siecsa.cu
- **Teléfono**: +58-416-6217-827

### Logs de Error
Los errores se muestran en pantalla durante la ejecución.

### Verificación de Estado
```cmd
backup\gestionar_respaldos.bat
```

### Comandos de Diagnóstico
```cmd
# Verificar MySQL
mysql -u root -p -e "SELECT VERSION();"

# Verificar respaldos
dir backup\backups\*.zip

# Verificar tareas
schtasks /query /tn "SistemaEstimulacion_*"
```

## 📝 Notas Importantes

1. **Permisos**: Ejecutar scripts como Administrador
2. **Espacio**: Verificar espacio disponible en disco
3. **MySQL**: Asegurar que MySQL esté ejecutándose
4. **Rutas**: Usar rutas absolutas en tareas programadas
5. **Backup**: Realizar copias de los scripts de respaldo

## 🔄 Actualizaciones

### Versión 1.0
- Respaldo automático diario, semanal y mensual
- Compresión automática de archivos
- Gestión de respaldos antiguos
- Restauración segura con confirmación
- Interfaz de gestión completa

---

**Desarrollado para el Sistema de Estimulación de Colaboradores**
**Fecha**: Julio 2025
**Versión**: 2.0 
