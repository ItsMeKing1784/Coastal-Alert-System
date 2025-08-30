from models.alert import Alert
from models.user import User
import uuid
import datetime
import sqlalchemy
from sqlalchemy.exc import SQLAlchemyError
from Service.email_service import EmailService

class AlertService:
    def __init__(self, db_session, email_service: EmailService):
        self.db_session = db_session
        self.email_service = email_service

    def create_alert(self, data):
        try:
            email = data.get('email')
            user = self.db_session.query(User).filter_by(email=email).first()
            
            if not user or user.role != 'Govt':
                return False, 'Only Government Agent can create alerts.'
            
            alert_id = str(uuid.uuid4())
            insert_sql = sqlalchemy.text('''
                INSERT INTO public.alerts (
                    alert_id, zone_id, title, message, level, created_at
                ) VALUES (
                    :alert_id, :zone_id, :title, :message, :level, :created_at
                )
            ''')
            params = {
                'alert_id': alert_id,
                'zone_id': data['zone_id'],
                'title': data['title'],
                'message': data['message'],
                'level': data['level'],
                'created_at': datetime.datetime.utcnow()
            }
            self.db_session.execute(insert_sql, params)
            self.db_session.commit()

            # --- SEND EMAIL TO ALL USERS (EXCEPT GOVT) ---
            # users = self.db_session.query(User).filter(User.role != 'Govt').all()
            
            users = self.db_session.query(User).all()
            subject = f"New Alert: {data['title']}"
            body = f"""
            <p><strong>Alert Level:</strong> {data['level']}</p>
            <p><strong>Message:</strong> {data['message']}</p>
            <p><strong>Created At:</strong> {datetime.datetime.utcnow()}</p>
            """

            for u in users:
                self.email_service.send_email(
                    to_email=u.email,
                    subject=subject,
                    recipient_name=u.full_name if hasattr(u, 'full_name') else u.email,
                    alert_message=body
                )

            return True, alert_id
        except SQLAlchemyError as e:
            self.db_session.rollback()
            return False, str(e)
