import hashlib
import json
from datetime import datetime
import jwt
from werkzeug.security import generate_password_hash, check_password_hash
from config.config import Config

def hash_password(password):
    return generate_password_hash(password)

def verify_password(password, hashed_password):
    return check_password_hash(hashed_password, password)

def generate_blockchain_hash(incident_data):
    """
    Generates a SHA-256 hash for incident records.
    """
    data_string = json.dumps(incident_data, sort_keys=True)
    return hashlib.sha256(data_string.encode('utf-8')).hexdigest()

def generate_jwt_token(user_id, role, wallet_address=None):
    payload = {
        'user_id': user_id,
        'role': role,
        'wallet_address': wallet_address,
        'exp': datetime.utcnow().timestamp() + (24 * 3600) # 1 day expiration
    }
    return jwt.encode(payload, Config.SECRET_KEY, algorithm='HS256')

def decode_jwt_token(token):
    try:
        payload = jwt.decode(token, Config.SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
