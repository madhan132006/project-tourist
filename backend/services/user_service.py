from models.user_model import get_total_tourists, add_tourist

def increment_tourist_service(name):
    add_tourist(name)
    return get_total_tourists()