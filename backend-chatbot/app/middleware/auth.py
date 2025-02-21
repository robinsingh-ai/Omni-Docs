from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from ..core.config import get_settings
from ..core.logger import setup_logger

logger = setup_logger(__name__)
security = HTTPBearer()

async def verify_token(credentials: HTTPAuthorizationCredentials) -> dict:
    """Verify JWT token and return payload."""
    try:
        token = credentials.credentials
        payload = jwt.decode(
            token, 
            get_settings.SUPABASE_JWT_SECRET, 
            algorithms=["HS256"]
        )
        return payload
    except jwt.ExpiredSignatureError:
        logger.warning("Token has expired")
        raise HTTPException(
            status_code=401,
            detail="Token has expired"
        )
    except jwt.InvalidTokenError as e:
        logger.warning(f"Invalid token: {str(e)}")
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )

async def auth_middleware(request: Request):
    """Middleware to verify authentication token."""
    try:
        # Get authorization header
        auth = request.headers.get("Authorization")
        if not auth:
            raise HTTPException(
                status_code=401,
                detail="Authorization header missing"
            )

        # Verify the token format
        scheme, token = auth.split()
        if scheme.lower() != "bearer":
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication scheme"
            )

        # Verify the token
        credentials = HTTPAuthorizationCredentials(
            credentials=token, 
            scheme=scheme
        )
        payload = await verify_token(credentials)
        
        # Add user info to request state
        request.state.user = payload
        
        return payload
        
    except ValueError:
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization header format"
        )
    except Exception as e:
        logger.error(f"Authentication error: {str(e)}")
        raise HTTPException(
            status_code=401,
            detail="Authentication failed"
        ) 