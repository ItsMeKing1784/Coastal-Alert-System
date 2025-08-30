from db import SessionLocal
from models.coastal_zone import CoastalZone

class CoastalZoneService:
    def __init__(self, db):  
        self.db = db

    def get_all_zones(self):
        return self.db.query(CoastalZone).all()

    def get_zone_by_id(self, zone_id):
        return self.db.query(CoastalZone).get(zone_id)

    def create_zone(self, data):
        print("DEBUG: entered create_zone with data =", data)

        try:
            if not data or "zone_name" not in data:
                return False, "Missing required field: zone_name"

            boundary_wkt = None
            if "boundary" in data and data["boundary"]:
                coords = data["boundary"]["coordinates"][0]
                coords_str = ", ".join(f"{x} {y}" for x, y in coords)
                boundary_wkt = f"POLYGON(({coords_str}))"

            new_zone = CoastalZone(
                zone_name=data["zone_name"],
                description=data.get("description"),
                risk_level=data.get("risk_level"),
                boundary=boundary_wkt
            )

            self.db.add(new_zone)
            self.db.commit()
            return True, new_zone

        except Exception as e:
            print("DEBUG: error in create_zone =", e)
            self.db.rollback()
            return False, str(e)

        # 🚨 fallback return so it NEVER returns None
        return False, "Unknown error"
