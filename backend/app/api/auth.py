import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import AdminUser
from app.core.security import hash_password, verify_password, generate_session_token
from app.schemas.schemas import (
    LoginRequest, 
    LoginResponse, 
    ChangePasswordRequest, 
    ChangePasswordResponse
)

router = APIRouter()

def get_or_create_default_admin(db: Session) -> AdminUser:
    """S'assure qu'un compte administrateur existe dans la base de données PostgreSQL"""
    admin = db.query(AdminUser).filter(AdminUser.username == "admin").first()
    if not admin:
        # Création automatique du compte admin par défaut sécurisé avec hash PBKDF2
        admin = AdminUser(
            username="admin",
            password_hash=hash_password("tenira2024"),
            created_at=datetime.datetime.utcnow(),
            updated_at=datetime.datetime.utcnow()
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)
    return admin

@router.post("/login", response_model=LoginResponse)
def admin_login(payload: LoginRequest, db: Session = Depends(get_db)):
    """Authentifie l'administrateur directement contre la base de données PostgreSQL"""
    get_or_create_default_admin(db)
    
    username = payload.username.strip().lower()
    password = payload.password.strip()

    admin = db.query(AdminUser).filter(AdminUser.username == username).first()

    # Si non trouvé, tentative sur compte gérant rachid
    if not admin and username in ["rachid", "bouzayd"]:
        admin = db.query(AdminUser).filter(AdminUser.username == "admin").first()

    if not admin or not verify_password(password, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nom d'utilisateur ou mot de passe incorrect."
        )

    token = generate_session_token()
    return {
        "success": True,
        "token": token,
        "username": admin.username,
        "message": "Connexion réussie à l'Espace Administrateur"
    }

@router.post("/change-password", response_model=ChangePasswordResponse)
def change_admin_password(payload: ChangePasswordRequest, db: Session = Depends(get_db)):
    """Modifie le mot de passe administrateur et le sauvegarde dans la base de données PostgreSQL"""
    get_or_create_default_admin(db)
    
    username = (payload.username or "admin").strip().lower()
    admin = db.query(AdminUser).filter(AdminUser.username == username).first()
    
    if not admin:
        admin = db.query(AdminUser).first()

    if not admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Compte administrateur introuvable dans la base de données."
        )

    # 1. Vérification stricte du mot de passe actuel dans PostgreSQL
    if not verify_password(payload.current_password.strip(), admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Le mot de passe actuel est incorrect."
        )

    # 2. Validation du nouveau mot de passe
    new_pwd = payload.new_password.strip()
    if len(new_pwd) < 4:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Le nouveau mot de passe doit contenir au moins 4 caractères."
        )

    # 3. Hashage sécurisé PBKDF2 et sauvegarde en base de données PostgreSQL
    admin.password_hash = hash_password(new_pwd)
    admin.updated_at = datetime.datetime.utcnow()
    db.commit()
    db.refresh(admin)

    return {
        "success": True,
        "message": "Mot de passe administrateur modifié avec succès dans la base de données PostgreSQL."
    }

@router.get("/status")
def auth_status(db: Session = Depends(get_db)):
    """Vérifie l'état de la connexion d'authentification à PostgreSQL"""
    admin = get_or_create_default_admin(db)
    return {
        "status": "connected",
        "auth_engine": "PostgreSQL Database",
        "admin_username": admin.username,
        "last_updated": admin.updated_at
    }
