# backend/routes/dashboard_routes.py
from flask import Blueprint
from backend.controllers.dashboard_controller import get_dashboard_counts, increment_tourist, increment_incident, update_location

dashboard_bp = Blueprint("dashboard_bp", __name__)

dashboard_bp.route("/api/dashboard-counts")(get_dashboard_counts)
dashboard_bp.route("/api/increment-tourist", methods=["POST"])(increment_tourist)
dashboard_bp.route("/api/increment-incident", methods=["POST"])(increment_incident)
dashboard_bp.route("/api/update-location", methods=["POST"])(update_location)