from flask import Flask
from flask_cors import CORS
import sys
import os

# Add parent directory to path to access conexion module
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, parent_dir)

# Import the Flask app from the same directory
try:
    from app import app as flask_app
    print("✅ Flask app imported successfully")
except Exception as e:
    print(f"❌ Error importing Flask app: {e}")
    # Create a minimal fallback app
    flask_app = Flask(__name__)
    CORS(flask_app)
    
    @flask_app.route('/api/test')
    def test():
        return {'status': 'error', 'message': str(e)}

# Enable CORS
CORS(flask_app, resources={r"/*": {"origins": "*"}})

# Add a health check endpoint
@flask_app.route('/api/health')
def health():
    return {
        'status': 'ok',
        'message': 'Backend is running on Vercel',
        'python_version': sys.version
    }

# Vercel serverless function handler
app = flask_app
