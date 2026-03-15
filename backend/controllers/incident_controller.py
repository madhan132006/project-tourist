from flask import request, jsonify
from utils.db_connection import get_db_connection

def report_incident():

    data = request.json

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO incidents
    (type,description,location,latitude,longitude,status)
    VALUES (?,?,?,?,?,'active')
    """,(
        data["type"],
        data["description"],
        data["location"],
        data["latitude"],
        data["longitude"]
    ))

    conn.commit()
    conn.close()

    return jsonify({"message":"Incident stored successfully"})