from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import ContactMessage
from app.schemas.schemas import ContactCreate, ContactResponse

router = APIRouter()

@router.post("", response_model=ContactResponse, status_code=201)
def submit_contact(payload: ContactCreate, db: Session = Depends(get_db)):
    msg = ContactMessage(
        name=payload.name,
        phone=payload.phone,
        email=payload.email,
        subject=payload.subject,
        message=payload.message
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg

@router.get("", response_model=List[ContactResponse])
def get_contact_messages(db: Session = Depends(get_db)):
    return db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()
