from fastapi import FastAPI
from backend.core.logging import logger
from backend.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME, version=settings.API_VERSION)

@app.get("/health")
async def health():
    return {"status": "healthy", "version": settings.API_VERSION}

@app.on_event("startup")
async def startup():
    logger.info("🚀 PTDT v32 Sovereign Node started successfully")
