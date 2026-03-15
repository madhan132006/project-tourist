from flask import Flask
from routes.admin_routes import admin_bp
from routes.incident_routes import incident_bp

app = Flask(__name__)

app.register_blueprint(admin_bp, url_prefix="/api/admin")
app.register_blueprint(incident_bp, url_prefix="/api/incidents")

@app.route("/")
def home():
    return "Tourist Safety Backend Running"

if __name__ == "__main__":
    app.run(debug=True, port=5000)