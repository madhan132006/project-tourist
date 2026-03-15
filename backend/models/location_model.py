# Simple SQLite model for locations
class Location:
    table_name = "locations"
    columns = ["id", "tourist_id", "latitude", "longitude", "timestamp"]