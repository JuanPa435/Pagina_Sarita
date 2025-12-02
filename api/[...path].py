from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse
import json
import sys
import os

# Add parent directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

# Try to import Flask app
try:
    from backend.app import app as flask_app
    from werkzeug.wrappers import Request, Response
    FLASK_AVAILABLE = True
except Exception as e:
    FLASK_AVAILABLE = False
    IMPORT_ERROR = str(e)

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self._handle_request('GET')
    
    def do_POST(self):
        self._handle_request('POST')
    
    def do_PUT(self):
        self._handle_request('PUT')
    
    def do_DELETE(self):
        self._handle_request('DELETE')
    
    def _handle_request(self, method):
        if not FLASK_AVAILABLE:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            error_response = {
                'error': 'Flask app could not be loaded',
                'details': IMPORT_ERROR,
                'sys_path': sys.path[:5]  # First 5 paths for debugging
            }
            self.wfile.write(json.dumps(error_response).encode())
            return
        
        # Get request data
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length) if content_length > 0 else b''
        
        # Build full URL path (remove /api prefix if present)
        path = self.path
        if path.startswith('/api'):
            path = path[4:]  # Remove '/api' prefix
        
        # Create Flask request context
        with flask_app.test_request_context(
            path=path,
            method=method,
            data=body,
            headers=dict(self.headers)
        ):
            try:
                # Get Flask response
                flask_response = flask_app.full_dispatch_request()
                
                # Send response
                self.send_response(flask_response.status_code)
                
                # Copy headers
                for header, value in flask_response.headers:
                    self.send_header(header, value)
                
                # Always add CORS
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                # Send body
                self.wfile.write(flask_response.get_data())
                
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                error_response = {
                    'error': 'Internal server error',
                    'details': str(e),
                    'path': self.path
                }
                self.wfile.write(json.dumps(error_response).encode())
