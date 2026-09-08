import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import QuoteRequest
from app.schemas.schemas import QuoteRequestCreate, QuoteRequestResponse

router = APIRouter()

def generate_quote_ref() -> str:
    unique_part = uuid.uuid4().hex[:6].upper()
    return f"TT-DEV-{unique_part}"

@router.post("", response_model=QuoteRequestResponse, status_code=201)
def create_quote_request(payload: QuoteRequestCreate, db: Session = Depends(get_db)):
    estimated_total = float(payload.estimated_total or 0.0)
    items_data = payload.items_json
    if isinstance(items_data, str):
        try:
            import json
            items_data = json.loads(items_data)
        except Exception:
            pass

    if estimated_total <= 0.0 and isinstance(items_data, list):
        for itm in items_data:
            if isinstance(itm, dict):
                price = float(itm.get("price", 0) or itm.get("unit_price_ht", 0) or 0)
                qty = int(itm.get("quantity", 1) or 1)
                estimated_total += price * qty

    quote = QuoteRequest(
        quote_reference=generate_quote_ref(),
        client_name=payload.client_name,
        phone=payload.phone,
        email=payload.email,
        company=payload.company,
        city=payload.city,
        needs_description=payload.needs_description,
        items_json=items_data if isinstance(items_data, (list, dict)) else [],
        estimated_total=estimated_total,
        status="NOUVEAU"
    )

    db.add(quote)
    db.commit()
    db.refresh(quote)
    return quote

@router.get("", response_model=List[QuoteRequestResponse])
def get_quotes(db: Session = Depends(get_db)):
    return db.query(QuoteRequest).order_by(QuoteRequest.created_at.desc()).all()

@router.get("/{reference}", response_model=QuoteRequestResponse)
def get_quote_by_ref(reference: str, db: Session = Depends(get_db)):
    quote = db.query(QuoteRequest).filter(QuoteRequest.quote_reference == reference).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Devis introuvable")
    return quote
