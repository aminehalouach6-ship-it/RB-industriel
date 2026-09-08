import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Order, OrderItem, Product
from app.schemas.schemas import OrderCreate, OrderResponse

router = APIRouter()

def generate_order_ref() -> str:
    unique_part = uuid.uuid4().hex[:6].upper()
    return f"TT-ORD-{unique_part}"

@router.post("", response_model=OrderResponse, status_code=201)
def create_order(payload: OrderCreate, db: Session = Depends(get_db)):
    if not payload.items:
        raise HTTPException(status_code=400, detail="La commande doit contenir au moins un article.")

    total = 0.0
    order_items = []

    for item in payload.items:
        # If product_id given, verify price
        unit_p = item.unit_price
        if item.product_id:
            prod = db.query(Product).filter(Product.id == item.product_id).first()
            if prod and prod.price_estimate > 0:
                unit_p = prod.price_estimate
        
        line_total = unit_p * item.quantity
        total += line_total
        
        order_items.append(
            OrderItem(
                product_id=item.product_id,
                product_name=item.product_name,
                quantity=item.quantity,
                unit_price=unit_p,
                total_price=line_total
            )
        )

    order = Order(
        order_reference=generate_order_ref(),
        customer_name=payload.customer_name,
        customer_phone=payload.customer_phone,
        customer_email=payload.customer_email,
        company_name=payload.company_name,
        delivery_city=payload.delivery_city,
        delivery_address=payload.delivery_address,
        delivery_mode=payload.delivery_mode,
        notes=payload.notes,
        total_estimated=total,
        status="EN_ATTENTE"
    )

    db.add(order)
    db.flush()

    for oi in order_items:
        oi.order_id = order.id
        db.add(oi)

    db.commit()
    db.refresh(order)
    return order

@router.get("", response_model=List[OrderResponse])
def get_orders(db: Session = Depends(get_db)):
    return db.query(Order).order_by(Order.created_at.desc()).all()

@router.get("/{reference}", response_model=OrderResponse)
def get_order_by_ref(reference: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.order_reference == reference).first()
    if not order:
        raise HTTPException(status_code=404, detail="Commande introuvable")
    return order

class StatusUpdatePayload(BaseModel):
    status: Optional[str] = None

@router.patch("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: int, 
    payload: Optional[StatusUpdatePayload] = None, 
    status: Optional[str] = None, 
    db: Session = Depends(get_db)
):
    target_status = None
    if payload and payload.status:
        target_status = payload.status
    elif status:
        target_status = status

    if not target_status:
        raise HTTPException(status_code=400, detail="Statut non spécifié")

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Commande introuvable")
    
    order.status = target_status
    db.commit()
    db.refresh(order)
    return order

@router.delete("/{order_id}", status_code=204)
def delete_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Commande introuvable")
    
    # Delete related items
    db.query(OrderItem).filter(OrderItem.order_id == order_id).delete()
    db.delete(order)
    db.commit()
    return None
