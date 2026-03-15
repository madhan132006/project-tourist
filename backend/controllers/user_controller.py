from flask import request, jsonify
from services.user_service import increment_tourist_service
from models.user_model import get_total_tourists

def get_tourist_count():
    total = get_total_tourists()
    return jsonify({"total_tourists": total})

def increment_tourist():
    data = request.json
    name = data.get("name", "Guest")
    total = increment_tourist_service(name)
    return jsonify({"total_tourists": total})