from typing import Any, Dict
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import random
from datetime import datetime, timedelta

from app.api import deps
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=Dict[str, Any])
def get_ai_insights(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Returns AI-powered business intelligence predictions.
    In a production system, this would query an ML model (e.g. Prophet, XGBoost).
    """
    # 1. Revenue Forecast (Past 3 months + Next 3 months prediction)
    months = ["Nis", "May", "Haz", "Tem (Tahmin)", "Ağu (Tahmin)", "Eyl (Tahmin)"]
    revenue_trend = [24000, 28000, 31000, 34500, 38000, 42000]
    
    forecast_data = []
    for i in range(len(months)):
        forecast_data.append({
            "month": months[i],
            "actual": revenue_trend[i] if i < 3 else None,
            "predicted": revenue_trend[i] if i >= 3 else None
        })

    # 2. Smart Alerts (Stock depletion, patient churn)
    alerts = [
        {"type": "stock", "message": "Kuduz Aşısı stok tüketim hızı %40 arttı. 4 gün içinde tükenebilir.", "severity": "high"},
        {"type": "churn", "message": "Son 6 aydır ziyarete gelmeyen 42 kayıtlı hasta tespit edildi. Otomatik 'Özledik' SMS'i planlanabilir.", "severity": "medium"},
        {"type": "opportunity", "message": "Havaların ısınmasıyla 'Kene/Pire' şikayetleri %60 arttı. Kampanya düzenlenmesi önerilir.", "severity": "low"}
    ]

    # 3. Peak Hours Prediction
    peak_hours = [
        {"hour": "09:00", "density": 30},
        {"hour": "11:00", "density": 80},
        {"hour": "14:00", "density": 95},
        {"hour": "16:00", "density": 60},
        {"hour": "18:00", "density": 40},
    ]

    return {
        "forecast": forecast_data,
        "alerts": alerts,
        "peak_hours": peak_hours,
        "growth_score": 87 # out of 100
    }
