import os
import sys
from flask import Flask, send_from_directory
from flask_cors import CORS

from config.config import Config
from middleware.error_handler import register_error_handlers
from database.create_tables import init_db

from routes.auth_routes import auth_bp
from routes.incident_routes import incident_bp
from routes.alert_routes import alert_bp
from routes.location_routes import location_bp
from routes.admin_routes import admin_bp
from routes.feedback_routes import feedback_bp

def create_app():
    frontend_dir = os.path.join(Config.BASE_DIR, 'frontend')
    app = Flask(__name__, static_folder=frontend_dir, static_url_path='')
    app.config.from_object(Config)
    
    CORS(app)
    register_error_handlers(app)
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(incident_bp, url_prefix='/api/incidents')
    app.register_blueprint(alert_bp, url_prefix='/api/alerts')
    app.register_blueprint(location_bp, url_prefix='/api/locations')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(feedback_bp, url_prefix='/api/feedback')

    @app.route('/')
    def index():
        return send_from_directory(frontend_dir, 'login.html')
        
    @app.route('/<path:path>')
    def serve_html(path):
        if os.path.exists(os.path.join(frontend_dir, path)):
            return send_from_directory(frontend_dir, path)
        elif os.path.exists(os.path.join(frontend_dir, path + '.html')):
            return send_from_directory(frontend_dir, path + '.html')
        return send_from_directory(frontend_dir, 'login.html')

    return app

if __name__ == '__main__':
    print("Initialize Database if not exists...")
    init_db()
    
    app = create_app()
    print("Starting Flask server on http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
