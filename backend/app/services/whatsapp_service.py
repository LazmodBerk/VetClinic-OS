import logging
import requests
from typing import Dict, Any

logger = logging.getLogger(__name__)

class WhatsAppService:
    """
    Service for integrating with WhatsApp Business API (Meta Cloud API).
    Currently implemented as a mock that logs the payload.
    """
    def __init__(self, token: str, phone_number_id: str):
        self.token = token
        self.phone_number_id = phone_number_id
        self.api_url = f"https://graph.facebook.com/v17.0/{self.phone_number_id}/messages"

    def send_template_message(self, to_phone: str, template_name: str, language_code: str = "tr", components: list = None) -> bool:
        """
        Send a template message via WhatsApp.
        """
        payload = {
            "messaging_product": "whatsapp",
            "to": to_phone,
            "type": "template",
            "template": {
                "name": template_name,
                "language": {
                    "code": language_code
                }
            }
        }
        
        if components:
            payload["template"]["components"] = components

        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }

        # MOCK IMPLEMENTATION
        logger.info(f"MOCK WHATSAPP: Sending template '{template_name}' to {to_phone}")
        logger.debug(f"Payload: {payload}")
        
        # Real implementation would be:
        # try:
        #     response = requests.post(self.api_url, headers=headers, json=payload)
        #     response.raise_for_status()
        #     return True
        # except requests.RequestException as e:
        #     logger.error(f"WhatsApp API Error: {e}")
        #     return False

        return True
