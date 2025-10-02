from typing import List, Dict, Optional
from pydantic import BaseModel, Field

class Location(BaseModel):
    latitude: float
    longitude: float

class Contact(BaseModel):
    name: str
    email: str
    phone: str

class AcceptedType(BaseModel):
    type: str
    unit: str
    min_quantity: int

class Donation(BaseModel):
    name: str
    type: str
    quantity: int
    unit: str

class Donor(BaseModel):
    id: str
    name: str
    address: str
    location: Location
    donation: Donation
    special_capabilities: List[str]
    donation_pickup_time: str
    packaging_type: str
    storage_capability: str

class Recipient(BaseModel):
    id: str
    name: str
    address: str
    description: str
    location: Location
    status: str
    timezone: str
    contact: Contact
    accepted_types: List[AcceptedType]
    special_capabilities: List[str]
    storage_capabilities: List[str]
    open_hours: Dict[str, List[str]]

class MatchRequest(BaseModel):
    donor: Donor
    eligible_recipients: List[Recipient]

class BestMatchResult(BaseModel):
    recipient_id: str = Field(description="ID of the chosen recipient")
    recipient_name: str = Field(description="Name of the chosen recipient")
    justification: str = Field(description="Why the recipient was selected")
