from models.alert import Alert
from models.user import User
import uuid
import datetime
import sqlalchemy

class AlertService:
    def __init__(self, db_session):
        self.db_session = db_session

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
            return True, alert_id
        except SQLAlchemyError as e:
            self.db_session.rollback()  # <-- VERY IMPORTANT
            return False, str(e)
