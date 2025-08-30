from werkzeug.security import generate_password_hash, check_password_hash
from models.user import User
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
import datetime
import uuid
import sqlalchemy, uuid, datetime
from werkzeug.security import generate_password_hash
from sqlalchemy.exc import IntegrityError

class AuthService:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def register_user(self, user_data):
        # ---- Role & Email Verification ----
        role = user_data.get("role")
        email = user_data.get("email", "")

        GOV_DOMAINS = ["gov.in","gmail.com", "nic.in"]
        CIVIL_DEFENCE_DOMAINS = ["civildefence.gov.in", "cdteam.in"]
        DISASTER_MGMT_DOMAINS = ["ndma.gov.in"]
        NGO_DOMAINS = ["redcross.org", "blueocean.org", "savethecoast.org"]  # example

        # Role-based domain verification
        if role == "Govt":
            if not any(email.endswith("@" + d) for d in GOV_DOMAINS):
                return False, "Invalid Government email domain"
        elif role == "CivilDefence":
            if not any(email.endswith("@" + d) for d in CIVIL_DEFENCE_DOMAINS):
                return False, "Invalid Civil Defence email domain"
        elif role == "NGO":
            if not any(email.endswith("@" + d) for d in NGO_DOMAINS):
                return False, "Invalid NGO email domain"
        elif role == "Disaster":
            if not any(email.endswith("@" + d) for d in DISASTER_MGMT_DOMAINS):
                return False, "Invalid Disaster Management email domain"
        elif role == "Fisherfolk":
            # Disallow Govt, CivilDefence, NGO, Disaster domains
            forbidden_domains = GOV_DOMAINS + CIVIL_DEFENCE_DOMAINS + NGO_DOMAINS + DISASTER_MGMT_DOMAINS
            
            # if any(email.endswith("@" + d) for d in forbidden_domains):
            #     return False, "Fisherfolk cannot use restricted domains"

            # Optionally enforce only common free domains
            allowed_common_domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"]
            if not any(email.endswith("@" + d) for d in allowed_common_domains):
                return False, "Fisherfolk must use a valid personal email (e.g. gmail.com)"
        else:
            return False, "Invalid role"

        # ---- Previous registration logic ----
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
        except IntegrityError as e:
            self.db_session.rollback()
            # Identify the type of integrity error
            msg = str(e.orig) if hasattr(e, 'orig') else str(e)
            if 'unique constraint' in msg or 'duplicate key' in msg:
                if 'email' in msg:
                    return False, 'Email already exists.'
                elif 'phone_number' in msg:
                    return False, 'Phone number already exists.'
                else:
                    return False, 'Duplicate entry.'
            elif 'foreign key' in msg:
                return False, 'Invalid foreign key reference.'
            else:
                return False, f'Integrity error: {msg}'



    def login_user(self, email, password):
        user = self.db_session.query(User).filter_by(email=email).first()
        if user and check_password_hash(user.password_hash, password):
            return True, user
        return False, 'Invalid credentials.'
