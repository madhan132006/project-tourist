from flask import jsonify
from utils.db_connection import get_db

def increment_tourist():
    db = get_db()
    # Here we can track daily visitors or unique tourists
    db.execute("INSERT INTO users (name, login_time) VALUES (?, datetime('now'))", ("Tourist",))
    db.commit()
    total_tourists = db.execute("SELECT COUNT(*) FROM users").fetchone()[0]
    return jsonify({"total_tourists": total_tourists})