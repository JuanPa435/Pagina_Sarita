from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# Add parent directory to path to access conexion module
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, parent_dir)

# Import the Flask app from the same directory
from app import app as flask_app

# Enable CORS
CORS(flask_app, resources={r"/*": {"origins": "*"}})

# Vercel serverless function handler
app = flask_app
