from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import the Flask app from backend
from backend.app import app as flask_app

# Enable CORS
CORS(flask_app, resources={r"/*": {"origins": "*"}})

# Vercel serverless function handler
app = flask_app
