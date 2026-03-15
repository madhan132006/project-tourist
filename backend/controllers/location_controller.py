from flask import request, jsonify
from models.location_model import Location
from services.location_service import save_location

def update_location():
    data = request.get_json()
    tourist_id = data.get('touristId')
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    timestamp = data.get('timestamp')

    if not (tourist_id and latitude and longitude and timestamp):
        return jsonify({"error": "Missing fields"}), 400

    # Save to DB
    save_location(tourist_id, latitude, longitude, timestamp)
    return jsonify({"message": "Location updated"}), 200