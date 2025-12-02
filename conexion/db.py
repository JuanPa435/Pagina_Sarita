import os
import mysql.connector
from dotenv import load_dotenv

# Cargar variables de entorno desde .env
load_dotenv()

# Fuente única de verdad para la conexión a MySQL
DATABASE_URL = os.environ.get('DATABASE_URL')

def parse_mysql_url(url: str):
    """Parsea mysql://user:pass@host:port/db en sus componentes"""
    if not url.startswith('mysql://'):
        raise ValueError('DATABASE_URL debe iniciar con mysql://')
    rest = url[len('mysql://'):]
    auth, rest2 = rest.split('@', 1)
    user, password = auth.split(':', 1)
    host_port, database = rest2.split('/', 1)
    host, port = host_port.split(':', 1)
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
