from utils.db_connection import get_db

def save_location(tourist_id,lat,lng):

    conn = get_db()

    conn.execute("""

    INSERT INTO locations
    (tourist_id,latitude,longitude,timestamp)

    VALUES(?,?,?,datetime('now'))

    """,(tourist_id,lat,lng))

    conn.commit()