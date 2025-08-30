from flask import Blueprint, request, jsonify
from Service.coastal_zone_service import CoastalZoneService
from db import db_session
from geoalchemy2.shape import to_shape
from shapely.geometry import mapping

zone_routes = Blueprint("zone_routes", __name__)
zone_service = CoastalZoneService(db_session)

# -------------------- GET ALL ZONES --------------------
@zone_routes.route("/zones", methods=["GET"])
def get_zones():
    zones = zone_service.get_all_zones()
    return jsonify([{
        "zone_id": str(z.zone_id),
        "zone_name": z.zone_name,
        "description": z.description,
        "risk_level": z.risk_level,
        "boundary": mapping(to_shape(z.boundary)) if z.boundary else None,
        "created_at": z.created_at.isoformat() if z.created_at else None
    } for z in zones])


# -------------------- CREATE NEW ZONE --------------------
@zone_routes.route("/zones", methods=["POST"])
def create_zone_route():
    data = request.get_json()
    print("DEBUG: route received data =", data)

    success, result = zone_service.create_zone(data)
    print("DEBUG: service returned =", success, result)

    if success:
        return jsonify({
            "success": True,
            "zone": {
                "id": str(result.zone_id),
                "name": result.zone_name,
                "description": result.description,
                "risk_level": result.risk_level,
                "boundary": mapping(to_shape(result.boundary)) if result.boundary else None,
                "created_at": result.created_at.isoformat() if result.created_at else None
            }
        }), 201
    else:
        return jsonify({"success": False, "error": result}), 400


# -------------------- GET SINGLE ZONE BY ID --------------------
@zone_routes.route("/zones/<uuid:zone_id>", methods=["GET"])
def get_zone(zone_id):
    zone = zone_service.get_zone_by_id(zone_id)
    if not zone:
        return jsonify({"success": False, "error": "Zone not found"}), 404

    return jsonify({
        "zone_id": str(zone.zone_id),
        "zone_name": zone.zone_name,
        "description": zone.description,
        "risk_level": zone.risk_level,
        "boundary": mapping(to_shape(zone.boundary)) if zone.boundary else None,
        "created_at": zone.created_at.isoformat() if zone.created_at else None
    })


# -------------------- DELETE ZONE --------------------
@zone_routes.route("/zones/<uuid:zone_id>", methods=["DELETE"])
def delete_zone(zone_id):
    success, msg = zone_service.delete_zone(zone_id)
    if success:
        return jsonify({"success": True, "message": msg}), 200
    else:
        return jsonify({"success": False, "error": msg}), 400
