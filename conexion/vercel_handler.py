from backend.app import app as flask_app
from flask_cors import CORS

# Aplicar CORS global (ya está en app.py pero por si acaso)
CORS(flask_app, resources={r"/*": {"origins": "*"}})

# Vercel detecta automáticamente la variable 'app'
app = flask_app
