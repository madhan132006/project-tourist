from flask import Blueprint
from controllers.auth_controller import increment_tourist

auth_bp = Blueprint('auth_bp', __name__)
auth_bp.route('/increment', methods=['POST'])(increment_tourist)