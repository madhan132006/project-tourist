from flask import Blueprint
from controllers.feedback_controller import submit_feedback, get_feedback
from middleware.auth_middleware import require_auth

feedback_bp = Blueprint('feedback', __name__)

feedback_bp.route('/', methods=['POST'])(require_auth()(submit_feedback))
feedback_bp.route('/', methods=['GET'])(require_auth(['admin'])(get_feedback))
