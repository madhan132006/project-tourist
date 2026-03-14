from utils.db_connection import get_db

def create_user(name,email,password):

    conn = get_db()

    conn.execute("""

    INSERT INTO users(name,email,password,role)

    VALUES(?,?,?,?)

    """,(name,email,password,"tourist"))

    conn.commit()


def get_user(email):

    conn = get_db()

    user = conn.execute(

    "SELECT * FROM users WHERE email=?",

    (email,)

    ).fetchone()

    return user