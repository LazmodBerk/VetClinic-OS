import os
import json
import logging
from sqlalchemy.orm import Session
from app.models.push import PushSubscription
from app.services.sms_service import SmsService
from app.services.whatsapp_service import WhatsAppService

try:
    from pywebpush import webpush, WebPushException
except ImportError:
    webpush = None

logger = logging.getLogger(__name__)

# --- VAPID (Web Push) ---
VAPID_PRIVATE_KEY = os.getenv("VAPID_PRIVATE_KEY", "")
VAPID_CLAIMS = {"sub": f"mailto:{os.getenv('VAPID_CONTACT_EMAIL', 'admin@vcms.app')}"}

# --- SMS (Netgsm) ---
_sms_service: SmsService | None = None

def get_sms_service() -> SmsService | None:
    global _sms_service
    username = os.getenv("NETGSM_USERNAME", "")
    password = os.getenv("NETGSM_PASSWORD", "")
    header = os.getenv("NETGSM_HEADER", "KLINIK")
    if username and password:
        if _sms_service is None:
            _sms_service = SmsService(username, password, header)
        return _sms_service
    return None

# --- WhatsApp (Meta Cloud API) ---
_whatsapp_service: WhatsAppService | None = None

def get_whatsapp_service() -> WhatsAppService | None:
    global _whatsapp_service
    token = os.getenv("WHATSAPP_ACCESS_TOKEN", "")
    phone_number_id = os.getenv("WHATSAPP_PHONE_NUMBER_ID", "")
    if token and phone_number_id:
        if _whatsapp_service is None:
            _whatsapp_service = WhatsAppService(token, phone_number_id)
        return _whatsapp_service
    return None


class NotificationService:

    @staticmethod
    def send_sms(phone: str, message: str) -> bool:
        """SMS gönderir (Netgsm). Konfigüre edilmemişse log'a yazar."""
        sms = get_sms_service()
        if sms:
            return sms.send(phone, message)
        logger.info(f"[SMS - MOCK] {phone}: {message}")
        return False

    @staticmethod
    def send_whatsapp(phone: str, message: str) -> bool:
        """WhatsApp mesajı gönderir (Meta Cloud API). Konfigüre edilmemişse SMS'e düşer."""
        wa = get_whatsapp_service()
        if wa:
            return wa.send_text(phone, message)
        # WhatsApp yoksa SMS dene
        logger.info(f"[WhatsApp - MOCK] {phone}: {message}")
        return NotificationService.send_sms(phone, message)

    @staticmethod
    def send_web_push(db: Session, user_id: int, title: str, body: str) -> bool:
        """PWA/Tarayıcı push bildirimi gönderir."""
        subscriptions = db.query(PushSubscription).filter(
            PushSubscription.user_id == user_id
        ).all()
        if not subscriptions:
            return False

        success_count = 0
        for sub in subscriptions:
            try:
                if webpush and VAPID_PRIVATE_KEY:
                    webpush(
                        subscription_info={
                            "endpoint": sub.endpoint,
                            "keys": {"p256dh": sub.p256dh, "auth": sub.auth},
                        },
                        data=json.dumps({"title": title, "body": body}),
                        vapid_private_key=VAPID_PRIVATE_KEY,
                        vapid_claims=VAPID_CLAIMS,
                    )
                else:
                    logger.info(f"[WebPush - MOCK] {title}: {body}")
                success_count += 1
            except Exception as e:
                logger.error(f"[WebPush] Hata: {e}")

        return success_count > 0

    @staticmethod
    def notify_owner(
        db: Session,
        user_id: int,
        phone: str,
        title: str,
        message: str,
        channel: str = "auto",
    ) -> None:
        """
        Çok kanallı bildirim.
        channel: "auto" | "whatsapp" | "sms" | "push"
        
        "auto" öncelik sırası:
          1. Web Push (PWA/tarayıcı açıksa anında gelir)
          2. WhatsApp
          3. SMS
        """
        if channel == "push":
            NotificationService.send_web_push(db, user_id, title, message)
            return

        if channel == "whatsapp":
            NotificationService.send_whatsapp(phone, f"*{title}*\n{message}")
            return

        if channel == "sms":
            NotificationService.send_sms(phone, f"{title}\n{message}")
            return

        # "auto" - kademeli deneme
        push_sent = NotificationService.send_web_push(db, user_id, title, message)
        if not push_sent:
            wa_sent = NotificationService.send_whatsapp(phone, f"*{title}*\n{message}")
            if not wa_sent:
                NotificationService.send_sms(phone, f"{title}\n{message}")


# Eski kod uyumluluğu için alias
notification_service = NotificationService()
