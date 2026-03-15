from flask import request, jsonify
from services.incident_service import IncidentService
from models.incident_model import IncidentModel

def report_incident():
    data = request.get_json()
    tourist_name = data.get('tourist_name')
    location = data.get('location')
    description = data.get('description')
    
    if not all([tourist_name, location, description]):
        return jsonify({'error': 'Missing required fields'}), 400
        
    result = IncidentService.report_incident(tourist_name, location, description)
    return jsonify(result), 201

def get_incidents():
    incidents = IncidentModel.get_all_incidents()
    return jsonify(incidents), 200
