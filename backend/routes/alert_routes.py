from flask import Blueprint
from controllers.alert_controller import get_alerts
from middleware.auth_middleware import require_auth

alert_bp = Blueprint('alerts', __name__)

alert_bp.route('/', methods=['GET'])(require_auth()(get_alerts))
