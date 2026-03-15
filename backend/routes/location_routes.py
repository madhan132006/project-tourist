from flask import Blueprint
from controllers.location_controller import update_location, get_locations
from middleware.auth_middleware import require_auth

location_bp = Blueprint('locations', __name__)

location_bp.route('/', methods=['POST'])(require_auth()(update_location))
location_bp.route('/', methods=['GET'])(require_auth(['admin'])(get_locations))
