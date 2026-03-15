from utils.db_connection import get_db_connection

class LocationModel:
    @staticmethod
    def add_location(user_id, latitude, longitude):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO locations (user_id, latitude, longitude) VALUES (?, ?, ?)',
            (user_id, latitude, longitude)
        )
        conn.commit()
        location_id = cursor.lastrowid
        conn.close()
        return location_id

    @staticmethod
    def get_all_recent():
        # Get the latest location for each user to show on map
        conn = get_db_connection()
        query = '''
            SELECT l1.* FROM locations l1
            INNER JOIN (
                SELECT user_id, MAX(timestamp) as max_ts
                FROM locations
                GROUP BY user_id
            ) l2 ON l1.user_id = l2.user_id AND l1.timestamp = l2.max_ts
        '''
        locations = conn.execute(query).fetchall()
        conn.close()
        return [dict(loc) for loc in locations]

    @staticmethod
    def get_tourist_count():
        # Count unique users who have tracked locations
        conn = get_db_connection()
        count = conn.execute('SELECT COUNT(DISTINCT user_id) as count FROM locations').fetchone()
        conn.close()
        return count['count'] if count else 0
