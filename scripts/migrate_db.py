#!/usr/bin/env python3
"""
Script de migración de base de datos MySQL
Exporta e importa datos entre dos bases de datos MySQL
"""

import pymysql
import os
from datetime import datetime

try:
    # Carga variables desde .env si existe (desarrollo)
    from dotenv import load_dotenv  # type: ignore
    load_dotenv()
except Exception:
    pass

# ==================== CONFIGURACIÓN ====================

def read_db_from_env(prefix: str):
    host = os.environ.get(f'{prefix}_HOST')
    port = int(os.environ.get(f'{prefix}_PORT', '3306'))
    user = os.environ.get(f'{prefix}_USER')
    password = os.environ.get(f'{prefix}_PASSWORD')
    database = os.environ.get(f'{prefix}_NAME')

    missing = [k for k, v in {
        f'{prefix}_HOST': host,
        f'{prefix}_USER': user,
        f'{prefix}_PASSWORD': password,
        f'{prefix}_NAME': database,
    }.items() if not v]

    if missing:
        raise RuntimeError(
            f"Faltan variables de entorno para {prefix}: {', '.join(missing)}. "
            "Configura un archivo .env (ver .env.example) o exporta variables."
        )

    return {
        'host': host,
        'port': port,
        'user': user,
        'password': password,
        'database': database,
    }

# Base de datos ORIGEN y DESTINO via entorno
SOURCE_DB = read_db_from_env('SOURCE_DB')
TARGET_DB = read_db_from_env('TARGET_DB')

# ==================== FUNCIONES ====================

def conectar(config):
    """Conecta a una base de datos"""
    try:
        conn = pymysql.connect(
            host=config['host'],
            port=config['port'],
            user=config['user'],
            password=config['password'],
            database=config['database'],
            charset='utf8mb4'
        )
        print(f"✅ Conectado a {config['host']}")
        return conn
    except Exception as e:
        print(f"❌ Error conectando a {config['host']}: {e}")
        return None

def exportar_estructura(conn):
    """Exporta la estructura de las tablas"""
    cursor = conn.cursor()
    
    # Obtener lista de tablas
    cursor.execute("SHOW TABLES")
    tablas = [tabla[0] for tabla in cursor.fetchall()]
    
    estructura = {}
    for tabla in tablas:
        cursor.execute(f"SHOW CREATE TABLE `{tabla}`")
        estructura[tabla] = cursor.fetchone()[1]
    
    cursor.close()
    return estructura, tablas

def exportar_datos(conn, tabla):
    """Exporta datos de una tabla"""
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    cursor.execute(f"SELECT * FROM `{tabla}`")
    datos = cursor.fetchall()
    cursor.close()
    return datos

def crear_tablas(conn, estructura):
    """Crea tablas en la base de datos destino"""
    cursor = conn.cursor()
    for tabla, create_sql in estructura.items():
        try:
            # Drop table if exists
            cursor.execute(f"DROP TABLE IF EXISTS `{tabla}`")
            # Create table
            cursor.execute(create_sql)
            print(f"  ✅ Tabla '{tabla}' creada")
        except Exception as e:
            print(f"  ❌ Error creando tabla '{tabla}': {e}")
    conn.commit()
    cursor.close()

def insertar_datos(conn, tabla, datos):
    """Inserta datos en una tabla"""
    if not datos:
        print(f"  ⚠️  Tabla '{tabla}' vacía, omitiendo...")
        return
    
    cursor = conn.cursor()
    
    # Obtener columnas
    columnas = list(datos[0].keys())
    columnas_str = ', '.join([f"`{col}`" for col in columnas])
    placeholders = ', '.join(['%s'] * len(columnas))
    
    sql = f"INSERT INTO `{tabla}` ({columnas_str}) VALUES ({placeholders})"
    
    try:
        for registro in datos:
            valores = [registro[col] for col in columnas]
            cursor.execute(sql, valores)
        conn.commit()
        print(f"  ✅ {len(datos)} registros insertados en '{tabla}'")
    except Exception as e:
        print(f"  ❌ Error insertando datos en '{tabla}': {e}")
        conn.rollback()
    
    cursor.close()

def migrar():
    """Proceso principal de migración"""
    print("\n" + "="*60)
    print("🚀 MIGRACIÓN DE BASE DE DATOS MySQL")
    print("="*60 + "\n")
    
    # Timestamp para backup
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Conectar a origen
    print("📡 Conectando a base de datos ORIGEN...")
    conn_source = conectar(SOURCE_DB)
    if not conn_source:
        return
    
    # Conectar a destino
    print("\n📡 Conectando a base de datos DESTINO...")
    conn_target = conectar(TARGET_DB)
    if not conn_target:
        conn_source.close()
        return
    
    try:
        # Exportar estructura
        print("\n📋 Exportando estructura de tablas...")
        estructura, tablas = exportar_estructura(conn_source)
        print(f"  ✅ {len(tablas)} tablas encontradas: {', '.join(tablas)}")
        
        # Crear tablas en destino
        print("\n🏗️  Creando tablas en destino...")
        crear_tablas(conn_target, estructura)
        
        # Migrar datos tabla por tabla
        print("\n📦 Migrando datos...")
        for tabla in tablas:
            print(f"\n  Tabla: {tabla}")
            datos = exportar_datos(conn_source, tabla)
            insertar_datos(conn_target, tabla, datos)
        
        print("\n" + "="*60)
        print("✅ MIGRACIÓN COMPLETADA EXITOSAMENTE")
        print("="*60 + "\n")
        
    except Exception as e:
        print(f"\n❌ Error durante la migración: {e}")
    
    finally:
        conn_source.close()
        conn_target.close()
        print("🔌 Conexiones cerradas\n")

def backup_local():
    """Crea un backup local en SQL"""
    print("\n" + "="*60)
    print("💾 CREANDO BACKUP LOCAL")
    print("="*60 + "\n")
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"backup_{timestamp}.sql"
    
    conn = conectar(SOURCE_DB)
    if not conn:
        return
    
    try:
        estructura, tablas = exportar_estructura(conn)
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(f"-- Backup de base de datos\n")
            f.write(f"-- Fecha: {datetime.now()}\n\n")
            
            for tabla in tablas:
                # Estructura
                f.write(f"\n-- Estructura de tabla: {tabla}\n")
                f.write(f"DROP TABLE IF EXISTS `{tabla}`;\n")
                f.write(estructura[tabla] + ";\n\n")
                
                # Datos
                f.write(f"-- Datos de tabla: {tabla}\n")
                datos = exportar_datos(conn, tabla)
                
                if datos:
                    columnas = list(datos[0].keys())
                    columnas_str = ', '.join([f"`{col}`" for col in columnas])
                    
                    f.write(f"INSERT INTO `{tabla}` ({columnas_str}) VALUES\n")
                    
                    for i, registro in enumerate(datos):
                        valores = []
                        for col in columnas:
                            val = registro[col]
                            if val is None:
                                valores.append('NULL')
                            elif isinstance(val, (int, float)):
                                valores.append(str(val))
                            elif isinstance(val, bytes):
                                valores.append(f"0x{val.hex()}")
                            else:
                                val_escaped = str(val).replace("'", "\\'")
                                valores.append(f"'{val_escaped}'")
                        
                        valores_str = ', '.join(valores)
                        if i < len(datos) - 1:
                            f.write(f"  ({valores_str}),\n")
                        else:
                            f.write(f"  ({valores_str});\n")
                
                f.write("\n")
        
        conn.close()
        print(f"✅ Backup guardado en: {filename}")
        print(f"📊 Tamaño: {os.path.getsize(filename) / 1024:.2f} KB\n")
        
    except Exception as e:
        print(f"❌ Error creando backup: {e}")
        conn.close()

# ==================== MENÚ ====================

if __name__ == "__main__":
    print("\n" + "="*60)
    print("🗄️  HERRAMIENTA DE MIGRACIÓN DE BASE DE DATOS")
    print("="*60)
    print("\nOpciones:")
    print("  1. Migrar base de datos (ORIGEN → DESTINO)")
    print("  2. Crear backup local (.sql)")
    print("  3. Salir")
    print("\n" + "="*60)
    
    opcion = input("\nSelecciona una opción (1-3): ").strip()
    
    if opcion == "1":
        print("\n⚠️  ADVERTENCIA: Esto sobrescribirá datos en la base destino")
        confirmar = input("¿Continuar? (si/no): ").strip().lower()
        if confirmar == "si":
            migrar()
        else:
            print("❌ Migración cancelada")
    
    elif opcion == "2":
        backup_local()
    
    elif opcion == "3":
        print("👋 Hasta luego!\n")
    
    else:
        print("❌ Opción inválida\n")
