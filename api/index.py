from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# Add parent directory to path to access backend and conexion modules
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, parent_dir)

# Import Flask app
try:
    from backend.app import app as flask_app
    print("✅ Flask app imported successfully")
except Exception as e:
    print(f"❌ Error importing Flask app: {e}")
    import traceback
    traceback.print_exc()
    
    # Create a minimal fallback app
    flask_app = Flask(__name__)
    CORS(flask_app)
    
    @flask_app.route('/api/test')
    def test():
        return {'status': 'error', 'message': str(e), 'traceback': traceback.format_exc()}

# Enable CORS
CORS(flask_app, resources={r"/*": {"origins": "*"}})

# Add a health check endpoint
@flask_app.route('/api/health')
def health():
    return {
        'status': 'ok',
        'message': 'Backend is running on Vercel',
        'python_version': sys.version,
        'path': sys.path
    }

# Vercel serverless function handler
app = flask_app

# Vercel expects this format for serverless functions
def handler(request, response):
    return app(request, response)
