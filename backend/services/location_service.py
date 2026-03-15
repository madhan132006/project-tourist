from models.location_model import Location
from database.db_connection import get_db

def save_location(tourist_id, lat, lon, timestamp):
    conn = get_db()
    cursor = conn.cursor()
    # Insert or update latest location
    cursor.execute("""
        INSERT INTO locations (tourist_id, latitude, longitude, timestamp)
        VALUES (?, ?, ?, ?)
    """, (tourist_id, lat, lon, timestamp))
    conn.commit()