from flask import jsonify
from models.alert_model import AlertModel
from services.ai_prediction_service import AIPredictionService

def get_alerts():
    alerts = AlertModel.get_active_alerts()
    high_risk_zones = AIPredictionService.predict_risk_areas()
    return jsonify({
        'active_alerts': alerts,
        'ai_predictions': high_risk_zones
    }), 200
