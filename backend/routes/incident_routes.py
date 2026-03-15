from flask import Blueprint
from controllers.incident_controller import report_incident, get_incidents
from middleware.auth_middleware import require_auth

incident_bp = Blueprint('incidents', __name__)

incident_bp.route('/', methods=['POST'])(require_auth()(report_incident))
incident_bp.route('/', methods=['GET'])(require_auth(['admin'])(get_incidents))
