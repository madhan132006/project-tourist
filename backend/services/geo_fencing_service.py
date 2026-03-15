from models.alert_model import AlertModel

class GeoFencingService:
    DANGER_ZONES = [
        {"name": "Restricted Area A", "lat": 40.7128, "lng": -74.0060, "radius": 5.0},
        {"name": "Avalanche Zone B", "lat": 34.0522, "lng": -118.2437, "radius": 10.0}
    ]
    
    @staticmethod
    def check_location(tourist_id, lat, lng):
        for zone in GeoFencingService.DANGER_ZONES:
            dist = ((zone['lat'] - lat)**2 + (zone['lng'] - lng)**2)**0.5
            if dist < 0.1:  # Simple distance check
                msg = f"Tourist {tourist_id} entered danger zone: {zone['name']}"
                AlertModel.create_alert(msg, "High")
                return True
        return False
