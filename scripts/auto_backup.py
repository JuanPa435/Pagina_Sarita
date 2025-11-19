#!/usr/bin/env python3
"""
Script de backup automático de base de datos MySQL
Crea backups cada 15 días en carpeta organizada
"""

import pymysql
import os
import json
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional

try:
    # Carga variables desde .env si existe (desarrollo)
    from dotenv import load_dotenv  # type: ignore
    load_dotenv()
except Exception:
    pass

# ==================== CONFIGURACIÓN ====================

# Base de datos (leer de variables de entorno)
def get_db_config_from_env():
    host = os.environ.get('DB_HOST')
    port = int(os.environ.get('DB_PORT', '3306'))
    user = os.environ.get('DB_USER')
    password = os.environ.get('DB_PASSWORD')
    database = os.environ.get('DB_NAME')

    missing = [k for k, v in {
        'DB_HOST': host,
        'DB_USER': user,
        'DB_PASSWORD': password,
        'DB_NAME': database,
    }.items() if not v]

    if missing:
        raise RuntimeError(
            f"Faltan variables de entorno para backup: {', '.join(missing)}. "
            "Configura un archivo .env (ver .env.example) o exporta variables."
        )

    return {
        'host': host,
        'port': port,
        'user': user,
        'password': password,
        'database': database,
    }

DB_CONFIG = get_db_config_from_env()

# Configuración de backups
BACKUP_DIR = 'backups'  # Carpeta donde se guardarán los backups
BACKUP_INTERVAL_DAYS = 1  # Cada cuántos días hacer backup
MAX_BACKUPS = 10  # Máximo de backups a mantener (los más antiguos se eliminan)

# Archivo para registrar último backup
LAST_BACKUP_FILE = 'backups/.last_backup.json'

# ==================== FUNCIONES ====================

def crear_carpeta_backups():
    """Crea la carpeta de backups si no existe"""
    Path(BACKUP_DIR).mkdir(parents=True, exist_ok=True)
    print(f"📁 Carpeta de backups: {os.path.abspath(BACKUP_DIR)}/")

def conectar():
    """Conecta a la base de datos"""
    try:
        conn = pymysql.connect(
            host=DB_CONFIG['host'],
            port=DB_CONFIG['port'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password'],
            database=DB_CONFIG['database'],
            charset='utf8mb4'
        )
        return conn
    except Exception as e:
        print(f"❌ Error conectando a la base de datos: {e}")
        return None

def necesita_backup():
    """Verifica si necesita hacer un backup basado en la fecha del último"""
    if not os.path.exists(LAST_BACKUP_FILE):
        return True, "Primer backup"
    
    try:
        with open(LAST_BACKUP_FILE, 'r') as f:
            data = json.load(f)
            ultimo_backup = datetime.fromisoformat(data['fecha'])
            dias_transcurridos = (datetime.now() - ultimo_backup).days
            
            if dias_transcurridos >= BACKUP_INTERVAL_DAYS:
                return True, f"Han pasado {dias_transcurridos} días desde el último backup"
            else:
                dias_restantes = BACKUP_INTERVAL_DAYS - dias_transcurridos
                return False, f"Próximo backup en {dias_restantes} días"
    except Exception as e:
        print(f"⚠️  Error leyendo último backup: {e}")
        return True, "Error leyendo registro"

def registrar_backup(filename, stats):
    """Registra información del backup realizado"""
    data = {
        'fecha': datetime.now().isoformat(),
        'archivo': filename,
        'tamaño_kb': stats['tamaño_kb'],
        'tablas': stats['tablas'],
        'registros_totales': stats['registros_totales']
    }
    
    with open(LAST_BACKUP_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def obtener_estadisticas(conn, tablas):
    """Obtiene estadísticas de las tablas"""
    cursor = conn.cursor()
    total_registros = 0
    detalles = {}
    
    for tabla in tablas:
        cursor.execute(f"SELECT COUNT(*) FROM `{tabla}`")
        count = cursor.fetchone()[0]
        total_registros += count
        detalles[tabla] = count
    
    cursor.close()
    return total_registros, detalles

def crear_backup():
    """Crea un backup completo de la base de datos"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    fecha_legible = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    filename = f"{BACKUP_DIR}/backup_{timestamp}.sql"
    info_filename = f"{BACKUP_DIR}/backup_{timestamp}_info.txt"
    
    print(f"\n💾 Creando backup: {filename}")
    
    conn = conectar()
    if not conn:
        return None
    
    try:
        cursor = conn.cursor()
        
        # Obtener lista de tablas
        cursor.execute("SHOW TABLES")
        tablas = [tabla[0] for tabla in cursor.fetchall()]
        
        print(f"📊 Tablas encontradas: {', '.join(tablas)}")
        
        # Obtener estadísticas
        total_registros, detalles = obtener_estadisticas(conn, tablas)
        
        # Crear archivo SQL
        with open(filename, 'w', encoding='utf-8') as f:
            # Header
            f.write(f"-- ============================================\n")
            f.write(f"-- Backup Automático de Base de Datos\n")
            f.write(f"-- Base de datos: {DB_CONFIG['database']}\n")
            f.write(f"-- Fecha: {fecha_legible}\n")
            f.write(f"-- Tablas: {len(tablas)}\n")
            f.write(f"-- Registros totales: {total_registros}\n")
            f.write(f"-- ============================================\n\n")
            
            f.write("SET FOREIGN_KEY_CHECKS=0;\n\n")
            
            # Por cada tabla
            for tabla in tablas:
                print(f"  📝 Exportando tabla: {tabla} ({detalles[tabla]} registros)")
                
                # Estructura
                cursor.execute(f"SHOW CREATE TABLE `{tabla}`")
                create_table = cursor.fetchone()[1]
                
                f.write(f"\n-- ==================== Tabla: {tabla} ====================\n")
                f.write(f"DROP TABLE IF EXISTS `{tabla}`;\n")
                f.write(create_table + ";\n\n")
                
                # Datos
                cursor.execute(f"SELECT * FROM `{tabla}`")
                datos = cursor.fetchall()
                
                if datos:
                    # Obtener nombres de columnas
                    cursor.execute(f"DESCRIBE `{tabla}`")
                    columnas = [col[0] for col in cursor.fetchall()]
                    columnas_str = ', '.join([f"`{col}`" for col in columnas])
                    
                    f.write(f"-- Datos de {tabla}\n")
                    f.write(f"INSERT INTO `{tabla}` ({columnas_str}) VALUES\n")
                    
                    for i, registro in enumerate(datos):
                        valores = []
                        for val in registro:
                            if val is None:
                                valores.append('NULL')
                            elif isinstance(val, (int, float)):
                                valores.append(str(val))
                            elif isinstance(val, bytes):
                                valores.append(f"0x{val.hex()}")
                            else:
                                val_escaped = str(val).replace("\\", "\\\\").replace("'", "\\'")
                                valores.append(f"'{val_escaped}'")
                        
                        valores_str = ', '.join(valores)
                        if i < len(datos) - 1:
                            f.write(f"  ({valores_str}),\n")
                        else:
                            f.write(f"  ({valores_str});\n")
                
                f.write("\n")
            
            f.write("SET FOREIGN_KEY_CHECKS=1;\n")
        
        # Crear archivo de información
        tamaño_kb = os.path.getsize(filename) / 1024
        
        with open(info_filename, 'w', encoding='utf-8') as f:
            f.write("="*60 + "\n")
            f.write("INFORMACIÓN DEL BACKUP\n")
            f.write("="*60 + "\n\n")
            f.write(f"Fecha: {fecha_legible}\n")
            f.write(f"Base de datos: {DB_CONFIG['database']}\n")
            f.write(f"Archivo SQL: {os.path.basename(filename)}\n")
            f.write(f"Tamaño: {tamaño_kb:.2f} KB\n")
            f.write(f"Tablas: {len(tablas)}\n")
            f.write(f"Registros totales: {total_registros}\n\n")
            f.write("Detalle por tabla:\n")
            f.write("-" * 60 + "\n")
            for tabla, count in detalles.items():
                f.write(f"  • {tabla}: {count} registros\n")
            f.write("\n" + "="*60 + "\n")
        
        cursor.close()
        conn.close()
        
        stats = {
            'tamaño_kb': tamaño_kb,
            'tablas': len(tablas),
            'registros_totales': total_registros
        }
        
        print(f"\n✅ Backup creado exitosamente")
        print(f"📄 Archivo SQL: {filename}")
        print(f"📋 Información: {info_filename}")
        print(f"💾 Tamaño: {tamaño_kb:.2f} KB")
        print(f"📊 {len(tablas)} tablas, {total_registros} registros totales")
        
        return filename, stats
        
    except Exception as e:
        print(f"❌ Error creando backup: {e}")
        conn.close()
        return None

def limpiar_backups_antiguos():
    """Elimina backups antiguos manteniendo solo los últimos MAX_BACKUPS"""
    archivos_sql = sorted(Path(BACKUP_DIR).glob('backup_*.sql'))
    
    if len(archivos_sql) > MAX_BACKUPS:
        print(f"\n🗑️  Limpiando backups antiguos (manteniendo últimos {MAX_BACKUPS})...")
        
        # Eliminar los más antiguos
        for archivo in archivos_sql[:-MAX_BACKUPS]:
            # Eliminar SQL y su archivo de info
            archivo.unlink()
            info_file = archivo.with_name(archivo.stem + '_info.txt')
            if info_file.exists():
                info_file.unlink()
            print(f"  🗑️  Eliminado: {archivo.name}")

def listar_backups():
    """Lista todos los backups disponibles"""
    archivos_sql = sorted(Path(BACKUP_DIR).glob('backup_*.sql'), reverse=True)
    
    if not archivos_sql:
        print("📭 No hay backups disponibles")
        return
    
    print(f"\n📦 Backups disponibles ({len(archivos_sql)}):")
    print("="*80)
    
    for archivo in archivos_sql:
        info_file = archivo.with_name(archivo.stem + '_info.txt')
        tamaño = archivo.stat().st_size / 1024
        fecha_mod = datetime.fromtimestamp(archivo.stat().st_mtime)
        
        print(f"\n📄 {archivo.name}")
        print(f"   📅 Fecha: {fecha_mod.strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"   💾 Tamaño: {tamaño:.2f} KB")
        
        if info_file.exists():
            print(f"   📋 Info: {info_file.name}")

def verificar_ultimo_backup():
    """Muestra información del último backup"""
    if not os.path.exists(LAST_BACKUP_FILE):
        print("⚠️  No hay registro de backups previos")
        return
    
    try:
        with open(LAST_BACKUP_FILE, 'r') as f:
            data = json.load(f)
            fecha = datetime.fromisoformat(data['fecha'])
            dias_transcurridos = (datetime.now() - fecha).days
            
            print("\n📊 Último backup:")
            print("="*60)
            print(f"📅 Fecha: {fecha.strftime('%Y-%m-%d %H:%M:%S')}")
            print(f"📄 Archivo: {data['archivo']}")
            print(f"💾 Tamaño: {data['tamaño_kb']:.2f} KB")
            print(f"📊 Tablas: {data['tablas']}")
            print(f"📝 Registros: {data['registros_totales']}")
            print(f"⏰ Hace {dias_transcurridos} días")
            print(f"🔄 Próximo backup en: {max(0, BACKUP_INTERVAL_DAYS - dias_transcurridos)} días")
            print("="*60)
    except Exception as e:
        print(f"❌ Error leyendo información: {e}")

# ==================== PROGRAMA PRINCIPAL ====================

def main():
    print("\n" + "="*60)
    print("💾 SISTEMA DE BACKUP AUTOMÁTICO")
    print(f"📁 Carpeta: {os.path.abspath(BACKUP_DIR)}/")
    print(f"⏰ Intervalo: Cada {BACKUP_INTERVAL_DAYS} días")
    print(f"📦 Backups máximos: {MAX_BACKUPS}")
    print("="*60)
    
    crear_carpeta_backups()
    
    # Menú
    print("\nOpciones:")
    print("  1. Verificar y crear backup si es necesario")
    print("  2. Crear backup ahora (forzar)")
    print("  3. Ver último backup")
    print("  4. Listar todos los backups")
    print("  5. Salir")
    print("="*60)
    
    opcion = input("\nSelecciona una opción (1-5): ").strip()
    
    if opcion == "1":
        # Backup automático
        necesita, razon = necesita_backup()
        print(f"\n🔍 {razon}")
        
        if necesita:
            resultado = crear_backup()
            if resultado:
                filename, stats = resultado
                registrar_backup(filename, stats)
                limpiar_backups_antiguos()
        else:
            print("✅ No es necesario hacer backup todavía")
    
    elif opcion == "2":
        # Backup forzado
        print("\n⚠️  Creando backup forzado...")
        resultado = crear_backup()
        if resultado:
            filename, stats = resultado
            registrar_backup(filename, stats)
            limpiar_backups_antiguos()
    
    elif opcion == "3":
        # Ver último backup
        verificar_ultimo_backup()
    
    elif opcion == "4":
        # Listar backups
        listar_backups()
    
    elif opcion == "5":
        print("\n👋 Hasta luego!\n")
    
    else:
        print("\n❌ Opción inválida\n")

if __name__ == "__main__":
    main()
