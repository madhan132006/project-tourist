import sqlite3

conn = sqlite3.connect("backend/database/database.db")
cursor = conn.cursor()

# Table for dashboard counts
cursor.execute("""
CREATE TABLE IF NOT EXISTS dashboard_stats (
    id INTEGER PRIMARY KEY,
    total_incidents INTEGER DEFAULT 0,
    total_tourists INTEGER DEFAULT 0
)
""")

# Initialize if empty
cursor.execute("SELECT COUNT(*) FROM dashboard_stats")
if cursor.fetchone()[0] == 0:
    cursor.execute("INSERT INTO dashboard_stats (total_incidents, total_tourists) VALUES (0,0)")

# Table for locations
cursor.execute("""
CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tourist_id TEXT,
    latitude REAL,
    longitude REAL,
    timestamp TEXT
)
""")

conn.commit()
conn.close()
print("Tables created and initialized successfully.")