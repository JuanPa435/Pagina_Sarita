from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        message = json.dumps({
            'status': 'ok',
            'message': 'Test endpoint working!',
            'service': 'Pagina Sarita Backend'
        })
        self.wfile.write(message.encode())
