import asyncio
from fastapi import APIRouter, WebSocket
from algo_trader.app.config.base_config import ibkr_client

tag = 'health'
router = APIRouter(tags=[tag], prefix=f"/{tag}")

@router.websocket("")
async def health(websocket: WebSocket):
   await websocket.accept()
   while True:
      await websocket.send_json({"connected_status": ibkr_client.isConnected()})
      await asyncio.sleep(1.5)
