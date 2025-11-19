# Backups Automáticos

Esta carpeta contiene los backups automáticos de la base de datos.

## 📋 Información

- **Intervalo**: Se crea un backup cada 15 días automáticamente
- **Formato**: Archivos SQL con timestamp
- **Máximo**: Se mantienen los últimos 10 backups
- **Archivos por backup**:
  - `backup_YYYYMMDD_HHMMSS.sql` - Archivo SQL con los datos
  - `backup_YYYYMMDD_HHMMSS_info.txt` - Información del backup

## 🗂️ Estructura de archivos

```
backups/
├── .last_backup.json          # Registro del último backup
├── backup_20250119_143022.sql # Backup SQL
├── backup_20250119_143022_info.txt # Info del backup
└── README.md                   # Este archivo
```

## 📊 Contenido de cada backup

Cada backup incluye:
- ✅ Estructura completa de todas las tablas
- ✅ Todos los datos (poemas, canciones, recuerdos, etc.)
- ✅ Imágenes guardadas como BLOB
- ✅ Estadísticas de registros por tabla

## 🔄 Cómo restaurar un backup

```bash
# Desde Railway CLI
railway run mysql < backups/backup_YYYYMMDD_HHMMSS.sql

# O directamente con mysql
mysql -h HOST -u USER -p DATABASE < backups/backup_YYYYMMDD_HHMMSS.sql
```

## 🚀 Uso del script

```bash
# Ejecutar el script de backup automático
python scripts/auto_backup.py
```

**Opciones disponibles:**
1. Verificar y crear backup si es necesario
2. Crear backup ahora (forzar)
3. Ver último backup
4. Listar todos los backups
5. Salir

## ⚙️ Configuración

Edita `scripts/auto_backup.py` para cambiar:
- `BACKUP_INTERVAL_DAYS`: Días entre backups (default: 15)
- `MAX_BACKUPS`: Máximo de backups a mantener (default: 10)
- `DB_CONFIG`: Credenciales de la base de datos

## 🤖 Automatización

Para ejecutar automáticamente cada 15 días, puedes usar:

### Con cron (Linux/Mac):
```bash
# Editar crontab
crontab -e

# Agregar línea (ejecuta cada día a las 3 AM, el script verifica si necesita backup)
0 3 * * * cd /workspaces/Pagina_Sarita && python scripts/auto_backup.py
```

### Con GitHub Actions:
Ver `.github/workflows/backup.yml` (si existe)

## 📝 Notas

- Los backups se crean solo cuando han pasado 15 días desde el último
- Los backups antiguos se eliminan automáticamente
- Cada backup incluye un archivo de información con estadísticas
- El archivo `.last_backup.json` registra cuándo fue el último backup
