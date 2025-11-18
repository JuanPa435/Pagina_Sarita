from backend.app import app as flask_app
from flask_cors import CORS

# Aplicar CORS global
CORS(flask_app, resources={r"/*": {"origins": "*"}})

# Vercel @vercel/python detecta la variable WSGI 'app'
app = flask_app
