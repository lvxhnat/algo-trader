from typing import List
from fastapi import APIRouter, Depends, Query, Request
from algo_trader.app.config.base_config import ibkr_client

router = APIRouter(prefix="/portfolio")

@router.get("")
async def get_portfolio():
    positions = []
    for position in ibkr_client.positions():
        contract = position.contract
        positions.append({
            "contract_id": contract.conId,
            "symbol": contract.symbol,
            "exchange": contract.exchange,
            "currency": contract.currency,
            "asset_type": contract.secType,
            "position": position.position,
            "average_cost": position.avgCost
        })
    return positions
