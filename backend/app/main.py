import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.core.database import Base, engine, SessionLocal
from app.seed_data import seed_database
from app.api import products, orders, quotes, contact, stats, auth, upload, company

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables
    Base.metadata.create_all(bind=engine)
    # Seed DB with Tenira Travaux catalog
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="API officielle RB INDUSTRIEL - Vente, Distribution et Livraison de Gaz Industriels & Matériel de Soudage à Tit Mellil, Casablanca et partout au Maroc.",
    lifespan=lifespan,
    docs_url=None,
    redoc_url=None,
    openapi_url=None
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Uploads directory static serving
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
try:
    os.makedirs(UPLOAD_DIR, exist_ok=True)
except OSError:
    UPLOAD_DIR = os.path.join("/tmp", "uploads")
    os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/api/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Register API Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentification"])
app.include_router(products.router, prefix="/api/products", tags=["Produits & Catégories"])
app.include_router(orders.router, prefix="/api/orders", tags=["Commandes"])
app.include_router(quotes.router, prefix="/api/quotes", tags=["Devis"])
app.include_router(contact.router, prefix="/api/contact", tags=["Contact & Assistance"])
app.include_router(stats.router, prefix="/api/stats", tags=["Tableau de bord & Statistiques"])
app.include_router(upload.router, prefix="/api/upload", tags=["Upload Images"])
app.include_router(company.router, prefix="/api/company", tags=["Paramètres Entreprise"])

@app.get("/api/health", tags=["Système"])
def health_check():
    return {
        "status": "healthy",
        "service": "RB INDUSTRIEL Backend API",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT
    }

from fastapi.responses import FileResponse

# Find Vite dist folder dynamically
DIST_DIR = None
search_paths = [
    os.path.abspath("dist"),
    os.path.abspath("frontend/dist"),
    os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "dist"),
    os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "dist"),
]
for p in search_paths:
    if os.path.isdir(p) and os.path.isfile(os.path.join(p, "index.html")):
        DIST_DIR = p
        break

if DIST_DIR:
    assets_dir = os.path.join(DIST_DIR, "assets")
    if os.path.isdir(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

@app.get("/api/info", tags=["Système"])
def system_info():
    return {
        "company": "RB INDUSTRIEL",
        "manager": "Rachid BOUZAYD",
        "activity": "Gaz Industriels & Matériel de Soudage",
        "address": "Hay Amal 1, N° 92, Appt N° 8, Tit Mellil, Casablanca - Maroc",
        "phones": ["06 61 49 04 95", "07 00 95 00 64", "06 90 90 74 88", "06 95 95 86 27", "05 22 35 48 68"],
        "frontend_dist": DIST_DIR
    }

@app.get("/{full_path:path}", include_in_schema=False)
async def serve_spa_frontend(full_path: str):
    if DIST_DIR:
        if full_path:
            candidate_file = os.path.join(DIST_DIR, full_path)
            if os.path.isfile(candidate_file):
                return FileResponse(candidate_file)
        index_file = os.path.join(DIST_DIR, "index.html")
        if os.path.isfile(index_file):
            return FileResponse(index_file)
    return {
        "company": "RB INDUSTRIEL",
        "service": "RB INDUSTRIEL Backend API",
        "status": "online"
    }


