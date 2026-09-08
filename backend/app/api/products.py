from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.core.database import get_db
from app.models.models import Product, Category
from app.schemas.schemas import ProductResponse, ProductCreate, CategoryResponse

router = APIRouter()

@router.get("/categories", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()

@router.get("", response_model=List[ProductResponse])
def get_products(
    category_slug: Optional[str] = Query(None, description="Filtrer par catégorie slug"),
    category_id: Optional[int] = Query(None, description="Filtrer par catégorie ID"),
    search: Optional[str] = Query(None, description="Recherche par mot clé dans nom/description"),
    in_stock: Optional[bool] = Query(None, description="Filtrer disponibilité"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Product)
    
    if category_slug:
        query = query.join(Category).filter(Category.slug == category_slug)
    elif category_id:
        query = query.filter(Product.category_id == category_id)
        
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            or_(
                Product.name.ilike(search_fmt),
                Product.short_desc.ilike(search_fmt),
                Product.description.ilike(search_fmt),
                Product.gas_type.ilike(search_fmt)
            )
        )
        
    if in_stock is not None:
        query = query.filter(Product.in_stock == in_stock)

    products = query.offset(skip).limit(limit).all()
    return products

@router.get("/{product_id_or_slug}", response_model=ProductResponse)
def get_product(product_id_or_slug: str, db: Session = Depends(get_db)):
    if product_id_or_slug.isdigit():
        prod = db.query(Product).filter(Product.id == int(product_id_or_slug)).first()
    else:
        prod = db.query(Product).filter(Product.slug == product_id_or_slug).first()
        
    if not prod:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    return prod

@router.post("", response_model=ProductResponse, status_code=201)
def create_product(payload: ProductCreate, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == payload.category_id).first()
    if not category:
        raise HTTPException(status_code=400, detail="Catégorie spécifiée invalide")
    
    slug_val = payload.slug
    if not slug_val or not slug_val.strip():
        slug_val = payload.name.lower().replace(" ", "-")
        import re
        slug_val = re.sub(r'[^a-z0-9\-]', '', slug_val)

    existing = db.query(Product).filter(Product.slug == slug_val).first()
    if existing:
        import uuid
        slug_val = f"{slug_val}-{uuid.uuid4().hex[:4]}"
        
    data = payload.dict()
    data['slug'] = slug_val
    product = Product(**data)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(product_id: int, payload: ProductCreate, db: Session = Depends(get_db)):
    prod = db.query(Product).filter(Product.id == product_id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Produit introuvable")
    for key, value in payload.dict().items():
        setattr(prod, key, value)
    db.commit()
    db.refresh(prod)
    return prod

@router.delete("/{product_id}", status_code=204)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    prod = db.query(Product).filter(Product.id == product_id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Produit introuvable")
    db.delete(prod)
    db.commit()
    return None
