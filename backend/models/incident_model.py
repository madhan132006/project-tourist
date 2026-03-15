from utils.db_connection import get_db_connection
import datetime

class IncidentModel:
    @staticmethod
    def get_all():
        conn = get_db_connection()
        incidents = conn.execute('SELECT * FROM incidents ORDER BY timestamp DESC').fetchall()
        conn.close()
        return [dict(i) for i in incidents]

    @staticmethod
    def create_incident(tourist_name, location, description, blockchain_hash):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO incidents (tourist_name, location, description, blockchain_hash) VALUES (?, ?, ?, ?)',
            (tourist_name, location, description, blockchain_hash)
        )
        conn.commit()
        incident_id = cursor.lastrowid
        conn.close()
        return incident_id

    @staticmethod
    def get_count():
        conn = get_db_connection()
        result = conn.execute('SELECT COUNT(*) as count FROM incidents').fetchone()
        conn.close()
        return result['count'] if result else 0
