from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
import os
import secrets

router = APIRouter()

# Default admin credentials
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "tenira2024")

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    success: bool
    token: str
    username: str
    message: str

@router.post("/login", response_model=LoginResponse)
def admin_login(payload: LoginRequest):
    user = payload.username.strip().lower()
    pwd = payload.password.strip()

    valid_credentials = {
        ADMIN_USERNAME.lower(): ADMIN_PASSWORD,
        "rachid": "tenira2024",
        "admin": "tenira2024"
    }

    if user not in valid_credentials or valid_credentials[user] != pwd:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nom d'utilisateur ou mot de passe incorrect."
        )

    # Generate a session token
    token = f"tt_adm_{secrets.token_hex(20)}"
    return {
        "success": True,
        "token": token,
        "username": payload.username,
        "message": "Connexion réussie à l'Espace Administrateur"
    }
