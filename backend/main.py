"""
AIfiesta Root Module Entrypoint
Re-exports the FastAPI app from app.main
"""
import os
from app.main import app

if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    is_dev = os.getenv("ENVIRONMENT", "development").lower() == "development" and not os.getenv("RENDER")
    uvicorn.run("main:app", host=host, port=port, reload=is_dev)
