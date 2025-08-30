from Service.alert_service import AlertService
from flask import Blueprint, request, jsonify
from models.user import User
from models.alert import Alert
from sqlalchemy.orm import Session
import uuid, datetime
from db import db_session

alert_bp = Blueprint('alert', __name__)

alert_service = AlertService(db_session)

@alert_bp.route('/create-alert', methods=['POST'])
def create_alert():
    data = request.json
    success, result = alert_service.create_alert(data)
    if success:
        return jsonify({'message': 'Alert created successfully', 'alert_id': result}), 201
    else:
        return jsonify({'error': result}), 403
