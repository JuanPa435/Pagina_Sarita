# 🐍 Backend Python - Flask + PostgreSQL

Backend API RESTful para el proyecto "Nuestra Historia".

## 📋 Archivos

- `app.py` - Aplicación Flask principal con todos los endpoints
- `migrate.py` - Script de migración de datos .js → PostgreSQL
- `add_poemas.py` - Script para agregar poemas masivamente
- `add_canciones.py` - Script para agregar canciones masivamente
- `requirements.txt` - Dependencias Python
- `README.md` - Esta documentación

## 🚀 Iniciar el Servidor

```bash
# Instalar dependencias
pip install -r requirements.txt

# Iniciar servidor de desarrollo
python3 app.py
```

El servidor correrá en `http://127.0.0.1:5000`

## 📡 Endpoints API

### Poemas

**GET /api/poemas/get**
```json
{
  "success": true,
  "poemas": [
    {
      "titulo": "Título",
      "contenido": "Contenido del poema...",
      "autor": "Autor"
    }
  ]
}
```

**POST /api/poemas/save**
```json
{
  "poemas": [
    {
      "titulo": "Nuevo poema",
      "contenido": "Texto...",
      "autor": "JP"
    }
  ]
}
```

### Canciones

**GET /api/canciones/get**
```json
{
  "success": true,
  "canciones": [
    {
      "titulo": "Canción",
      "artista": "Artista",
      "url": "https://...",
      "razon": "Razón especial",
      "dedicadoPor": "JP"
    }
  ]
}
```

**POST /api/canciones/save**
```json
{
  "canciones": [
    {
      "titulo": "Nueva canción",
      "artista": "Artista",
      "url": "https://...",
      "razon": "Es especial porque...",
      "dedicadoPor": "Sarita"
    }
  ]
}
```

### Meses (reemplaza Mensajes)

**GET /api/meses/get**
```json
{
  "success": true,
  "meses": [
    {
      "mes": "Mes 1",
      "descripcion": "Nuestro primer mes juntos 💙"
    }
  ]
}
```

**POST /api/meses/save**
```json
{
  "meses": [
    {
      "mes": "Mes 2",
      "descripcion": "Cada día creciendo más contigo"
    }
  ]
}
```

### Salud

**GET /health**
```json
{
  "status": "Backend Python online ✅",
  "timestamp": "2025-11-18T12:00:00.000000"
}
```

**GET /**
```json
{
  "message": "Pagina Sarita API - Python Backend",
  "version": "2.0",
  "endpoints": [...]
}
```

## 🗄️ Base de Datos PostgreSQL

### Conexión

```python
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://...')
```

### Tablas

**poemas**
```sql
id SERIAL PRIMARY KEY
titulo TEXT NOT NULL
contenido TEXT NOT NULL
autor TEXT
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

**canciones**
```sql
id SERIAL PRIMARY KEY
titulo TEXT NOT NULL
artista TEXT
url TEXT
razon TEXT
dedicado_por TEXT DEFAULT 'JP'
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

**meses**
```sql
id SERIAL PRIMARY KEY
mes TEXT NOT NULL
descripcion TEXT
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

**galeria**
```sql
id SERIAL PRIMARY KEY
titulo TEXT
descripcion TEXT
url TEXT NOT NULL
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

## 🔧 Migración de Datos

Para migrar datos de archivos .js a PostgreSQL:

```bash
python3 migrate.py
```

Este script:
1. Lee los archivos `.js` de cada sección
2. Parsea los datos con regex
3. Inserta en PostgreSQL
4. Reporta el resultado

## 📦 Dependencias

```
Flask==3.0.0
flask-cors==4.0.0
psycopg2-binary==2.9.9
```

## 🌐 Despliegue en Railway

1. **Crear Procfile en la raíz:**
```
web: cd backend-python && python app.py
```

2. **Variables de entorno:**
- `DATABASE_URL` - URL de PostgreSQL (auto-configurada por Railway)
- `PORT` - Puerto del servidor (auto-configurado)

3. **Push a Railway:**
```bash
git add .
git commit -m "Deploy backend"
git push origin main
```

Railway detectará el Procfile y ejecutará la aplicación Python.

## 🔒 CORS

El backend tiene CORS habilitado para desarrollo local:

```python
from flask_cors import CORS
CORS(app)
```

En producción, Railway maneja las peticiones en el mismo dominio.

## 🐛 Debug

Para ver logs en Railway:
```bash
railway logs
```

Para debug local, el servidor Flask corre en modo debug automáticamente.

---
Backend desarrollado con 💙 para Nuestra Historia
