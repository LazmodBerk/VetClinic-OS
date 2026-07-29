import os
import json
import requests
from sqlalchemy.orm import Session
from app.models.push import PushSubscription
try:
    from pywebpush import webpush, WebPushException
except ImportError:
    webpush = None

# In a real scenario, you'd generate these via `pywebpush` CLI and store in ENV.
VAPID_PRIVATE_KEY = os.getenv("VAPID_PRIVATE_KEY", "mock_private_key")
VAPID_CLAIMS = {"sub": "mailto:admin@vcms.app"}

class NotificationService:
    @staticmethod
    def send_whatsapp(phone: str, message: str) -> bool:
        """
        Sends WhatsApp message. (Mock implementation)
        """
        print(f"[WhatsApp - MOCK] Sending to {phone}: {message}")
        return True

    @staticmethod
    def send_web_push(db: Session, user_id: int, title: str, body: str) -> bool:
        """
        Sends a Web Push notification to all active devices of a user.
        If webpush fails (e.g. iOS missing permissions), returns False so fallback can be used.
        """
        subscriptions = db.query(PushSubscription).filter(PushSubscription.user_id == user_id).all()
        if not subscriptions:
            return False
            
        success_count = 0
        for sub in subscriptions:
            try:
                if webpush:
                    webpush(
                        subscription_info={
                            "endpoint": sub.endpoint,
                            "keys": {
                                "p256dh": sub.p256dh,
                                "auth": sub.auth
                            }
                        },
                        data=json.dumps({"title": title, "body": body}),
                        vapid_private_key=VAPID_PRIVATE_KEY,
                        vapid_claims=VAPID_CLAIMS
                    )
                else:
                    print(f"[WebPush - MOCK] Simulated push to {sub.endpoint}: {title} - {body}")
                success_count += 1
            except Exception as e:
                print(f"[WebPush - ERROR] Failed to send push to {sub.endpoint}: {e}")
                # Optionally delete expired subscriptions here
                
        return success_count > 0

    @staticmethod
    def notify_user(db: Session, user_id: int, phone: str, title: str, message: str) -> None:
        """
        Multi-channel notification logic:
        1. Try Web Push first.
        2. If Web Push fails (or no subscription), fallback to WhatsApp.
        """
        push_sent = NotificationService.send_web_push(db, user_id, title, message)
        
        if not push_sent:
            # Fallback to WhatsApp / SMS
            NotificationService.send_whatsapp(phone, f"*{title}*\n{message}")

notification_service = NotificationService()
