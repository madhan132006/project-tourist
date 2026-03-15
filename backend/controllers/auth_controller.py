from flask import request, jsonify
from models.user_model import UserModel
from utils.security import verify_password, generate_jwt_token, hash_password

def login():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid request'}), 400
        
    wallet_address = data.get('wallet_address')
    if wallet_address:
        user = UserModel.get_by_wallet(wallet_address)
        if not user:
            user_id = UserModel.create_user(email=None, password=None, wallet_address=wallet_address)
            role = 'user'
        else:
            user_id = user['id']
            role = user['role']
        token = generate_jwt_token(user_id, role, wallet_address)
        return jsonify({'token': token, 'role': role, 'message': 'Wallet login successful'}), 200

    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400
        
    user = UserModel.get_by_email(email)
    
    # Auto-register if the email doesn't exist
    if not user:
        hashed_pw = hash_password(password)
        user_id = UserModel.create_user(email=email, password=hashed_pw, role='user')
        role = 'user'
    else:
        # If user exists, verify password
        if not user['password'] or not verify_password(password, user['password']):
            return jsonify({'error': 'Invalid credentials'}), 401
        user_id = user['id']
        role = user['role']
        
    token = generate_jwt_token(user_id, role)
    return jsonify({'token': token, 'role': role, 'message': 'Login/Registration successful'}), 200
