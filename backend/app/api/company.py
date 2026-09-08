import os
import uuid
import datetime
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import CompanySettings
from app.schemas.schemas import CompanySettingsResponse, CompanySettingsUpdate

router = APIRouter()

def get_or_create_company_settings(db: Session) -> CompanySettings:
    settings = db.query(CompanySettings).first()
    if not settings:
        settings = CompanySettings(
            company_name="RB INDUSTRIEL",
            legal_name="RB INDUSTRIEL S.A.R.L",
            manager_name="Rachid BOUZAYD",
            tagline="Gaz Industriels & Matériel de Soudage • Tit Mellil",
            logo_url="/logo_rb_industriale.png",
            flyer_url="/carte_officielle_tenira.png",
            flyer_4k_url="/carte_officielle_tenira_4k.png",
            phone_main="07 00 95 00 64",
            phone_fixed="05 22 35 48 68",
            whatsapp_phone="212700950064",
            email="",
            address="Hay Amal 1, N° 92, Appt N° 8, Tit Mellil, Casablanca - Maroc",
            city="Tit Mellil, Casablanca"
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@router.get("", response_model=CompanySettingsResponse)
def get_company(db: Session = Depends(get_db)):
    """Récupère les coordonnées et paramètres officiels de RB INDUSTRIEL depuis la base de données"""
    return get_or_create_company_settings(db)

@router.put("", response_model=CompanySettingsResponse)
def update_company(payload: CompanySettingsUpdate, db: Session = Depends(get_db)):
    """Met à jour les paramètres de l'entreprise dans la base de données PostgreSQL"""
    settings = get_or_create_company_settings(db)
    
    update_data = payload.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        if val is not None:
            setattr(settings, field, val)
            
    settings.updated_at = datetime.datetime.utcnow()
    db.commit()
    db.refresh(settings)
    return settings

@router.post("/logo", response_model=CompanySettingsResponse)
async def upload_company_logo(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Téléverse un nouveau logo pour l'entreprise et l'associe dans la base de données"""
    settings = get_or_create_company_settings(db)

    # Base dir for uploads
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    upload_dir = os.path.join(base_dir, "uploads")
    os.makedirs(upload_dir, exist_ok=True)

    ext = os.path.splitext(file.filename)[1].lower() or ".png"
    filename = f"logo_rb_{uuid.uuid4().hex[:8]}{ext}"
    dest_path = os.path.join(upload_dir, filename)

    contents = await file.read()
    with open(dest_path, "wb") as f:
        f.write(contents)

    logo_url = f"/api/uploads/{filename}"
    settings.logo_url = logo_url
    settings.updated_at = datetime.datetime.utcnow()
    db.commit()
    db.refresh(settings)
    return settings
