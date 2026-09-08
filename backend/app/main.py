import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.core.database import Base, engine, SessionLocal
from app.seed_data import seed_database
from app.api import products, orders, quotes, contact, stats, auth, upload

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
    description="API officielle TENIRA TRAVAUX - Vente, Distribution et Livraison de Gaz Industriels & Matériel de Soudage à Tit Mellil, Casablanca et partout au Maroc.",
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

@app.get("/api/health", tags=["Système"])
def health_check():
    return {
        "status": "healthy",
        "service": "TENIRA TRAVAUX Backend API",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT
    }

@app.get("/", tags=["Système"])
def root():
    return {
        "company": "TENIRA TRAVAUX",
        "manager": "Rachid BOUZAYD",
        "activity": "Gaz Industriels & Matériel de Soudage",
        "address": "Hay Amal 1, N° 92, Appt N° 8, Tit Mellil, Casablanca - Maroc",
        "phones": ["06 61 49 04 95", "07 00 95 00 64", "06 90 90 74 88", "06 95 95 86 27", "05 22 35 48 68"]
    }

