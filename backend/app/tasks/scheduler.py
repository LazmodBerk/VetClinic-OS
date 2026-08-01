import logging
from datetime import datetime, timedelta, timezone

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
from sqlalchemy.orm import Session, joinedload

from app.db.session import SessionLocal
from app.models.appointment import Appointment
from app.models.medical import Vaccination
from app.models.pet import Owner, Pet
from app.models.communication import Reminder, Notification
from app.services.notification_service import NotificationService

logger = logging.getLogger(__name__)
scheduler = BackgroundScheduler()


# ─────────────────────────────────────────────
# RANDEVU HATIRLATICI — Her gün saat 09:00
# ─────────────────────────────────────────────
def send_appointment_reminders():
    """
    Yarına ait randevular için sahiplere WhatsApp/SMS hatırlatması gönderir.
    """
    logger.info("[Scheduler] Randevu hatırlatıcıları çalışıyor...")
    db: Session = SessionLocal()
    try:
        now = datetime.now(timezone.utc)
        window_start = now + timedelta(hours=20)   # yaklaşık yarın sabah
        window_end = now + timedelta(hours=32)     # yaklaşık yarın akşam

        appointments = (
            db.query(Appointment)
            .options(joinedload(Appointment.owner), joinedload(Appointment.pet))
            .filter(
                Appointment.start_time >= window_start,
                Appointment.start_time <= window_end,
                Appointment.status == "SCHEDULED",
            )
            .all()
        )

        sent_count = 0
        for appt in appointments:
            owner: Owner = appt.owner
            pet: Pet = appt.pet

            if not owner or not owner.phone:
                continue

            # Daha önce gönderildi mi kontrol et
            already_sent = (
                db.query(Reminder)
                .filter(
                    Reminder.owner_id == owner.id,
                    Reminder.type == "Appointment",
                    Reminder.is_sent == True,
                    # aynı randevu için tekrar gönderme — scheduled_time ile eşleş
                    Reminder.scheduled_time == appt.start_time,
                )
                .first()
            )
            if already_sent:
                continue

            pet_name = pet.name if pet else "hayvanınız"
            time_str = appt.start_time.strftime("%d.%m.%Y %H:%M")
            message = (
                f"Merhaba {owner.first_name} Hanım/Bey,\n\n"
                f"Yarın {time_str} saatinde {pet_name} için randevunuz bulunmaktadır.\n"
                f"Randevu konusu: {appt.title}\n\n"
                f"Kliniğimizde görüşmek üzere! 🐾"
            )

            NotificationService.send_whatsapp(owner.phone, message)

            # Kayıt oluştur
            reminder = Reminder(
                type="Appointment",
                scheduled_time=appt.start_time,
                message=message,
                is_sent=True,
                owner_id=owner.id,
                clinic_id=appt.clinic_id,
            )
            db.add(reminder)

            notification = Notification(
                channel="WhatsApp",
                recipient=owner.phone,
                content=message,
                status="Sent",
                sent_at=now,
                clinic_id=appt.clinic_id,
            )
            db.add(notification)
            sent_count += 1

        db.commit()
        logger.info(f"[Scheduler] {sent_count} randevu hatırlatıcısı gönderildi.")

    except Exception as e:
        logger.error(f"[Scheduler] Randevu hatırlatıcı hatası: {e}")
        db.rollback()
    finally:
        db.close()


# ─────────────────────────────────────────────
# AŞI HATIRLATICI — Her gün saat 10:00
# ─────────────────────────────────────────────
def send_vaccination_reminders():
    """
    Önümüzdeki 7 gün içinde aşı tarihi dolacak hayvanlara hatırlatma gönderir.
    """
    logger.info("[Scheduler] Aşı hatırlatıcıları çalışıyor...")
    db: Session = SessionLocal()
    try:
        now = datetime.now(timezone.utc)
        window_end = now + timedelta(days=7)

        vaccinations = (
            db.query(Vaccination)
            .options(
                joinedload(Vaccination.pet).joinedload(Pet.owner if hasattr(Pet, "owner") else None)
            )
            .filter(
                Vaccination.next_due_date >= now,
                Vaccination.next_due_date <= window_end,
            )
            .all()
        )

        sent_count = 0
        for vacc in vaccinations:
            pet = db.query(Pet).filter(Pet.id == vacc.pet_id).first()
            if not pet:
                continue
            owner = db.query(Owner).filter(Owner.id == pet.owner_id).first()
            if not owner or not owner.phone:
                continue

            # Tekrar gönderme kontrolü
            already_sent = (
                db.query(Reminder)
                .filter(
                    Reminder.owner_id == owner.id,
                    Reminder.type == "Vaccination",
                    Reminder.is_sent == True,
                    Reminder.pet_id == pet.id,
                    Reminder.scheduled_time == vacc.next_due_date,
                )
                .first()
            )
            if already_sent:
                continue

            due_str = vacc.next_due_date.strftime("%d.%m.%Y")
            message = (
                f"Merhaba {owner.first_name} Hanım/Bey,\n\n"
                f"{pet.name} adlı {pet.species or 'hayvanınızın'} aşı zamanı yaklaşıyor!\n"
                f"Son tarih: {due_str}\n\n"
                f"Lütfen kliniğimizle iletişime geçiniz. 🐾"
            )

            NotificationService.send_whatsapp(owner.phone, message)

            reminder = Reminder(
                type="Vaccination",
                scheduled_time=vacc.next_due_date,
                message=message,
                is_sent=True,
                pet_id=pet.id,
                owner_id=owner.id,
                clinic_id=vacc.clinic_id,
            )
            db.add(reminder)

            notification = Notification(
                channel="WhatsApp",
                recipient=owner.phone,
                content=message,
                status="Sent",
                sent_at=now,
                clinic_id=vacc.clinic_id,
            )
            db.add(notification)
            sent_count += 1

        db.commit()
        logger.info(f"[Scheduler] {sent_count} aşı hatırlatıcısı gönderildi.")

    except Exception as e:
        logger.error(f"[Scheduler] Aşı hatırlatıcı hatası: {e}")
        db.rollback()
    finally:
        db.close()


# ─────────────────────────────────────────────
# ESKİ GENEL HATIRLATI GÖREVI (uyumluluk için)
# ─────────────────────────────────────────────
def process_reminders_job():
    logger.info("[Scheduler] process_reminders_job çalıştı.")
    send_appointment_reminders()
    send_vaccination_reminders()


# ─────────────────────────────────────────────
# SCHEDULER BAŞLAT / DURDUR
# ─────────────────────────────────────────────
def start_scheduler():
    # Her gün 09:00'da randevu hatırlatıcıları
    scheduler.add_job(
        send_appointment_reminders,
        trigger=CronTrigger(hour=9, minute=0),
        id="appointment_reminders",
        name="Randevu Hatırlatıcıları",
        replace_existing=True,
    )

    # Her gün 10:00'da aşı hatırlatıcıları
    scheduler.add_job(
        send_vaccination_reminders,
        trigger=CronTrigger(hour=10, minute=0),
        id="vaccination_reminders",
        name="Aşı Hatırlatıcıları",
        replace_existing=True,
    )

    # Dev/test için: her 5 dakikada bir genel kontrol (isteğe bağlı)
    # scheduler.add_job(
    #     process_reminders_job,
    #     trigger=IntervalTrigger(minutes=5),
    #     id="process_reminders_job",
    #     name="Genel Hatırlatıcı Kontrolü",
    #     replace_existing=True,
    # )

    scheduler.start()
    logger.info("[Scheduler] APScheduler başlatıldı. Randevu: 09:00, Aşı: 10:00")


def stop_scheduler():
    scheduler.shutdown()
    logger.info("[Scheduler] APScheduler durduruldu.")
