from models.incident_model import IncidentModel
from utils.security import generate_blockchain_hash
from datetime import datetime

class IncidentService:
    @staticmethod
    def report_incident(tourist_name, location, description):
        incident_data = {
            "tourist_name": tourist_name,
            "location": location,
            "description": description,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        blockchain_hash = generate_blockchain_hash(incident_data)
        
        incident_id = IncidentModel.create_incident(
            tourist_name=tourist_name,
            location=location,
            description=description,
            blockchain_hash=blockchain_hash
        )
        
        return {
            "incident_id": incident_id,
            "blockchain_hash": blockchain_hash,
            "status": "Verified on Blockchain Network (Simulated)"
        }
