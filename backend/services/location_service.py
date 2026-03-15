from models.location_model import LocationModel
from services.geo_fencing_service import GeoFencingService

class LocationService:
    @staticmethod
    def update_location(tourist_id, lat, lng):
        loc_id = LocationModel.add_location(tourist_id, lat, lng)
        GeoFencingService.check_location(tourist_id, lat, lng)
        return loc_id
