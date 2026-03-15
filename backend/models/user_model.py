from database.db_connection import get_db_connection

def get_total_tourists():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM users")
    total = cur.fetchone()[0]
    conn.close()
    return total

def add_tourist(name):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO users (name, created_at) VALUES (?, datetime('now'))",
        (name,)
    )
    conn.commit()
    conn.close()