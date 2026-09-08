import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    icon = Column(String(50), default="Package")
    description = Column(Text, nullable=True)

    products = relationship("Product", back_populates="category", cascade="all, delete-orphan")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True, index=True, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    
    short_desc = Column(String(300), nullable=True)
    description = Column(Text, nullable=True)
    price_estimate = Column(Float, default=0.0) # Prix indicatif ou 0 si sur devis
    unit = Column(String(50), default="Unité") # Bouteille, Unité, Bobine 15kg, etc.
    in_stock = Column(Boolean, default=True)
    badge = Column(String(50), nullable=True) # Ex: "Best Seller", "Pro Choice"
    image_url = Column(String(500), nullable=True)
    
    # Spécifications techniques stockées en JSON
    specifications = Column(JSON, default=dict)
    gas_type = Column(String(50), nullable=True) # Pour filtrer les gaz
    cylinder_sizes = Column(String(100), nullable=True)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    category = relationship("Category", back_populates="products")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_reference = Column(String(50), unique=True, index=True, nullable=False)
    customer_name = Column(String(150), nullable=False)
    customer_phone = Column(String(50), nullable=False)
    customer_email = Column(String(150), nullable=True)
    company_name = Column(String(150), nullable=True)
    delivery_city = Column(String(100), default="Casablanca")
    delivery_address = Column(Text, nullable=True)
    delivery_mode = Column(String(50), default="LIVRAISON_SITE") # LIVRAISON_SITE / RETRAIT_TIT_MELLIL
    notes = Column(Text, nullable=True)
    total_estimated = Column(Float, default=0.0)
    status = Column(String(50), default="EN_ATTENTE") # EN_ATTENTE, CONFIRMEE, EN_LIVRAISON, LIVREE
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    product_name = Column(String(200), nullable=False)
    quantity = Column(Integer, default=1)
    unit_price = Column(Float, default=0.0)
    total_price = Column(Float, default=0.0)

    order = relationship("Order", back_populates="items")

class QuoteRequest(Base):
    __tablename__ = "quote_requests"

    id = Column(Integer, primary_key=True, index=True)
    quote_reference = Column(String(50), unique=True, index=True, nullable=False)
    client_name = Column(String(150), nullable=False)
    phone = Column(String(50), nullable=False)
    email = Column(String(150), nullable=True)
    company = Column(String(150), nullable=True)
    city = Column(String(100), default="Casablanca")
    needs_description = Column(Text, nullable=False)
    items_json = Column(JSON, default=list) # Liste des articles demandés
    estimated_total = Column(Float, default=0.0)
    status = Column(String(50), default="NOUVEAU") # NOUVEAU, EN_COURS, TRAITE
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    phone = Column(String(50), nullable=False)
    email = Column(String(150), nullable=True)
    subject = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class CompanySettings(Base):
    __tablename__ = "company_settings"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(150), default="RB INDUSTRIEL", nullable=False)
    legal_name = Column(String(150), default="RB INDUSTRIEL S.A.R.L", nullable=False)
    manager_name = Column(String(150), default="Rachid BOUZAYD", nullable=False)
    tagline = Column(String(250), default="Gaz Industriels & Matériel de Soudage • Tit Mellil")
    logo_url = Column(String(500), default="/logo_rb_industriale.png")
    flyer_url = Column(String(500), default="/carte_officielle_tenira.png")
    flyer_4k_url = Column(String(500), default="/carte_officielle_tenira_4k.png")
    phone_main = Column(String(50), default="07 00 95 00 64")
    phone_fixed = Column(String(50), default="05 22 35 48 68")
    whatsapp_phone = Column(String(50), default="212700950064")
    email = Column(String(150), default="")
    address = Column(String(250), default="Hay Amal 1, N° 92, Appt N° 8, Tit Mellil, Casablanca - Maroc")
    city = Column(String(100), default="Tit Mellil, Casablanca")
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

