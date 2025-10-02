from typing import List
from app.schema.match import *

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance between two points using Haversine formula (simplified)"""
    import math
    
    # Convert to radians
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    
    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    r = 6371  # Earth's radius in kilometers
    
    return round(c * r, 2)

def format_recipients_for_llm(donor: Donor, eligible_recipients: List[Recipient]) -> str:
    """Format recipients for LLM analysis"""
    output = ""
    for i, r in enumerate(eligible_recipients, 1):
        
        # Calculate distance
        distance = calculate_distance(
            donor.location.latitude, donor.location.longitude,
            r.location.latitude, r.location.longitude
        )
        
        # Check capacity (find matching accepted type)
        capacity_info = "Unknown"
        for accepted_type in r.accepted_types:
            if accepted_type.type == donor.donation.type:
                capacity_info = f"Min {accepted_type.min_quantity} {accepted_type.unit}"
                break
        
        output += (
            f"{i}. {r.name} (ID: {r.id}):\n"
            f"   - Address: {r.address}\n"
            f"   - Distance: {distance} km\n"
            f"   - Description: {r.description}\n"
            f"   - Capacity Requirements: {capacity_info}\n"
            f"   - Special Capabilities: {', '.join(r.special_capabilities)}\n"
            f"   - Storage Capabilities: {', '.join(r.storage_capabilities)}\n"
        )
    return output

    """Format recipients for LLM analysis"""
    output = ""
    for i, r in enumerate(eligible_recipients, 1):
        
        # Calculate distance
        distance = calculate_distance(
            donor.location.latitude, donor.location.longitude,
            r.location.latitude, r.location.longitude
        )
        
        # Check capacity (find matching accepted type)
        capacity_info = "Unknown"
        for accepted_type in r.accepted_types:
            if accepted_type.type == donor.donation.type:
                capacity_info = f"Min {accepted_type.min_quantity} {accepted_type.unit}"
                break
        
        output += (
            f"{i}. {r.name}:\n"
            f"   - Address: {r.address}\n"
            f"   - Distance: {distance} km\n"
            f"   - Description: {r.description}\n"
            f"   - Capacity Requirements: {capacity_info}\n"
            f"   - Special Capabilities: {', '.join(r.special_capabilities)}\n"
            f"   - Storage Capabilities: {', '.join(r.storage_capabilities)}\n"
        )
    return output