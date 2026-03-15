from utils.db_connection import get_db_connection

conn = get_db_connection()
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS users(
id INTEGER PRIMARY KEY AUTOINCREMENT,
email TEXT,
wallet_address TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS incidents(
id INTEGER PRIMARY KEY AUTOINCREMENT,
type TEXT,
description TEXT,
location TEXT,
latitude REAL,
longitude REAL,
status TEXT DEFAULT 'active',
blockchain_hash TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS alerts(
id INTEGER PRIMARY KEY AUTOINCREMENT,
incident_id INTEGER,
message TEXT,
status TEXT DEFAULT 'active'
)
""")

conn.commit()
conn.close()

print("Tables created successfully")