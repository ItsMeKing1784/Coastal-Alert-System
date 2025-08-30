from . import Base
import uuid
import datetime
from sqlalchemy import Column, String, Boolean, Integer, TIMESTAMP, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from geoalchemy2 import Geography
from sqlalchemy.orm import relationship

class Alert(Base):
    __tablename__ = "alerts"
    __table_args__ = {"schema": "public"}

    alert_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    zone_id = Column(UUID(as_uuid=True), ForeignKey("public.coastal_zones.zone_id"), nullable=False)
    title = Column(String(140), nullable=False)
    message = Column(Text, nullable=False)
    level = Column(String(20), nullable=False)  # Minor/Moderate/High/Severe
    created_at = Column(TIMESTAMP, default=datetime.datetime.utcnow)

    zone = relationship("CoastalZone", back_populates="alerts")