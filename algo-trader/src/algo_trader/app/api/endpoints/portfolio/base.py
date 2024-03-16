from fastapi import APIRouter
from typing import List
from ib_insync import Contract, ContractDetails
from algo_trader.app.config.base_config import ibkr_client

tag = "portfolio"
router = APIRouter(tags=[tag], prefix=f"/{tag}")

@router.get("")
async def get_portfolio():

    positions = []

    for position in ibkr_client.positions():
        contract = position.contract

        ibkr_client.qualifyContracts(contract)
        contract_details: List[ContractDetails] = ibkr_client.reqContractDetailsAsync(contract)

        print(contract_details)

        positions.append({
            "contract_id": contract.conId,
            "symbol": contract.symbol,
            "exchange": contract.exchange,
            "currency": contract.currency,
            "asset_type": contract.secType,
            "position": position.position,
            "average_cost": position.avgCost,
        })

    return positions
