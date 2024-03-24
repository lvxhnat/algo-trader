import asyncio
from typing import List
from ib_insync import Trade
from fastapi import APIRouter, WebSocket

from algo_trader.app.config.base_config import ibkr_client

tag = "orders"
router = APIRouter(tags=[tag], prefix=f"/{tag}")


@router.websocket("")
async def portfolio_orders(websocket: WebSocket):
    await websocket.accept()
    open_orders: List[Trade] = await ibkr_client.reqAllOpenOrdersAsync()


if __name__ == "__main__":
    ibkr_client.sync_connect()
    print(ibkr_client.reqAllOpenOrders())
