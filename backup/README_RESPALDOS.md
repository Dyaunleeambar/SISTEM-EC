# Sistema de Respaldos Automáticos - Sistema de Estimulación de Colaboradores

## 📋 Descripción General

Este sistema proporciona una solución completa para la gestión de respaldos de la base de datos MySQL del Sistema de Estimulación de Colaboradores. Incluye respaldos automáticos, manuales, restauración y gestión de archivos.

## 🗂️ Estructura de Archivos

```
backup/
├── backup_mysql.bat                    # Script principal de respaldo
├── restore_mysql.bat                   # Script de restauración
├── configurar_respaldo_automatico.bat # Configuración de tareas programadas
├── gestionar_respaldos.bat            # Gestión completa de respaldos
├── README_RESPALDOS.md                # Esta documentación
└── backups/                           # Directorio de respaldos (se crea automáticamente)
    └── *.zip                          # Archivos de respaldo comprimidos
```

## 🚀 Funcionalidades

### 1. **Respaldo Automático**
- **Diario**: 2:00 AM
- **Semanal**: Domingos 3:00 AM
- **Mensual**: Día 1 del mes 4:00 AM

### 2. **Respaldo Manual**
- Creación de respaldos bajo demanda
- Compresión automática de archivos
- Limpieza de respaldos antiguos

### 3. **Restauración**
- Restauración segura con confirmación
- Respaldo automático antes de restaurar
- Validación de archivos

### 4. **Gestión**
- Visualización de respaldos disponibles
- Limpieza automática (mantiene últimos 10)
- Configuración de tareas programadas

## 📖 Guía de Uso

### Configuración Inicial

1. **Ejecutar como Administrador**
   ```cmd
   backup\configurar_respaldo_automatico.bat
   ```

2. **Verificar configuración**
   ```cmd
   backup\gestionar_respaldos.bat
   ```

### Uso Diario

#### Crear Respaldo Manual
```cmd
backup\backup_mysql.bat
```

#### Restaurar Respaldo
```cmd
backup\restaurar_mysql.bat
```

#### Gestión Completa
```cmd
backup\gestionar_respaldos.bat
```

## ⚙️ Configuración

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

## 📊 Monitoreo

### Verificar Respaldos
```cmd
dir backup\backups\*.zip
```

### Verificar Tamaño de Respaldos
```cmd
powershell "Get-ChildItem backup\backups\*.zip | Select-Object Name, Length, LastWriteTime"
```

### Verificar Último Respaldo
```cmd
dir backup\backups\*.zip /o-d
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
**Solución**: Agregar MySQL al PATH del sistema
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

## 📞 Soporte

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
**Fecha**: Diciembre 2024
**Versión**: 1.0 