import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.core.database import Base, engine, SessionLocal
from app.seed_data import seed_database
from app.api import products, orders, quotes, contact, stats, auth, upload, company

from sqlalchemy import text

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Schema migration pre-check: ensure required columns exist in PostgreSQL
    try:
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE categories ADD COLUMN IF NOT EXISTS icon VARCHAR(50) DEFAULT 'Package';"))
            conn.execute(text("ALTER TABLE categories ADD COLUMN IF NOT EXISTS slug VARCHAR(100);"))
            conn.execute(text("ALTER TABLE categories ADD COLUMN IF NOT EXISTS description TEXT;"))
            conn.execute(text("ALTER TABLE products ADD COLUMN IF NOT EXISTS specifications JSON DEFAULT '{}'::json;"))
            conn.execute(text("ALTER TABLE products ADD COLUMN IF NOT EXISTS gas_type VARCHAR(50);"))
            conn.execute(text("ALTER TABLE products ADD COLUMN IF NOT EXISTS cylinder_sizes VARCHAR(100);"))
            conn.execute(text("ALTER TABLE products ADD COLUMN IF NOT EXISTS badge VARCHAR(50);"))
            conn.execute(text("ALTER TABLE products ADD COLUMN IF NOT EXISTS short_desc VARCHAR(300);"))
            conn.commit()
    except Exception as e:
        # Ignore for SQLite or non-PostgreSQL
        pass

    # Initialize DB tables
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"create_all notice: {e}")

    # Seed DB with Tenira Travaux catalog
    db = SessionLocal()
    try:
        seed_database(db)
    except Exception as e:
        print(f"seed_database notice: {e}")
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

from fastapi.responses import FileResponse, Response

@app.get("/assets/{asset_name:path}", include_in_schema=False)
async def serve_asset(asset_name: str):
    if DIST_DIR:
        file_path = os.path.join(DIST_DIR, "assets", asset_name)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
    # Stale asset requested by cached browser: trigger automatic reload
    if asset_name.endswith(".js"):
        return Response(
            content="console.warn('Stale bundle chunk detected. Auto-reloading latest version...'); window.location.reload();",
            media_type="application/javascript"
        )
    if asset_name.endswith(".css"):
        return Response(content="", media_type="text/css")
    return Response(status_code=404)

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
            return FileResponse(
                index_file,
                headers={
                    "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
                    "Pragma": "no-cache",
                    "Expires": "0"
                }
            )
    return {
        "company": "RB INDUSTRIEL",
        "service": "RB INDUSTRIEL Backend API",
        "status": "online"
    }


