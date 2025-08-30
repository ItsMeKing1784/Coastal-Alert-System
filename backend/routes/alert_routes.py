from Service.alert_service import AlertService
from Service.email_service import EmailService
from flask import Blueprint, request, jsonify
from db import db_session
from config import config  # <-- import your config

alert_bp = Blueprint('alert', __name__)

# Load from config.yml
SMTP_SERVER = config["smtp"]["server"]
SMTP_PORT = config["smtp"]["port"]
SMTP_USER = config["smtp"]["user"]
SMTP_PASSWORD = config["smtp"]["password"]

email_service = EmailService(SMTP_SERVER, SMTP_PORT, SMTP_USER, SMTP_PASSWORD)
alert_service = AlertService(db_session, email_service)

@alert_bp.route('/create-alert', methods=['POST'])
def create_alert():
    data = request.json
    
    success, result = alert_service.create_alert(data)
    if success:
        return jsonify({'message': 'Alert created successfully', 'alert_id': result}), 201
    else:
        return jsonify({'error': result}), 403
