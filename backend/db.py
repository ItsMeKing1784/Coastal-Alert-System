import yaml
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.user import Base
from models.coastal_zone import CoastalZone
from models.alert import Alert

with open('config.yml', 'r') as f:
    config = yaml.safe_load(f)

DATABASE_URI = config['database']['uri']
engine = create_engine(DATABASE_URI)
Session = sessionmaker(bind=engine)
Base.metadata.create_all(engine)
db_session = Session()
