import logging
import requests
from typing import Optional

logger = logging.getLogger(__name__)


class WhatsAppService:
    """
    Meta WhatsApp Business Cloud API entegrasyonu.
    Ücretsiz: Ayda 1000 kullanıcıya başlatılan konuşma.
    Kurulum: https://developers.facebook.com/docs/whatsapp/cloud-api/get-started
    """

    def __init__(self, access_token: str, phone_number_id: str):
        self.access_token = access_token
        self.phone_number_id = phone_number_id
        self.api_url = f"https://graph.facebook.com/v20.0/{phone_number_id}/messages"

    def send_text(self, to_phone: str, message: str) -> bool:
        """
        Serbest metin mesajı gönderir.
        NOT: Bu yalnızca müşteri son 24 saat içinde size yazdıysa çalışır.
        Proaktif mesaj için send_template kullanın.
        to_phone: Uluslararası format, örn: "905551234567"
        """
        to_phone = self._normalize_phone(to_phone)
        if not to_phone:
            return False

        payload = {
            "messaging_product": "whatsapp",
            "to": to_phone,
            "type": "text",
            "text": {"body": message},
        }

        return self._send(payload)

    def send_template(
        self,
        to_phone: str,
        template_name: str,
        language_code: str = "tr",
        components: Optional[list] = None,
    ) -> bool:
        """
        Onaylı şablon mesajı gönderir (proaktif, randevu hatırlatma gibi).
        template_name: Meta Business Manager'da oluşturduğunuz şablon adı.
        """
        to_phone = self._normalize_phone(to_phone)
        if not to_phone:
            return False

        payload = {
            "messaging_product": "whatsapp",
            "to": to_phone,
            "type": "template",
            "template": {
                "name": template_name,
                "language": {"code": language_code},
            },
        }

        if components:
            payload["template"]["components"] = components

        return self._send(payload)

    def _send(self, payload: dict) -> bool:
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json",
        }
        try:
            response = requests.post(
                self.api_url, headers=headers, json=payload, timeout=10
            )
            response.raise_for_status()
            logger.info(f"[WhatsApp] Gönderildi → {payload.get('to')}")
            return True
        except requests.RequestException as e:
            logger.error(f"[WhatsApp] API hatası: {e}")
            if hasattr(e, "response") and e.response is not None:
                logger.error(f"[WhatsApp] Yanıt: {e.response.text}")
            return False

    @staticmethod
    def _normalize_phone(phone: str) -> Optional[str]:
        """Telefon numarasını WhatsApp API formatına çevirir (905XXXXXXXXX)."""
        phone = phone.strip().replace(" ", "").replace("-", "")
        phone = phone.lstrip("+")
        if phone.startswith("0"):
            phone = "90" + phone[1:]
        elif phone.startswith("5"):
            phone = "90" + phone
        if len(phone) != 12 or not phone.startswith("90"):
            logger.warning(f"[WhatsApp] Geçersiz telefon: {phone}")
            return None
        return phone
