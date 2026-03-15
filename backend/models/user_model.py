from utils.db_connection import get_db_connection

class UserModel:
    @staticmethod
    def get_by_email(email):
        conn = get_db_connection()
        user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
        conn.close()
        return user
    
    @staticmethod
    def get_by_wallet(wallet_address):
        conn = get_db_connection()
        user = conn.execute('SELECT * FROM users WHERE wallet_address = ?', (wallet_address,)).fetchone()
        conn.close()
        return user

    @staticmethod
    def create_user(email, password, wallet_address=None, role='user'):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO users (email, password, wallet_address, role) VALUES (?, ?, ?, ?)',
            (email, password, wallet_address, role)
        )
        conn.commit()
        user_id = cursor.lastrowid
        conn.close()
        return user_id
