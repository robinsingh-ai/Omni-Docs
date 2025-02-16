# main.py

import uvicorn
from app.core.config import get_settings

settings = get_settings()

if __name__ == "__main__":
    uvicorn.run(
        "app.api_router:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )