from fastapi import APIRouter
from algo_trader.app.config.base_config import ibkr_client

tag = 'health'
router = APIRouter(tags=[tag], prefix=f"/{tag}")

@router.get("/ping")
async def health():
   return {"connected_status": ibkr_client.isConnected()}
