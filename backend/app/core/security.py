import hashlib
import secrets

def hash_password(password: str) -> str:
    """Hash password using PBKDF2-HMAC-SHA256 with 100,000 iterations and 16-byte random salt."""
    salt = secrets.token_hex(16)
    hashed = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000).hex()
    return f"{salt}:{hashed}"

def verify_password(password: str, stored_hash: str) -> bool:
    """Verify password against stored hash (salt:hash), with backwards compatibility."""
    if not stored_hash:
        return False
    if ":" in stored_hash:
        salt, hash_val = stored_hash.split(":", 1)
        test_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000).hex()
        return secrets.compare_digest(hash_val, test_hash)
    # Legacy plain text comparison if any
    return secrets.compare_digest(stored_hash, password)

def generate_session_token() -> str:
    """Generate secure admin session token."""
    return f"tt_adm_{secrets.token_hex(24)}"
