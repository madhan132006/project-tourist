from utils.db_connection import get_db_connection

class FeedbackModel:
    @staticmethod
    def add_feedback(name, email, message, rating):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO feedback (name, email, message, rating) VALUES (?, ?, ?, ?)',
            (name, email, message, rating)
        )
        conn.commit()
        feedback_id = cursor.lastrowid
        conn.close()
        return feedback_id

    @staticmethod
    def get_all_feedback():
        conn = get_db_connection()
        feedback_list = conn.execute('SELECT * FROM feedback ORDER BY timestamp DESC').fetchall()
        conn.close()
        return [dict(row) for row in feedback_list]
