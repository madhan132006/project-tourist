from flask import Blueprint
from controllers.alert_controller import dashboard_counts

admin_bp = Blueprint("admin_bp", __name__)

@admin_bp.route("/dashboard-stats", methods=["GET"])
def stats():
    return dashboard_counts()