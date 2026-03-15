from database.db_connection import get_db_connection

def get_total_incidents():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM incidents")
    total = cur.fetchone()[0]
    conn.close()
    return total

def add_incident(name, category, comment):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO incidents (name, category, comment, created_at) VALUES (?, ?, ?, datetime('now'))",
        (name, category, comment)
    )
    conn.commit()
    conn.close()