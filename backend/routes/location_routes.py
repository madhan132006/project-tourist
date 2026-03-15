from flask import Blueprint, request, jsonify
from database.database import get_db

location_bp = Blueprint('location', __name__)

@location_bp.route("/update-location", methods=["POST"])
def update_location():
    data = request.json
    db = get_db()
    db.execute("INSERT INTO locations (tourist_id, latitude, longitude, timestamp) VALUES (?, ?, ?, ?)",
               (data["touristId"], data["latitude"], data["longitude"], data["timestamp"]))
    db.commit()
    return jsonify({"message": "Location updated"}), 201