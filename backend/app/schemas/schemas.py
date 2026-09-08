import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr

# --- Category Schemas ---
class CategoryBase(BaseModel):
    name: str
    slug: str
    icon: Optional[str] = "Package"
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int

    class Config:
        from_attributes = True

# --- Product Schemas ---
class ProductBase(BaseModel):
    name: str
    slug: str
    category_id: int
    short_desc: Optional[str] = None
    description: Optional[str] = None
    price_estimate: float = 0.0
    unit: str = "Unité"
    in_stock: bool = True
    badge: Optional[str] = None
    image_url: Optional[str] = None
    specifications: Optional[Dict[str, Any]] = None
    gas_type: Optional[str] = None
    cylinder_sizes: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: int
    created_at: datetime.datetime
    category: Optional[CategoryResponse] = None

    class Config:
        from_attributes = True

# --- Order Item & Order Schemas ---
class OrderItemCreate(BaseModel):
    product_id: Optional[int] = None
    product_name: str
    quantity: int = 1
    unit_price: float = 0.0

class OrderItemResponse(OrderItemCreate):
    id: int
    total_price: float

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    customer_email: Optional[str] = None
    company_name: Optional[str] = None
    delivery_city: str = "Casablanca"
    delivery_address: Optional[str] = None
    delivery_mode: str = "LIVRAISON_SITE"
    notes: Optional[str] = None
    items: List[OrderItemCreate]

class OrderResponse(BaseModel):
    id: int
    order_reference: str
    customer_name: str
    customer_phone: str
    customer_email: Optional[str] = None
    company_name: Optional[str] = None
    delivery_city: str
    delivery_address: Optional[str] = None
    delivery_mode: str
    notes: Optional[str] = None
    total_estimated: float
    status: str
    created_at: datetime.datetime
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True

# --- Quote Request Schemas ---
class QuoteRequestCreate(BaseModel):
    client_name: str
    phone: str
    email: Optional[str] = None
    company: Optional[str] = None
    city: str = "Casablanca"
    needs_description: str
    items_json: Optional[Any] = None
    estimated_total: Optional[float] = 0.0

class QuoteRequestResponse(BaseModel):
    id: int
    quote_reference: str
    client_name: str
    phone: str
    email: Optional[str] = None
    company: Optional[str] = None
    city: str
    needs_description: str
    items_json: Optional[Any] = None
    estimated_total: float
    status: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# --- Contact Schemas ---
class ContactCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    subject: str
    message: str

class ContactResponse(ContactCreate):
    id: int
    is_read: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# --- Statistics Schemas ---
class StatsResponse(BaseModel):
    total_products: int
    total_categories: int
    total_orders: int
    total_quotes: int
    active_deliveries: int
