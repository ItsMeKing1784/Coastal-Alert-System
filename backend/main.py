import yaml
from flask import Flask, jsonify
from flask_cors import CORS
from sqlalchemy import text
from flask_sqlalchemy import SQLAlchemy
from routes.auth_routes import auth_bp
from routes.alert_routes import alert_bp
from routes.coastal_zones_routes import zone_routes
from db import SessionLocal

# Load config
with open('config.yml', 'r') as f:
    config = yaml.safe_load(f)

app = Flask(__name__)
app.config['SECRET_KEY'] = config['secret_key']
app.config['DEBUG'] = config.get('debug', True)
# Ensure database URI is set
if 'database' in config and 'uri' in config['database']:
    app.config['SQLALCHEMY_DATABASE_URI'] = config['database']['uri']
else:
    raise RuntimeError("Missing 'database: uri' in config.yml")
CORS(app)
db = SQLAlchemy(app)
app.register_blueprint(auth_bp)
app.register_blueprint(alert_bp)
app.register_blueprint(zone_routes)

@app.route("/")
def home():
    return "Coastal Alert System API is running!"

@app.teardown_appcontext
def shutdown_session(exception=None):
    """
    Remove/close the SQLAlchemy session after each request
    """
    SessionLocal.remove()

if __name__ == "__main__":
    app.run(debug=app.config['DEBUG'], port=8000)
