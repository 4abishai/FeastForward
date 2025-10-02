import os
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
from langchain_mistralai import ChatMistralAI
from app.schema.match import MatchRequest, BestMatchResult
from app.utils import format_recipients_for_llm
import json
from pydantic import ValidationError
import re

load_dotenv()

# Updated prompt template
prompt = ChatPromptTemplate.from_template("""
You are an assistant helping a donor select the best recipient for a food donation.

Donation Details:
- Donor: {donor_name} ({donor_address})
- Donation: {donation_name}
- Type: {donation_type}
- Quantity: {donation_quantity} {donation_unit}
- Donor Special Capabilities: {donor_special_capabilities}
- Pickup Time: {donation_pickup_time}
- Packaging: {packaging_type}
- Storage Capability: {storage_capability}

Recipient Candidates:
{eligible_recipients}

Please analyze the recipient candidates and determine which is the best match for this donation. 

Consider these factors:
1. Match with donation type and quantity requirements
2. Special capabilities alignment (e.g., gluten_free, vegetarian)
3. Storage capability compatibility
4. Distance from donor
5. Recipient capacity

Respond strictly in JSON format with:
{{
    "recipient_id": "selected_recipient_id",
    "recipient_name": "selected_recipient_name", 
    "justification": "detailed explanation of why this recipient was chosen (use 'you' instead of 'the donor') explaining why this recipient was chosen"
}}
""")

llm = ChatMistralAI(
    mistral_api_key=os.getenv("MISTRAL_API_KEY"),
    model="mistral-small",
    temperature=0
)

def get_best_match(data):
    """Process the match request and return the best recipient"""
    try:
        match_request = MatchRequest(**data)
        donor = match_request.donor
        eligible_recipients = match_request.eligible_recipients
        # print("Eligible recipients: ", format_recipients_for_llm(donor, eligible_recipients))
        
        # Prepare payload for LLM
        payload = {
            "donor_name": donor.name,
            "donor_address": donor.address,
            "donation_name": donor.donation.name,
            "donation_type": donor.donation.type,
            "donation_quantity": donor.donation.quantity,
            "donation_unit": donor.donation.unit,
            "donor_special_capabilities": ", ".join(donor.special_capabilities),
            "donation_pickup_time": donor.donation_pickup_time,
            "packaging_type": donor.packaging_type,
            "storage_capability": donor.storage_capability,
            "eligible_recipients": format_recipients_for_llm(donor, eligible_recipients),
        }
        
        # Get LLM response
        messages = prompt.format_messages(**payload)
        response = llm.invoke(messages)
        print(response.content)
        
        # Clean invalid control characters
        cleaned_content = re.sub(r'[\x00-\x1f]+', ' ', response.content)
        result = json.loads(cleaned_content)
        # Parse JSON response
        # result = json.loads(response.content)
        
        # Validate the result structure
        BestMatchResult(**result)  # This will raise an error if invalid
        
        return result
        
    except json.JSONDecodeError as jde:
        return {"error": f"Invalid JSON returned from model: {str(jde)}"}
    except Exception as e:
        return {"error": str(e)}