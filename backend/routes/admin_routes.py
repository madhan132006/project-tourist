from flask import Blueprint, jsonify
from models.incident_model import IncidentModel
from models.alert_model import AlertModel
from models.location_model import LocationModel
from middleware.auth_middleware import require_auth

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/dashboard', methods=['GET'])
@require_auth(['admin'])
def get_dashboard_stats():
    total_incidents = IncidentModel.get_total_count()
    total_tourists = LocationModel.get_total_tourists_count()
    active_alerts = AlertModel.get_active_count()
    
    return jsonify({
        'total_incidents': total_incidents,
        'total_tourists': total_tourists,
        'active_alerts': active_alerts
    }), 200
