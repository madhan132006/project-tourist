from database.db_connection import get_db

def increment_incident():
    conn = get_db()
    cursor = conn.cursor()
    
    # Assuming we have 'incidents' table with 'count' column
    cursor.execute("INSERT INTO incidents DEFAULT VALUES")  # one row per incident
    conn.commit()
    
    cursor.execute("SELECT COUNT(*) FROM incidents")
    total = cursor.fetchone()[0]
    return total

def get_total_incidents():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM incidents")
    total = cursor.fetchone()[0]
    return total