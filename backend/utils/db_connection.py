import sqlite3
from config.config import Config
import os

def get_db_connection():
    db_dir = os.path.dirname(Config.DATABASE_URI)
    if not os.path.exists(db_dir):
        os.makedirs(db_dir, exist_ok=True)
    conn = sqlite3.connect(Config.DATABASE_URI, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn
