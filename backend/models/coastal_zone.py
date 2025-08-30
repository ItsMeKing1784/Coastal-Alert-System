import uuid
import datetime
from sqlalchemy import Column, String, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID
from geoalchemy2 import Geometry
from . import Base

class CoastalZone(Base):
    __tablename__ = 'coastal_zones'
    #__table_args__ = {'schema': 'public'}

    zone_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    zone_name = Column(String(100), nullable=False)
    description = Column(Text)
    risk_level = Column(String(20))
    boundary = Column(Geometry(geometry_type='POLYGON', srid=4326))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
