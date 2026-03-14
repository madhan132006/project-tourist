from utils.db_connection import get_db

def create_tables():

    conn = get_db()

    conn.execute("""

    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        password TEXT,
        role TEXT
    )

    """)

    conn.execute("""

    CREATE TABLE IF NOT EXISTS incidents(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tourist_id INTEGER,
        description TEXT,
        latitude REAL,
        longitude REAL,
        status TEXT,
        created_at TEXT
    )

    """)

    conn.execute("""

    CREATE TABLE IF NOT EXISTS locations(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tourist_id INTEGER,
        latitude REAL,
        longitude REAL,
        timestamp TEXT
    )

    """)

    conn.execute("""

    CREATE TABLE IF NOT EXISTS alerts(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message TEXT,
        location TEXT,
        created_at TEXT
    )

    """)

    conn.commit()