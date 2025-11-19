#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

    def translate_path(self, path):
        if path in ('', '/'):
            path = '/index.html'
        return super().translate_path(path)

if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', '8080'))
    BIND = os.environ.get('BIND', '127.0.0.1')
    with socketserver.TCPServer((BIND, PORT), CustomHandler) as httpd:
        print(f"Serving HTTP on {BIND} port {PORT} (http://{BIND}:{PORT}/) ...")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print('\nShutting down...')
            sys.exit(0)
