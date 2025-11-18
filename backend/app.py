from flask import Flask, request, jsonify, Response
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from datetime import datetime

app = Flask(__name__)

DATABASE_URL = os.environ.get('DATABASE_URL', 'postgresql://postgres:VHXSFqnBZasImIKFqYuSSPmLzXDRewUB@shuttle.proxy.rlwy.net:14662/railway')

def get_db():
    return psycopg2.connect(DATABASE_URL)

# Inicializar tablas
def init_db():
    conn = get_db()
    cur = conn.cursor()
    
    cur.execute('''CREATE TABLE IF NOT EXISTS poemas (
        id SERIAL PRIMARY KEY, titulo TEXT, contenido TEXT, autor TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
    
    cur.execute('''CREATE TABLE IF NOT EXISTS canciones (
        id SERIAL PRIMARY KEY, titulo TEXT, artista TEXT, url TEXT, razon TEXT,
        dedicado_por TEXT DEFAULT 'JP', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
    
    cur.execute('''CREATE TABLE IF NOT EXISTS meses (
        id SERIAL PRIMARY KEY, mes TEXT, descripcion TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
    
    cur.execute('''CREATE TABLE IF NOT EXISTS galeria (
        id SERIAL PRIMARY KEY, descripcion TEXT, imagen_data BYTEA NOT NULL,
        imagen_mime TEXT, fecha DATE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
    
    conn.commit()
    cur.close()
    conn.close()

try:
    init_db()
except:
    pass

# POEMAS
@app.route('/poemas/get')
def get_poemas():
    try:
        conn = get_db()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute('SELECT * FROM poemas ORDER BY id')
        poemas = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify({'success': True, 'poemas': [{'titulo': p['titulo'], 'contenido': p['contenido'], 'autor': p['autor']} for p in poemas]})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/poemas/save', methods=['POST'])
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
def get_canciones():
    try:
        conn = get_db()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute('SELECT * FROM canciones ORDER BY id')
        canciones = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify({'success': True, 'canciones': [{'titulo': c['titulo'], 'artista': c['artista'], 
                       'url': c['url'], 'razon': c['razon'], 'dedicadoPor': c['dedicado_por']} for c in canciones]})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/canciones/save', methods=['POST'])
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
def get_meses():
    try:
        conn = get_db()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute('SELECT * FROM meses ORDER BY id')
        meses = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify({'success': True, 'meses': [{'mes': m['mes'], 'descripcion': m['descripcion']} for m in meses]})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/meses/save', methods=['POST'])
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
def serve_imagen(foto_id):
    try:
        conn = get_db()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute('SELECT imagen_data, imagen_mime FROM galeria WHERE id = %s', (foto_id,))
        row = cur.fetchone()
        cur.close()
        conn.close()
        if not row:
            return jsonify({'error': 'Not found'}), 404
        return Response(row['imagen_data'], mimetype=row['imagen_mime'] or 'image/jpeg')
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/recuerdos/get')
def get_recuerdos():
    try:
        conn = get_db()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute('SELECT id, descripcion, fecha FROM galeria ORDER BY id DESC')
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify({'success': True, 'recuerdos': [{'id': r['id'], 'url': f"/api/recuerdos/imagen/{r['id']}",
                       'mensaje': r['descripcion'], 'fecha': r['fecha'].isoformat() if r['fecha'] else None} for r in rows]})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/recuerdos/upload', methods=['POST'])
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
        cur.execute('INSERT INTO galeria (descripcion, imagen_data, imagen_mime, fecha) VALUES (%s, %s, %s, %s) RETURNING id',
                   (mensaje, psycopg2.Binary(imagen_data), imagen_mime, fecha))
        new_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'success': True, 'id': new_id, 'url': f"/api/recuerdos/imagen/{new_id}", 'mensaje': mensaje, 'fecha': fecha_str})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/health')
def health():
    return jsonify({'status': 'OK', 'time': datetime.now().isoformat()})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
