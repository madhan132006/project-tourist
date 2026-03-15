import hashlib
import json
from models import incident_model

def store_incident(data):

    # Blockchain style hash
    incident_string = json.dumps(data)

    block_hash = hashlib.sha256(
        incident_string.encode()
    ).hexdigest()

    incident_model.create_incident(data,block_hash)

    return block_hash