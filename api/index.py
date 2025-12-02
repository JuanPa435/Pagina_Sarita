from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import json
import sys
import os

# Add paths
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from backend.app import app as flask_app
    HAS_FLASK = True
except Exception as e:
    HAS_FLASK = False
    ERROR_MSG = str(e)

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if not HAS_FLASK:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'error': 'Flask app could not be imported',
                'message': ERROR_MSG,
                'path': sys.path
            }).encode())
            return
        
        # Use Flask app
        with flask_app.test_request_context(self.path):
            try:
                response = flask_app.full_dispatch_request()
                self.send_response(response.status_code)
                for header, value in response.headers:
                    self.send_header(header, value)
                self.end_headers()
                self.wfile.write(response.get_data())
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'error': str(e),
                    'path': self.path
                }).encode())
    
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length) if content_length > 0 else b''
        
        if not HAS_FLASK:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Flask not available'}).encode())
            return
        
        with flask_app.test_request_context(self.path, method='POST', data=body):
            try:
                response = flask_app.full_dispatch_request()
                self.send_response(response.status_code)
                for header, value in response.headers:
                    self.send_header(header, value)
                self.end_headers()
                self.wfile.write(response.get_data())
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
