from flask import Blueprint, jsonify, request
from models.incident_model import Incident
from database.database import get_db

incident_bp = Blueprint('incident', __name__)

# Get total incidents
@incident_bp.route("/dashboard-counts", methods=["GET"])
def dashboard_counts():
    db = get_db()
    total_incidents = db.execute("SELECT COUNT(*) FROM incidents").fetchone()[0]
    total_tourists = db.execute("SELECT COUNT(*) FROM tourists").fetchone()[0]
    return jsonify({"total_incidents": total_incidents, "total_tourists": total_tourists})

# Increment incident count (report feedback)
@incident_bp.route("/increment-incident", methods=["POST"])
def increment_incident():
    db = get_db()
    # Add a dummy incident (or real data if sent from frontend)
    db.execute("INSERT INTO incidents (description, timestamp) VALUES (?, ?)",
               ("Feedback Reported", request.json.get("timestamp")))
    db.commit()
    return jsonify({"message": "Incident incremented"}), 201