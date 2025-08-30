from flask import Blueprint, request, jsonify
from models.user import User
from Service.auth_service import AuthService
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.user import Base
import yaml
from models.coastal_zone import CoastalZone
from Service.alert_service import AlertService
from routes.alert_routes import alert_bp
from db import db_session


with open('config.yml', 'r') as f:
    config = yaml.safe_load(f)

    
# Configure your database URI here
DATABASE_URI = config['database']['uri']
engine = create_engine(DATABASE_URI)
Session = sessionmaker(bind=engine)
Base.metadata.create_all(engine)

auth_bp = Blueprint('auth', __name__)
auth_service = AuthService(db_session)
alert_service = AlertService(db_session)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    success, result = auth_service.register_user(data)
    if success:
        return jsonify({'message': 'Registration successful', 'user_id': result}), 201
    else:
        return jsonify({'error': result}), 400

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    success, result = auth_service.login_user(data.get('email'), data.get('password'))
    if success:
        return jsonify({'message': 'Login successful', 'user_id': result.user_id , 'role' : result.role}), 200
    else:
        return jsonify({'error': result}), 401
