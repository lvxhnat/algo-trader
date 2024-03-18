from typing import List
from fastapi import APIRouter, WebSocket
from ib_insync import PortfolioItem
from algo_trader.app.config.base_config import ibkr_client
from algo_trader.app.api.clients.portfolio import serialise_portfolioitem

tag = "portfolio"
router = APIRouter(tags=[tag], prefix=f"/{tag}")

@router.websocket("/holdings")
async def get_portfolio_holdings(websocket: WebSocket):

    await websocket.accept()
    
    positions = []
    portfolio_items: List[PortfolioItem] = ibkr_client.portfolio()

    for portfolio_item in portfolio_items:
        positions.append(await serialise_portfolioitem(portfolio_item))

    await websocket.send_json({"status": "initialise", "data": positions})

    async def send_portfolio_event(portfolio_item: PortfolioItem):
        print("Portfolio Event")
        await websocket.send_json({"status": "change", "data": await serialise_portfolioitem(portfolio_item)})

    ibkr_client.updatePortfolioEvent += send_portfolio_event

