from flask import Flask, request, jsonify, Response
import os, sys
# Asegurar que el paquete 'conexion' (en la raíz del repo) esté en el path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from conexion.db import get_db
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

def dict_cursor(cursor, data):
    """Convert cursor results to dict"""
    columns = [col[0] for col in cursor.description]
    return [dict(zip(columns, row)) for row in data]

# Inicializar tablas
def init_db():
    try:
        conn = get_db()
        cur = conn.cursor()
        
        cur.execute('''CREATE TABLE IF NOT EXISTS poemas (
            id INT AUTO_INCREMENT PRIMARY KEY, 
            titulo TEXT, 
            contenido TEXT, 
            autor TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
        
        cur.execute('''CREATE TABLE IF NOT EXISTS canciones (
            id INT AUTO_INCREMENT PRIMARY KEY, 
            titulo TEXT, 
            artista TEXT, 
            url TEXT, 
            razon TEXT,
            dedicado_por TEXT, 
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
        
        cur.execute('''CREATE TABLE IF NOT EXISTS meses (
            id INT AUTO_INCREMENT PRIMARY KEY, 
            mes TEXT, 
            descripcion TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
        
        cur.execute('''CREATE TABLE IF NOT EXISTS galeria (
            id INT AUTO_INCREMENT PRIMARY KEY, 
            descripcion TEXT, 
            imagen_data LONGBLOB NOT NULL,
            imagen_mime TEXT, 
            fecha DATE, 
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
        
        conn.commit()
        cur.close()
        conn.close()
        print("✅ Tablas creadas/verificadas exitosamente")
    except Exception as e:
        print(f"❌ Error inicializando DB: {e}")

try:
    init_db()
except:
    pass

# DEBUG ROUTES
@app.route('/api/debug/routes')
@app.route('/debug/routes')
def debug_routes():
    rutas = []
    for rule in app.url_map.iter_rules():
        rutas.append({'endpoint': rule.endpoint, 'methods': list(rule.methods), 'rule': str(rule)})
    return jsonify({'routes': rutas}), 200

@app.route('/api/debug/db')
@app.route('/debug/db')
def debug_db():
    info = {'database_url': 'mysql://...@shinkansen.proxy.rlwy.net:27654/railway'}
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute('SELECT 1')
        cur.fetchone()
        cur.close()
        conn.close()
        info['connection'] = 'ok'
    except Exception as e:
        info['connection'] = 'error'
        info['error'] = str(e)
    return jsonify(info), 200 if info['connection']=='ok' else 500

# POEMAS
@app.route('/poemas/get')
@app.route('/api/poemas/get')
def get_poemas():
    no_fallback = request.headers.get('X-No-Fallback') == '1' or request.args.get('nofallback') == '1'
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute('SELECT * FROM poemas ORDER BY id')
        rows = cur.fetchall()
        poemas = dict_cursor(cur, rows)
        cur.close()
        conn.close()
        
        if not poemas and not no_fallback:
            return jsonify({'success': True, 'fallback': True, 'poemas': FALLBACK_POEMAS})
        
        return jsonify({
            'success': True, 
            'poemas': [{'titulo': p['titulo'], 'contenido': p['contenido'], 'autor': p['autor']} for p in poemas],
            'empty': len(poemas)==0
        })
    except Exception as e:
        if no_fallback:
            return jsonify({'success': False, 'error': str(e)}), 500
        return jsonify({'success': True, 'fallback': True, 'poemas': FALLBACK_POEMAS, 'warning': str(e)})

@app.route('/poemas/save', methods=['POST'])
@app.route('/api/poemas/save', methods=['POST'])
def save_poemas():
    try:
        data = request.json
        poemas = data.get('poemas', [])
        conn = get_db()
        cur = conn.cursor()
        cur.execute('DELETE FROM poemas')
        for p in poemas:
            cur.execute('INSERT INTO poemas (titulo, contenido, autor) VALUES (%s, %s, %s)',
                       (p.get('titulo'), p.get('contenido'), p.get('autor')))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'success': True, 'message': f'{len(poemas)} poemas saved', 'total': len(poemas)})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# CANCIONES
@app.route('/canciones/get')
@app.route('/api/canciones/get')
def get_canciones():
    no_fallback = request.headers.get('X-No-Fallback') == '1' or request.args.get('nofallback') == '1'
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute('SELECT * FROM canciones ORDER BY id')
        rows = cur.fetchall()
        canciones = dict_cursor(cur, rows)
        cur.close()
        conn.close()
        
        if not canciones and not no_fallback:
            return jsonify({'success': True, 'fallback': True, 'canciones': FALLBACK_CANCIONES})
        
        return jsonify({
            'success': True, 
            'canciones': [{
                'titulo': c['titulo'], 
                'artista': c['artista'], 
                'url': c['url'], 
                'razon': c['razon'], 
                'dedicadoPor': c['dedicado_por']
            } for c in canciones],
            'empty': len(canciones)==0
        })
    except Exception as e:
        if no_fallback:
            return jsonify({'success': False, 'error': str(e)}), 500
        return jsonify({'success': True, 'fallback': True, 'canciones': FALLBACK_CANCIONES, 'warning': str(e)})

@app.route('/canciones/save', methods=['POST'])
@app.route('/api/canciones/save', methods=['POST'])
def save_canciones():
    try:
        data = request.json
        canciones = data.get('canciones', [])
        conn = get_db()
        cur = conn.cursor()
        cur.execute('DELETE FROM canciones')
        for c in canciones:
            cur.execute('INSERT INTO canciones (titulo, artista, url, razon, dedicado_por) VALUES (%s, %s, %s, %s, %s)',
                       (c.get('titulo'), c.get('artista'), c.get('url'), c.get('razon'), c.get('dedicadoPor', 'JP')))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'success': True, 'message': f'{len(canciones)} canciones saved'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# MESES
@app.route('/meses/get')
@app.route('/api/meses/get')
def get_meses():
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute('SELECT * FROM meses ORDER BY id')
        rows = cur.fetchall()
        meses = dict_cursor(cur, rows)
        cur.close()
        conn.close()
        return jsonify({'success': True, 'meses': [{'mes': m['mes'], 'descripcion': m['descripcion']} for m in meses]})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/meses/save', methods=['POST'])
@app.route('/api/meses/save', methods=['POST'])
def save_meses():
    try:
        data = request.json
        meses = data.get('meses', [])
        conn = get_db()
        cur = conn.cursor()
        cur.execute('DELETE FROM meses')
        for m in meses:
            cur.execute('INSERT INTO meses (mes, descripcion) VALUES (%s, %s)', (m.get('mes'), m.get('descripcion')))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'success': True, 'message': f'{len(meses)} meses saved'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# RECUERDOS
@app.route('/recuerdos/imagen/<int:foto_id>')
@app.route('/api/recuerdos/imagen/<int:foto_id>')
def serve_imagen(foto_id):
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute('SELECT imagen_data, imagen_mime FROM galeria WHERE id = %s', (foto_id,))
        row = cur.fetchone()
        cur.close()
        conn.close()
        if not row:
            return jsonify({'error': 'Not found'}), 404
        return Response(row[0], mimetype=row[1] or 'image/jpeg')
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/recuerdos/get')
@app.route('/api/recuerdos/get')
def get_recuerdos():
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute('SELECT id, descripcion, fecha FROM galeria ORDER BY id DESC')
        rows = cur.fetchall()
        recuerdos = dict_cursor(cur, rows)
        cur.close()
        conn.close()
        return jsonify({
            'success': True, 
            'recuerdos': [{
                'id': r['id'], 
                'url': f"/api/recuerdos/imagen/{r['id']}",
                'mensaje': r['descripcion'], 
                'fecha': r['fecha'].isoformat() if r['fecha'] else None
            } for r in recuerdos]
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/recuerdos/upload', methods=['POST'])
@app.route('/api/recuerdos/upload', methods=['POST'])
def upload_recuerdo():
    try:
        if 'foto' not in request.files:
            return jsonify({'success': False, 'error': 'No file'}), 400
        
        file = request.files['foto']
        mensaje = request.form.get('mensaje', '').strip()
        fecha_str = request.form.get('fecha')
        fecha = datetime.strptime(fecha_str, '%Y-%m-%d').date() if fecha_str else None
        
        imagen_data = file.read()
        imagen_mime = file.content_type or 'image/jpeg'
        
        conn = get_db()
        cur = conn.cursor()
        cur.execute('INSERT INTO galeria (descripcion, imagen_data, imagen_mime, fecha) VALUES (%s, %s, %s, %s)',
                   (mensaje, imagen_data, imagen_mime, fecha))
        new_id = cur.lastrowid
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({
            'success': True, 
            'id': new_id, 
            'url': f"/api/recuerdos/imagen/{new_id}", 
            'mensaje': mensaje, 
            'fecha': fecha_str
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/health')
@app.route('/api/health')
def health():
    return jsonify({'status': 'OK', 'time': datetime.now().isoformat()})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', '5050'))
    app.run(host='0.0.0.0', port=port, debug=True)
