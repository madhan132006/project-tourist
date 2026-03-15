from utils.db_connection import get_db_connection

def create_incident(data,block_hash):

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO incidents
    (type,description,location,latitude,longitude,blockchain_hash)
    VALUES (?,?,?,?,?,?)
    """,(
        data["type"],
        data["description"],
        data["location"],
        data["latitude"],
        data["longitude"],
        block_hash
    ))

    conn.commit()
    conn.close()


def count_incidents():

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM incidents")
    count = cursor.fetchone()[0]

    conn.close()

    return count


def count_active_incidents():

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM incidents WHERE status='active'")
    count = cursor.fetchone()[0]

    conn.close()

    return count