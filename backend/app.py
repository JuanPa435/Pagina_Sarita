from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import os
import sys

# Agregar path para importar conexion desde raíz
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from conexion.db import get_db

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Helper para convertir resultados a dict
def dict_cursor(cursor, data):
    """Convert MySQL cursor results to list of dicts"""
    if not data:
        return []
    columns = [col[0] for col in cursor.description]
    return [dict(zip(columns, row)) for row in data]

# Fallback data
FALLBACK_POEMAS = [
    {"titulo": "Tu sonrisa", "contenido": "Tu sonrisa ilumina mis días\ncomo el sol que atraviesa la niebla", "autor": "JP"},
    {"titulo": "Amor eterno", "contenido": "En cada latido de mi corazón\nresuena tu nombre con pasión", "autor": "JP"}
]

FALLBACK_CANCIONES = [
    {"titulo": "Perfect", "artista": "Ed Sheeran", "url": "https://youtu.be/2Vv-BfVoq4g", "razon": "Describe lo que siento", "dedicadoPor": "JP"},
    {"titulo": "Yellow", "artista": "Coldplay", "url": "https://youtu.be/yKNxeF4KMsY", "razon": "Todo se volvió luz contigo", "dedicadoPor": "JP"}
]

# Inicializar tablas
def init_db():
    """Create tables if they don't exist"""
    try:
        conn = get_db()
        cur = conn.cursor()
        
        cur.execute('''CREATE TABLE IF NOT EXISTS poemas (
            id INT AUTO_INCREMENT PRIMARY KEY,
            titulo TEXT,
            contenido TEXT,
            autor TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )''')
        
        cur.execute('''CREATE TABLE IF NOT EXISTS canciones (
            id INT AUTO_INCREMENT PRIMARY KEY,
            titulo TEXT,
            artista TEXT,
            url TEXT,
            razon TEXT,
            dedicado_por TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )''')
        
        cur.execute('''CREATE TABLE IF NOT EXISTS meses (
            id INT AUTO_INCREMENT PRIMARY KEY,
            mes TEXT,
            descripcion TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )''')
        
        cur.execute('''CREATE TABLE IF NOT EXISTS galeria (
            id INT AUTO_INCREMENT PRIMARY KEY,
            descripcion TEXT,
            imagen_data LONGBLOB NOT NULL,
            imagen_mime TEXT,
            fecha DATE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )''')
        
        conn.commit()
        cur.close()
        conn.close()
        print("✅ Tablas creadas/verificadas exitosamente")
        return True
    except Exception as e:
        print(f"❌ Error inicializando DB: {e}")
        return False

# Inicializar al arrancar
try:
    init_db()
except Exception as e:
    print(f"⚠️ No se pudo inicializar DB al arrancar: {e}")

# ============================================
# RUTAS DE DEBUG
# ============================================

@app.route('/api/health')
@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({"status": "ok", "service": "Pagina_Sarita_Backend"}), 200

@app.route('/api/debug/routes')
@app.route('/debug/routes')
def debug_routes():
    """List all available routes"""
    routes = []
    for rule in app.url_map.iter_rules():
        routes.append({
            'endpoint': rule.endpoint,
            'methods': sorted(list(rule.methods - {'HEAD', 'OPTIONS'})),
            'path': str(rule)
        })
    return jsonify({'routes': sorted(routes, key=lambda x: x['path'])}), 200

@app.route('/api/debug/db')
@app.route('/debug/db')
def debug_db():
    """Test database connection"""
    info = {'database': 'MySQL on Railway'}
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute('SELECT 1 as test')
        result = cur.fetchone()
        cur.close()
        conn.close()
        info['connection'] = 'ok'
        info['test_query'] = 'passed'
    except Exception as e:
        info['connection'] = 'error'
        info['error'] = str(e)
    status_code = 200 if info.get('connection') == 'ok' else 500
    return jsonify(info), status_code

# ============================================
# POEMAS ENDPOINTS
# ============================================

@app.route('/api/poemas/get', methods=['GET'])
@app.route('/poemas/get', methods=['GET'])
def get_poemas():
    """Get all poems from database"""
    no_fallback = request.headers.get('X-No-Fallback') == '1' or request.args.get('nofallback') == '1'
    
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute('SELECT id, titulo, contenido, autor, created_at FROM poemas ORDER BY id')
        rows = cur.fetchall()
        poemas = dict_cursor(cur, rows)
        cur.close()
        conn.close()
        
        if not poemas and not no_fallback:
            return jsonify({
                'success': True,
                'fallback': True,
                'poemas': FALLBACK_POEMAS,
                'count': len(FALLBACK_POEMAS)
            })
        
        return jsonify({
            'success': True,
            'poemas': [{'titulo': p['titulo'], 'contenido': p['contenido'], 'autor': p.get('autor', '')} for p in poemas],
            'count': len(poemas),
            'empty': len(poemas) == 0
        })
    except Exception as e:
        if no_fallback:
            return jsonify({'success': False, 'error': str(e)}), 500
        return jsonify({
            'success': True,
            'fallback': True,
            'poemas': FALLBACK_POEMAS,
            'count': len(FALLBACK_POEMAS),
            'warning': f'Database error: {str(e)}'
        })

@app.route('/api/poemas/save', methods=['POST'])
@app.route('/poemas/save', methods=['POST'])
def save_poemas():
    """Save/replace all poems"""
    try:
        data = request.get_json()
        poemas = data.get('poemas', [])
        
        conn = get_db()
        cur = conn.cursor()
        cur.execute('DELETE FROM poemas')
        
        for p in poemas:
            cur.execute(
                'INSERT INTO poemas (titulo, contenido, autor) VALUES (%s, %s, %s)',
                (p.get('titulo', ''), p.get('contenido', ''), p.get('autor', 'JP'))
            )
        
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': f'{len(poemas)} poemas guardados',
            'count': len(poemas)
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ============================================
# CANCIONES ENDPOINTS
# ============================================

@app.route('/api/canciones/get', methods=['GET'])
@app.route('/canciones/get', methods=['GET'])
def get_canciones():
    """Get all songs from database"""
    no_fallback = request.headers.get('X-No-Fallback') == '1' or request.args.get('nofallback') == '1'
    
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute('SELECT id, titulo, artista, url, razon, dedicado_por, created_at FROM canciones ORDER BY id')
        rows = cur.fetchall()
        canciones = dict_cursor(cur, rows)
        cur.close()
        conn.close()
        
        if not canciones and not no_fallback:
            return jsonify({
                'success': True,
                'fallback': True,
                'canciones': FALLBACK_CANCIONES,
                'count': len(FALLBACK_CANCIONES)
            })
        
        return jsonify({
            'success': True,
            'canciones': [{
                'titulo': c['titulo'],
                'artista': c.get('artista', ''),
                'url': c.get('url', ''),
                'razon': c.get('razon', ''),
                'dedicadoPor': c.get('dedicado_por', 'JP')
            } for c in canciones],
            'count': len(canciones),
            'empty': len(canciones) == 0
        })
    except Exception as e:
        if no_fallback:
            return jsonify({'success': False, 'error': str(e)}), 500
        return jsonify({
            'success': True,
            'fallback': True,
            'canciones': FALLBACK_CANCIONES,
            'count': len(FALLBACK_CANCIONES),
            'warning': f'Database error: {str(e)}'
        })

@app.route('/api/canciones/save', methods=['POST'])
@app.route('/canciones/save', methods=['POST'])
def save_canciones():
    """Save/replace all songs"""
    try:
        data = request.get_json()
        canciones = data.get('canciones', [])
        
        conn = get_db()
        cur = conn.cursor()
        cur.execute('DELETE FROM canciones')
        
        for c in canciones:
            cur.execute(
                'INSERT INTO canciones (titulo, artista, url, razon, dedicado_por) VALUES (%s, %s, %s, %s, %s)',
                (c.get('titulo', ''), c.get('artista', ''), c.get('url', ''), c.get('razon', ''), c.get('dedicadoPor', 'JP'))
            )
        
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': f'{len(canciones)} canciones guardadas',
            'count': len(canciones)
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ============================================
# MESES ENDPOINTS
# ============================================

@app.route('/api/meses/get', methods=['GET'])
@app.route('/meses/get', methods=['GET'])
def get_meses():
    """Get all months/milestones"""
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute('SELECT id, mes, descripcion, created_at FROM meses ORDER BY id')
        rows = cur.fetchall()
        meses = dict_cursor(cur, rows)
        cur.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'meses': [{'mes': m['mes'], 'descripcion': m.get('descripcion', '')} for m in meses],
            'count': len(meses)
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/meses/save', methods=['POST'])
@app.route('/meses/save', methods=['POST'])
def save_meses():
    """Save/replace all months"""
    try:
        data = request.get_json()
        meses = data.get('meses', [])
        
        conn = get_db()
        cur = conn.cursor()
        cur.execute('DELETE FROM meses')
        
        for m in meses:
            cur.execute(
                'INSERT INTO meses (mes, descripcion) VALUES (%s, %s)',
                (m.get('mes', ''), m.get('descripcion', ''))
            )
        
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': f'{len(meses)} meses guardados',
            'count': len(meses)
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ============================================
# GALERÍA/RECUERDOS ENDPOINTS
# ============================================

@app.route('/api/recuerdos/imagen/<int:foto_id>', methods=['GET'])
@app.route('/recuerdos/imagen/<int:foto_id>', methods=['GET'])
def serve_imagen(foto_id):
    """Serve image by ID"""
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute('SELECT imagen_data, imagen_mime FROM galeria WHERE id = %s', (foto_id,))
        row = cur.fetchone()
        cur.close()
        conn.close()
        
        if not row:
            return jsonify({'error': 'Imagen no encontrada'}), 404
        
        return Response(row[0], mimetype=row[1] or 'image/jpeg')
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/recuerdos/get', methods=['GET'])
@app.route('/recuerdos/get', methods=['GET'])
def get_recuerdos():
    """Get all gallery items (metadata only)"""
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute('SELECT id, descripcion, fecha, created_at FROM galeria ORDER BY id DESC')
        rows = cur.fetchall()
        recuerdos = dict_cursor(cur, rows)
        cur.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'recuerdos': [{
                'id': r['id'],
                'url': f"/api/recuerdos/imagen/{r['id']}",
                'mensaje': r.get('descripcion', ''),
                'fecha': r['fecha'].isoformat() if r.get('fecha') else None
            } for r in recuerdos],
            'count': len(recuerdos)
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/recuerdos/upload', methods=['POST'])
@app.route('/recuerdos/upload', methods=['POST'])
def upload_recuerdo():
    """Upload new image with metadata"""
    try:
        if 'imagen' not in request.files:
            return jsonify({'success': False, 'error': 'No se envió imagen'}), 400
        
        imagen = request.files['imagen']
        descripcion = request.form.get('mensaje', '')
        fecha_str = request.form.get('fecha', '')
        
        from datetime import datetime as dt
        fecha = dt.strptime(fecha_str, '%Y-%m-%d').date() if fecha_str else None
        
        imagen_data = imagen.read()
        imagen_mime = imagen.content_type or 'image/jpeg'
        
        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            'INSERT INTO galeria (descripcion, imagen_data, imagen_mime, fecha) VALUES (%s, %s, %s, %s)',
            (descripcion, imagen_data, imagen_mime, fecha)
        )
        conn.commit()
        foto_id = cur.lastrowid
        cur.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Imagen subida exitosamente',
            'id': foto_id,
            'url': f'/api/recuerdos/imagen/{foto_id}'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ============================================
# MAIN
# ============================================

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5050))
    debug = os.environ.get('DEBUG', 'True').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)
