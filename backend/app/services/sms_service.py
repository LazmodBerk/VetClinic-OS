import logging
import requests
from typing import Optional

logger = logging.getLogger(__name__)


class SmsService:
    """
    Netgsm SMS API entegrasyonu.
    https://www.netgsm.com.tr/dokuman/
    """

    def __init__(self, username: str, password: str, header: str):
        self.username = username
        self.password = password
        self.header = header  # Gönderici adı (Netgsm'de onaylı başlık)
        self.api_url = "https://api.netgsm.com.tr/sms/send/get/"

    def send(self, phone: str, message: str) -> bool:
        """
        Tek bir numaraya SMS gönderir.
        phone: Başında 0 olmadan, örn: "5551234567"
        """
        # Telefon numarasını temizle (başındaki 0, +90 vs.)
        phone = phone.strip().lstrip("+").lstrip("90").lstrip("0")
        if not phone.startswith("5") or len(phone) != 10:
            logger.warning(f"[SMS] Geçersiz telefon numarası: {phone}")
            return False

        params = {
            "usercode": self.username,
            "password": self.password,
            "gsmno": phone,
            "message": message,
            "msgheader": self.header,
            "dil": "TR",
        }

        try:
            response = requests.get(self.api_url, params=params, timeout=10)
            response.raise_for_status()
            result = response.text.strip()

            # Netgsm başarı kodu "00" ile başlar
            if result.startswith("00"):
                logger.info(f"[SMS] Başarıyla gönderildi → {phone}")
                return True
            else:
                logger.error(f"[SMS] Netgsm hata kodu: {result} → {phone}")
                return False

        except requests.RequestException as e:
            logger.error(f"[SMS] İstek hatası: {e}")
            return False
