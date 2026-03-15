from models.incident_model import IncidentModel

class AIPredictionService:
    @staticmethod
    def predict_risk_areas():
        """
        Simple AI risk prediction based on incident frequency.
        """
        incidents = IncidentModel.get_all_incidents()
        location_counts = {}
        for inc in incidents:
            loc = inc['location']
            location_counts[loc] = location_counts.get(loc, 0) + 1
            
        high_risk = []
        for loc, count in location_counts.items():
            if count >= 3:
                high_risk.append({"location": loc, "risk_level": "High", "incidents": count})
            elif count >= 1:
                high_risk.append({"location": loc, "risk_level": "Medium", "incidents": count})
                
        return sorted(high_risk, key=lambda x: x['incidents'], reverse=True)
