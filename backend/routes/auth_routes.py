from flask import Blueprint, request, jsonify
from models.user import User
from Service.auth_service import AuthService
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.user import Base
from models.coastal_zone import CoastalZone

# Configure your database URI here
DATABASE_URI = 'postgresql://mananpatel:Manan%401784@localhost:5432/postgres'
engine = create_engine(DATABASE_URI)
Session = sessionmaker(bind=engine)
Base.metadata.create_all(engine)
db_session = Session()

auth_bp = Blueprint('auth', __name__)
auth_service = AuthService(db_session)

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
        return jsonify({'message': 'Login successful', 'user_id': result.userid}), 200
    else:
        return jsonify({'error': result}), 401
