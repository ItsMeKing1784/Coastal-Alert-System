import yaml
from flask import Flask, jsonify
from sqlalchemy import text
from flask_sqlalchemy import SQLAlchemy
from routes.auth_routes import auth_bp
from routes.alert_routes import alert_bp


# Load config from YAML
with open('config.yml', 'r') as f:
    config = yaml.safe_load(f)

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = config['database']['uri']
app.config['SECRET_KEY'] = config['secret_key']
app.config['DEBUG'] = config.get('debug', True)
db = SQLAlchemy(app)
app.register_blueprint(auth_bp)
app.register_blueprint(alert_bp)

@app.route('/')
def home():
    return "Connected to PostgreSQL!"

# Route to fetch all users from the users table
@app.route('/users')
def get_users():
    result = db.session.execute(text('SELECT * FROM public.coastal_zones'))
    users = [dict(row._mapping) for row in result]
    return jsonify(users)

if __name__ == '__main__':
    app.run(debug=app.config['DEBUG'], port=8000)