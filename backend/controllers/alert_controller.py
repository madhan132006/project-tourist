from flask import jsonify
from utils.db_connection import get_db_connection

def dashboard_counts():

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM incidents")
    incidents = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM users")
    tourists = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM incidents WHERE status='active'")
    alerts = cursor.fetchone()[0]

    conn.close()

    return jsonify({
        "totalIncidents": incidents,
        "totalTourists": tourists,
        "activeAlerts": alerts
    })