import logging
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from app.db.session import SessionLocal
from app.services.notification_service import NotificationService

logger = logging.getLogger(__name__)

scheduler = BackgroundScheduler()

def process_reminders_job():
    logger.info("Running process_reminders_job (Includes WhatsApp Engine)...")
    db = SessionLocal()
    try:
        NotificationService.process_due_reminders(db)
    except Exception as e:
        logger.error(f"Error in process_reminders_job: {e}")
    finally:
        db.close()

def start_scheduler():
    # Run every minute for testing/demo, in prod maybe hourly
    scheduler.add_job(
        process_reminders_job,
        trigger=IntervalTrigger(minutes=1),
        id="process_reminders_job",
        name="Process due reminders",
        replace_existing=True,
    )
    scheduler.start()
    logger.info("APScheduler started.")

def stop_scheduler():
    scheduler.shutdown()
    logger.info("APScheduler stopped.")
