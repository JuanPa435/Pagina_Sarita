import os
import mysql.connector

# Intentar cargar .env solo si existe (desarrollo local)
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # En Vercel no hay dotenv

# Fuente única de verdad para la conexión a MySQL
DATABASE_URL = os.environ.get('DATABASE_URL')

# Si no hay DATABASE_URL, construir desde variables individuales (Vercel)
if not DATABASE_URL:
    DB_HOST = os.environ.get('DB_HOST')
    DB_USER = os.environ.get('DB_USER')
    DB_PASSWORD = os.environ.get('DB_PASSWORD')
    DB_NAME = os.environ.get('DB_NAME')
    DB_PORT = os.environ.get('DB_PORT', '3306')
    
    if all([DB_HOST, DB_USER, DB_PASSWORD, DB_NAME]):
        DATABASE_URL = f"mysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

def parse_mysql_url(url: str):
    """Parsea mysql://user:pass@host:port/db en sus componentes"""
    if not url:
        raise ValueError('No se encontró DATABASE_URL ni variables de conexión')
    if not url.startswith('mysql://'):
        raise ValueError('DATABASE_URL debe iniciar con mysql://')
    rest = url[len('mysql://'):]
    auth, rest2 = rest.split('@', 1)
    user, password = auth.split(':', 1)
    host_port, database = rest2.split('/', 1)
    if ':' in host_port:
        host, port = host_port.split(':', 1)
    else:
        host = host_port
        port = '3306'
    return {
        'user': user,
        'password': password,
        'host': host,
        'port': int(port),
        'database': database
    }

def get_db():
    """Crea y retorna una conexión mysql.connector basada en DATABASE_URL"""
    cfg = parse_mysql_url(DATABASE_URL)
    return mysql.connector.connect(**cfg)
