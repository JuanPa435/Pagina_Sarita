from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# PostgreSQL connection from environment variable
DATABASE_URL = os.environ.get('DATABASE_URL')

def get_db_connection():
    conn = psycopg2.connect(DATABASE_URL)
    return conn

# Initialize database tables
def init_db():
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Poemas table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS poemas (
            id SERIAL PRIMARY KEY,
            titulo TEXT NOT NULL,
            contenido TEXT NOT NULL,
            autor TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Canciones table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS canciones (
            id SERIAL PRIMARY KEY,
            titulo TEXT NOT NULL,
            artista TEXT,
            url TEXT,
            razon TEXT,
            dedicado_por TEXT DEFAULT 'JP',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Mensajes table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS mensajes (
            id SERIAL PRIMARY KEY,
            asunto TEXT NOT NULL,
            contenido TEXT NOT NULL,
            fecha DATE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Galeria table - fotos almacenadas en DB como bytea
    cur.execute('''
        CREATE TABLE IF NOT EXISTS galeria (
            id SERIAL PRIMARY KEY,
            titulo TEXT,
            descripcion TEXT,
            imagen_data BYTEA NOT NULL,
            imagen_mime TEXT,
            fecha DATE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Migración: convertir columna url antigua a nueva estructura si existe
    try:
        cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name='galeria' AND column_name='url'")
        if cur.fetchone():
            cur.execute("DROP TABLE galeria CASCADE")
            cur.execute('''
                CREATE TABLE galeria (
                    id SERIAL PRIMARY KEY,
                    titulo TEXT,
                    descripcion TEXT,
                    imagen_data BYTEA NOT NULL,
                    imagen_mime TEXT,
                    fecha DATE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
    except Exception:
        pass

    # Meses table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS meses (
            id SERIAL PRIMARY KEY,
            mes TEXT NOT NULL,
            descripcion TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    cur.close()
    conn.close()

# Inicializar DB en primera ejecución
try:
    if DATABASE_URL:
        init_db()
except Exception as e:
    print(f"Init DB warning: {e}")

# ==================== POEMAS ====================

@app.route('/api/poemas/get', methods=['GET'])
def get_poemas():
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute('SELECT * FROM poemas ORDER BY id')
        poemas = cur.fetchall()
        cur.close()
        conn.close()
        
        result = [{'titulo': p['titulo'], 'contenido': p['contenido'], 'autor': p['autor']} for p in poemas]
        return jsonify({'success': True, 'poemas': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/poemas/save', methods=['POST'])
def save_poemas():
    try:
        data = request.json
        poemas = data.get('poemas', [])
        
        if not isinstance(poemas, list):
            return jsonify({'success': False, 'error': 'Invalid data'}), 400
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute('DELETE FROM poemas')
        
        for poema in poemas:
            cur.execute(
                'INSERT INTO poemas (titulo, contenido, autor) VALUES (%s, %s, %s)',
                (poema.get('titulo'), poema.get('contenido'), poema.get('autor'))
            )
        
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({'success': True, 'message': f'{len(poemas)} poemas saved', 'total': len(poemas)})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ==================== CANCIONES ====================

@app.route('/api/canciones/get', methods=['GET'])
def get_canciones():
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute('SELECT * FROM canciones ORDER BY id')
        canciones = cur.fetchall()
        cur.close()
        conn.close()
        
        result = [{
            'titulo': c['titulo'],
            'artista': c['artista'],
            'url': c['url'],
            'razon': c['razon'],
            'dedicadoPor': c['dedicado_por']
        } for c in canciones]
        return jsonify({'success': True, 'canciones': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/canciones/save', methods=['POST'])
def save_canciones():
    try:
        data = request.json
        canciones = data.get('canciones', [])
        
        if not isinstance(canciones, list):
            return jsonify({'success': False, 'error': 'Invalid data'}), 400
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute('DELETE FROM canciones')
        
        for cancion in canciones:
            cur.execute(
                'INSERT INTO canciones (titulo, artista, url, razon, dedicado_por) VALUES (%s, %s, %s, %s, %s)',
                (cancion.get('titulo'), cancion.get('artista'), cancion.get('url'), 
                 cancion.get('razon'), cancion.get('dedicadoPor', 'JP'))
            )
        
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({'success': True, 'message': f'{len(canciones)} canciones saved'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ==================== MESES ====================

@app.route('/api/meses/get', methods=['GET'])
def get_meses():
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute('SELECT * FROM meses ORDER BY id')
        meses = cur.fetchall()
        cur.close()
        conn.close()

        result = [{
            'mes': m['mes'],
            'descripcion': m['descripcion']
        } for m in meses]
        return jsonify({'success': True, 'meses': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/meses/save', methods=['POST'])
def save_meses():
    try:
        data = request.json
        meses = data.get('meses', [])

        if not isinstance(meses, list):
            return jsonify({'success': False, 'error': 'Invalid data'}), 400

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute('DELETE FROM meses')

        for registro in meses:
            cur.execute(
                'INSERT INTO meses (mes, descripcion) VALUES (%s, %s)',
                (registro.get('mes'), registro.get('descripcion'))
            )

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({'success': True, 'message': f'{len(meses)} meses saved'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ==================== RECUERDOS ====================

@app.route('/api/recuerdos/imagen/<int:foto_id>')
def serve_recuerdo_imagen(foto_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute('SELECT imagen_data, imagen_mime FROM galeria WHERE id = %s', (foto_id,))
        row = cur.fetchone()
        cur.close()
        conn.close()
        
        if not row or not row['imagen_data']:
            return jsonify({'error': 'Imagen no encontrada'}), 404
        
        return Response(row['imagen_data'], mimetype=row['imagen_mime'] or 'image/jpeg')
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/recuerdos/get', methods=['GET'])
def get_recuerdos():
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute('SELECT id, descripcion, fecha, imagen_mime FROM galeria ORDER BY id DESC')
        rows = cur.fetchall()
        cur.close()
        conn.close()
        
        recuerdos = [{
            'id': r['id'],
            'url': f"/api/recuerdos/imagen/{r['id']}",
            'mensaje': r['descripcion'],
            'fecha': r['fecha'].isoformat() if r['fecha'] else None
        } for r in rows]
        return jsonify({'success': True, 'recuerdos': recuerdos})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/recuerdos/upload', methods=['POST'])
def upload_recuerdo():
    try:
        if 'foto' not in request.files:
            return jsonify({'success': False, 'error': 'No file provided'}), 400
        
        file = request.files['foto']
        if file.filename == '':
            return jsonify({'success': False, 'error': 'Empty filename'}), 400
        
        mensaje = request.form.get('mensaje', '').strip()
        fecha_str = request.form.get('fecha')
        fecha = None
        
        if fecha_str:
            try:
                fecha = datetime.strptime(fecha_str, '%Y-%m-%d').date()
            except Exception:
                fecha = None
        
        imagen_data = file.read()
        imagen_mime = file.content_type or 'image/jpeg'
        
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            'INSERT INTO galeria (titulo, descripcion, imagen_data, imagen_mime, fecha) VALUES (%s, %s, %s, %s, %s) RETURNING id',
            (None, mensaje, psycopg2.Binary(imagen_data), imagen_mime, fecha)
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({'success': True, 'id': new_id, 'url': f"/api/recuerdos/imagen/{new_id}", 'mensaje': mensaje, 'fecha': fecha_str})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ==================== HEALTH CHECK ====================

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'Backend online ✅', 'timestamp': datetime.now().isoformat()})

@app.route('/api/', methods=['GET'])
@app.route('/api', methods=['GET'])
def root():
    return jsonify({
        'message': 'Pagina Sarita API',
        'version': '2.0',
        'endpoints': ['/api/poemas/get', '/api/poemas/save', '/api/canciones/get', 
                      '/api/canciones/save', '/api/meses/get', '/api/meses/save', 
                      '/api/recuerdos/get', '/api/recuerdos/upload']
    })

# Export for Vercel
def handler(request, response):
    return app(request, response)
