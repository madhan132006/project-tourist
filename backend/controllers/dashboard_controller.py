# backend/controllers/dashboard_controller.py

from flask import jsonify, request
from backend.models.incident_model import Incident
from backend.models.user_model import User
from backend.models.location_model import Location
from backend.database.database import db

# 1️⃣ Get dashboard counts
def get_dashboard_counts():
    total_incidents = Incident.query.count()
    total_tourists = User.query.count()
    return jsonify({
        "total_incidents": total_incidents,
        "total_tourists": total_tourists
    })

# 2️⃣ Increment tourist count (new visitor)
def increment_tourist():
    # For demo, just add a new User entry
    new_user = User(name="Tourist")  # optional: generate unique ID
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "Tourist count incremented"})

# 3️⃣ Increment incident count
def increment_incident():
    # For demo, add a placeholder incident
    new_incident = Incident(description="New incident reported")
    db.session.add(new_incident)
    db.session.commit()
    return jsonify({"message": "Incident count incremented"})

# 4️⃣ Update tourist location
def update_location():
    data = request.get_json()
    tourist_id = data.get("touristId")
    latitude = data.get("latitude")
    longitude = data.get("longitude")
    
    location = Location.query.filter_by(tourist_id=tourist_id).first()
    if not location:
        location = Location(tourist_id=tourist_id, latitude=latitude, longitude=longitude)
        db.session.add(location)
    else:
        location.latitude = latitude
        location.longitude = longitude
    
    db.session.commit()
    return jsonify({"message": "Location updated"})