from flask import jsonify
from services.incident_service import increment_incident, get_total_incidents

# Increment incident count (called when feedback/report submitted)
def increment_incident_controller():
    new_count = increment_incident()
    return jsonify({"total_incidents": new_count}), 200

# Get total incidents
def get_incident_count_controller():
    total = get_total_incidents()
    return jsonify({"total_incidents": total}), 200