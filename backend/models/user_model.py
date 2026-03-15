from utils.db_connection import get_db_connection

def create_user(email,wallet):

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
    "INSERT INTO users(email,wallet_address) VALUES (?,?)",
    (email,wallet)
    )

    conn.commit()
    conn.close()


def count_users():

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM users")
    count = cursor.fetchone()[0]

    conn.close()

    return count