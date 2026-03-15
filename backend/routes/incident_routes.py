from flask import Blueprint
from controllers.incident_controller import report_incident

incident_bp = Blueprint("incident_bp", __name__)

incident_bp.route("/report", methods=["POST"])(report_incident)