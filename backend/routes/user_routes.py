from flask import Blueprint, jsonify
from database.database import get_db

user_bp = Blueprint('user', __name__)

# Increment tourist count (on login)
@user_bp.route("/increment-tourist", methods=["POST"])
def increment_tourist():
    db = get_db()
    db.execute("INSERT INTO tourists (name, login_time) VALUES (?, ?)",
               ("Anonymous", "now"))
    db.commit()
    return jsonify({"message": "Tourist incremented"}), 201