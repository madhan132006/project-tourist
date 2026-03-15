import sqlite3
import os
import sys

# Add parent directory to path so we can import config
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from config.config import Config

def create_tables():
    db_dir = os.path.dirname(Config.DATABASE_URI)
    if not os.path.exists(db_dir):
        os.makedirs(db_dir, exist_ok=True)
        
    conn = sqlite3.connect(Config.DATABASE_URI)
    cursor = conn.cursor()

    # Users
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT,
        wallet_address TEXT UNIQUE,
        role TEXT DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # Incidents
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS incidents (
        incident_id INTEGER PRIMARY KEY AUTOINCREMENT,
        tourist_name TEXT NOT NULL,
        location TEXT NOT NULL,
        description TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        blockchain_hash TEXT UNIQUE NOT NULL
    )
    ''')

    # Alerts
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message TEXT NOT NULL,
        level TEXT DEFAULT 'warning',
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT 1
    )
    ''')

    # Locations
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
    ''')

    conn.commit()
    conn.close()
    print("Tables created successfully.")

if __name__ == '__main__':
    create_tables()
