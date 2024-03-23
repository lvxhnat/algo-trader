import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from algo_trader.app.config.base_config import ibkr_client

tag = "orders"
router = APIRouter(tags=[tag], prefix=f"/{tag}")


@router.websocket("")
async def portfolio_orders(websocket: WebSocket):
    await websocket.accept()
    ibkr_client.openOrders()


if __name__ == "__main__":
    ibkr_client.sync_connect()
    print(ibkr_client.reqAllOpenOrders())
