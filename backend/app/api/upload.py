import os
import shutil
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException

router = APIRouter()

# Directory for storing uploaded product photos
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

@router.post("")
async def upload_product_image(file: UploadFile = File(...)):
    """
    Endpoint pour uploader une image de produit depuis l'espace admin.
    Enregistre le fichier sur le serveur et renvoie son URL accessible.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Fichier non fourni ou nom de fichier invalide.")

    # Vérification de l'extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"Format '{ext}' non supporté. Formats acceptés : JPG, PNG, WEBP, SVG."
        )

    # Nom unique pour éviter les collisions
    unique_filename = f"prod_{uuid.uuid4().hex[:12]}{ext}"
    destination_path = os.path.join(UPLOAD_DIR, unique_filename)

    try:
        with open(destination_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'enregistrement de l'image : {str(e)}")

    # URL relative servie par Nginx et FastAPI
    image_url = f"/api/uploads/{unique_filename}"

    return {
        "success": True,
        "url": image_url,
        "filename": unique_filename,
        "size": os.path.getsize(destination_path)
    }
