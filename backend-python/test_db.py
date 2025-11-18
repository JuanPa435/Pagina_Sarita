#!/usr/bin/env python3
import psycopg2
from psycopg2.extras import RealDictCursor

DATABASE_URL = 'postgresql://postgres:VHXSFqnBZasImIKFqYuSSPmLzXDRewUB@shuttle.proxy.rlwy.net:14662/railway'

print("🔍 Probando conexión a PostgreSQL...")

try:
    conn = psycopg2.connect(DATABASE_URL)
    print("✅ Conexión exitosa")
    
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute('SELECT COUNT(*) as total FROM poemas')
    result = cur.fetchone()
    print(f"📝 Total de poemas: {result['total']}")
    
    cur.execute('SELECT id, titulo, autor FROM poemas LIMIT 5')
    poemas = cur.fetchall()
    print("\n🎯 Primeros 5 poemas:")
    for p in poemas:
        print(f"  {p['id']}. {p['titulo']} - {p['autor']}")
    
    cur.close()
    conn.close()
    print("\n✅ Todo funciona correctamente")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
