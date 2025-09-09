import json
import awsgi
from app import app  # imports your Flask app instance

def handler(event, context):
    # Forward the request into Flask via WSGI adapter
    return awsgi.response(app, event, context)
