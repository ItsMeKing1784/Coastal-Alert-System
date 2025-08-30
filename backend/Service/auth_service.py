from werkzeug.security import generate_password_hash, check_password_hash
from models.user import User
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
import datetime
import uuid

class AuthService:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def register_user(self, user_data):
        import sqlalchemy
        user_id = str(uuid.uuid4())
        password_hash = generate_password_hash(user_data['password_hash'])
        # Convert home_location dict to EWKT string
        hl = user_data.get('home_location')
        if isinstance(hl, dict) and hl.get('type') == 'Point':
            lon, lat = hl['coordinates']
            home_location = f'SRID=4326;POINT({lon} {lat})'
        else:
            home_location = hl  # Assume already EWKT or None
        # Convert alert_methods list to PostgreSQL array string
        am = user_data.get('alert_methods', ["SMS"])
        if isinstance(am, list):
            alert_methods = '{' + ','.join(am) + '}'
        else:
            alert_methods = am
        insert_sql = sqlalchemy.text('''
            INSERT INTO public.users (
                user_id, full_name, email, phone_number, password_hash, two_factor_enabled, role, organization, home_location, preferred_alert_radius, zone_id, alert_methods, preferred_language, alert_level_threshold, last_login, registration_date
            ) VALUES (
                :user_id, :full_name, :email, :phone_number, :password_hash, :two_factor_enabled, :role, :organization, ST_GeomFromEWKT(:home_location), :preferred_alert_radius, :zone_id, :alert_methods, :preferred_language, :alert_level_threshold, :last_login, :registration_date
            )
        ''')
        params = {
            'user_id': user_id,
            'full_name': user_data['full_name'],
            'email': user_data['email'],
            'phone_number': user_data.get('phone_number'),
            'password_hash': password_hash,
            'two_factor_enabled': user_data.get('two_factor_enabled', False),
            'role': user_data['role'],
            'organization': user_data.get('organization'),
            'home_location': home_location,  # EWKT string
            'preferred_alert_radius': user_data.get('preferred_alert_radius', 10),
            'zone_id': user_data.get('zone_id'),
            'alert_methods': alert_methods,  # PostgreSQL array string
            'preferred_language': user_data.get('preferred_language', 'en'),
            'alert_level_threshold': user_data.get('alert_level_threshold', 'Severe'),
            'last_login': None,
            'registration_date': datetime.datetime.utcnow()
        }
        try:
            self.db_session.execute(insert_sql, params)
            self.db_session.commit()
            return True, user_id
        except IntegrityError:
            self.db_session.rollback()
            return False, 'Email already exists.'

    def login_user(self, email, password):
        user = self.db_session.query(User).filter_by(email=email).first()
        if user and check_password_hash(user.password, password):
            return True, user
        return False, 'Invalid credentials.'
