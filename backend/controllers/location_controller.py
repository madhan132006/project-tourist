from flask import request, jsonify
from services.location_service import LocationService
from models.location_model import LocationModel

def update_location():
    data = request.get_json()
    lat = data.get('latitude')
    lng = data.get('longitude')
    
    tourist_id = getattr(request, 'user_id', 1) 
    
    if lat is None or lng is None:
        return jsonify({'error': 'Latitude and longitude required'}), 400
        
    loc_id = LocationService.update_location(tourist_id, lat, lng)
    return jsonify({'message': 'Location updated successfully', 'location_id': loc_id}), 200

def get_locations():
    locations = LocationModel.get_recent_locations()
    return jsonify(locations), 200
