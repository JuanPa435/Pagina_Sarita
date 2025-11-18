from flask import Flask
from backend.app import app
from flask_cors import CORS

CORS(app, resources={r"/*": {"origins": "*"}})

def handler(event, context):
    return app(event, context)
