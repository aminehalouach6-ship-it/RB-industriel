import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

logger = logging.getLogger(__name__)

db_url = settings.normalized_database_url

try:
    if "sqlite" in db_url:
        engine = create_engine(db_url, connect_args={"check_same_thread": False})
    else:
        engine = create_engine(db_url, pool_pre_ping=True)
    # Test connection
    with engine.connect() as conn:
        logger.info("Successfully connected to primary database.")
except Exception as e:
    logger.warning(f"Could not connect to {db_url}: {e}. Falling back to sqlite:///./tenira_local.db for resilience.")
    engine = create_engine("sqlite:///./tenira_local.db", connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
