from functools import wraps
from flask import request, jsonify
from utils.security import decode_jwt_token

def require_auth(roles=None):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return jsonify({'error': 'Missing or invalid authentication token'}), 401
                
            token = auth_header.split(' ')[1]
            payload = decode_jwt_token(token)
            
            if not payload:
                return jsonify({'error': 'Token is invalid or expired'}), 401
                
            if roles and payload.get('role') not in roles:
                return jsonify({'error': 'Unauthorized access'}), 403
                
            request.user_id = payload.get('user_id')
            request.user_role = payload.get('role')
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator
