from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database/database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# ----- Models -----
class Tourist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)

class Incident(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    category = db.Column(db.String(50))
    rating = db.Column(db.Integer)
    comment = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Location(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tourist_id = db.Column(db.Integer, db.ForeignKey('tourist.id'))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# ----- Routes -----

# Dashboard counts
@app.route('/api/dashboard-counts', methods=['GET'])
def dashboard_counts():
    total_incidents = Incident.query.count()
    total_tourists = Tourist.query.count()
    return jsonify({
        "total_incidents": total_incidents,
        "total_tourists": total_tourists
    })

# Increment tourist (new visitor)
@app.route('/api/increment-tourist', methods=['POST'])
def increment_tourist():
    new_tourist = Tourist(name="Anonymous")  # or get from login
    db.session.add(new_tourist)
    db.session.commit()
    return jsonify({"message":"Tourist added"}), 201

# Increment incident (from feedback/report)
@app.route('/api/increment-incident', methods=['POST'])
def increment_incident():
    data = request.get_json()
    incident = Incident(
        name=data.get("name", "Anonymous"),
        category=data.get("category", "Other"),
        rating=data.get("rating", 0),
        comment=data.get("comment", "")
    )
    db.session.add(incident)
    db.session.commit()
    return jsonify({"message":"Incident recorded"}), 201

# Update live location
@app.route('/api/update-location', methods=['POST'])
def update_location():
    data = request.get_json()
    loc = Location(
        tourist_id=data.get("touristId"),
        latitude=data.get("latitude"),
        longitude=data.get("longitude")
    )
    db.session.add(loc)
    db.session.commit()
    return jsonify({"message":"Location updated"}), 201

# Run the app
if __name__ == "__main__":
    db.create_all()
    app.run(debug=True)