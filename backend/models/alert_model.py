from utils.db_connection import get_db_connection

class AlertModel:
    @staticmethod
    def get_all_active():
        conn = get_db_connection()
        alerts = conn.execute('SELECT * FROM alerts WHERE is_active = 1 ORDER BY timestamp DESC').fetchall()
        conn.close()
        return [dict(a) for a in alerts]
    
    @staticmethod
    def create_alert(message, level='warning'):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO alerts (message, level) VALUES (?, ?)',
            (message, level)
        )
        conn.commit()
        alert_id = cursor.lastrowid
        conn.close()
        return alert_id
    
    @staticmethod
    def get_active_count():
        conn = get_db_connection()
        count = conn.execute('SELECT COUNT(*) as count FROM alerts WHERE is_active = 1').fetchone()
        conn.close()
        return count['count'] if count else 0
