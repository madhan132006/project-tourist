import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'super-secret-key-123'
    # Base directory of the project (parent of backend folder)
    BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    DATABASE_URI = os.path.join(BASE_DIR, 'backend', 'database', 'database.db')
