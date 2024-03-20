import math
import asyncio
from typing import List
from fastapi import APIRouter, WebSocket
from starlette.websockets import WebSocketState, WebSocketDisconnect
from ib_insync import PortfolioItem, PnLSingle
from algo_trader.app.config.base_config import ibkr_client
from algo_trader.app.api.clients.portfolio import serialise_portfolioitem, SerialisedPortfolioItem

tag = "portfolio"
router = APIRouter(tags=[tag], prefix=f"/{tag}")

@router.websocket("/holdings")
async def get_portfolio_holdings(websocket: WebSocket):
    """ Use both .portfolio() with .reqPnLSingle() methods to update our events
    """
    await websocket.accept()

    accounts = ibkr_client.managedAccounts()
    await asyncio.sleep(2)
    account = accounts[0]  # Use the first account, or adjust as necessary
    portfolio_items: dict = {}
    for portfolio_item in ibkr_client.portfolio():
        data = await serialise_portfolioitem(portfolio_item)
        portfolio_items[data["contract_id"]] = data
    pnl_subscriptions: dict = {pnl.conId: pnl for pnl in ibkr_client.pnl()} # Get existing pnl subscriptions

    async def send_portfolio_event(portfolio_item: PortfolioItem):
        if websocket.application_state == WebSocketState.CONNECTED:
            if isinstance(portfolio_item, PortfolioItem): 
                portfolio_item: SerialisedPortfolioItem = await serialise_portfolioitem(portfolio_item)
            portfolio_items[portfolio_item["contract_id"]] = portfolio_item
            await websocket.send_json({"data": portfolio_item})
    
    async def update_portfolio_event(pnl: PnLSingle):
        if websocket.application_state == WebSocketState.CONNECTED:
            contract_id = pnl.conId
            pnl_subscriptions[contract_id] = pnl # Update existing PnL entry
            portfolio_items[contract_id]["daily_pnl"] = None if math.isnan(pnl.dailyPnL) else pnl.dailyPnL # This is the only field not returned by .positions()
            if not math.isnan(pnl.unrealizedPnL):
                portfolio_items[contract_id]["unrealised_pnl"] = pnl.unrealizedPnL
            if not math.isnan(pnl.value):
                portfolio_items[contract_id]["market_value"] = pnl.value
                portfolio_items[contract_id]["market_price"] = float(pnl.value) / float(pnl.position)
            await websocket.send_json({"data": portfolio_items[contract_id]})
    
    # Subscribe to PnL for each portfolio item and send initial positions
    for contract_id, portfolio_item in portfolio_items.items():
        # Subscribe to P&L updates (modify according to how you want to handle subscriptions to avoid errors)
        await send_portfolio_event(portfolio_item)
        if contract_id not in pnl_subscriptions:
            try: 
                pnl_sub: PnLSingle = ibkr_client.reqPnLSingle(account, '', contract_id)
                pnl_subscriptions[contract_id] = pnl_sub
                await update_portfolio_event(pnl_sub)
            except Exception: print(f"PnL Subscription for contract id {contract_id} already exists.")

    ibkr_client.updatePortfolioEvent += send_portfolio_event
    ibkr_client.pnlSingleEvent += update_portfolio_event
    
    try:
        while True:
            await asyncio.sleep(10)  # Keep the connection alive
    except WebSocketDisconnect:
        print("PortfolioHoldings Socket Disconnected")
    except RuntimeError:
        print(f"RuntimeError Encountered on PortfolioHoldings Socket.")
    finally:
        print("Cleaning up PortfolioHoldings Socket.")
        # Unsubscribe from P&L updates to clean up
        for pnl_sub in pnl_subscriptions.values():
            ibkr_client.cancelPnLSingle(pnl_sub)
        ibkr_client.updatePortfolioEvent -= send_portfolio_event

if __name__ == '__main__':
    ibkr_client.sync_connect()