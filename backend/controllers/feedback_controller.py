from flask import request, jsonify
from models.feedback_model import FeedbackModel

def submit_feedback():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')
    rating = data.get('rating')
    
    if not all([name, message, rating]):
        return jsonify({'error': 'Name, message, and rating are required'}), 400
        
    feedback_id = FeedbackModel.add_feedback(name, email, message, rating)
    return jsonify({'message': 'Feedback submitted successfully', 'feedback_id': feedback_id}), 201

def get_feedback():
    feedback = FeedbackModel.get_all_feedback()
    return jsonify(feedback), 200
