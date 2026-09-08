from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Product, Category, Order, QuoteRequest
from app.schemas.schemas import StatsResponse

router = APIRouter()

@router.get("", response_model=StatsResponse)
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_products = db.query(Product).count()
    total_categories = db.query(Category).count()
    total_orders = db.query(Order).count()
    total_quotes = db.query(QuoteRequest).count()
    active_deliveries = db.query(Order).filter(Order.status.in_(["EN_ATTENTE", "EN_LIVRAISON"])).count()

    return StatsResponse(
        total_products=total_products,
        total_categories=total_categories,
        total_orders=total_orders,
        total_quotes=total_quotes,
        active_deliveries=active_deliveries
    )
