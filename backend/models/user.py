import uuid
import datetime
from sqlalchemy import Column, String, Boolean, Integer, TIMESTAMP, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from geoalchemy2 import Geography
from . import Base

class User(Base):
    __tablename__ = 'users'
    #__table_args__ = {'schema': 'public'}

    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)  # ✅ matches DB
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone_number = Column(String(20), unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    two_factor_enabled = Column(Boolean, default=False)

    role = Column(String(20), nullable=False)  # CHECK constraint handled in DB
    organization = Column(String(100))

    home_location = Column(Geography(geometry_type='POINT', srid=4326))  # ✅ matches GEOGRAPHY(Point, 4326)
    preferred_alert_radius = Column(Integer, default=10)
    zone_id = Column(UUID(as_uuid=True), ForeignKey("public.coastal_zones.zone_id"))

    alert_methods = Column(ARRAY(Text))  # ✅ TEXT[] for multiple methods {SMS, Email, etc.}
    preferred_language = Column(String(10), default='en')
    alert_level_threshold = Column(String(20), default='Severe')

    last_login = Column(TIMESTAMP, nullable=True)
    registration_date = Column(TIMESTAMP, default=datetime.datetime.utcnow)
