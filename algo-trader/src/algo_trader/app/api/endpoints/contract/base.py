import asyncio
from typing import List
from datetime import datetime
from fastapi import APIRouter, WebSocket
from ib_insync import ContractDetails, Contract

from algo_trader.app.config.base_config import ibkr_client
from algo_trader.app.api.clients.news import request_historical_news_headlines
from algo_trader.app.api.clients.contracts import serialise_contractdetails, SerialisedContractDetails, request_last_price, parse_hours

from algo_trader.app.api.endpoints.contract.models import TickerInfoDTO

tag = "contract"
router = APIRouter(tags=[tag], prefix=f"/{tag}")

@router.get("/{contractId}/news")
async def get_ticker_news(contractId: str):
    return await request_historical_news_headlines(contract_id=contractId)

@router.get("/{contractId}/info")
async def get_ticker_info(contractId: str) -> TickerInfoDTO:
    contract: Contract = Contract(conId=contractId)
    await ibkr_client.qualifyContractsAsync(contract)
    contract_details: List[ContractDetails] = await ibkr_client.reqContractDetailsAsync(contract)
    contract_details: SerialisedContractDetails = await serialise_contractdetails(contract_details[0])
    contract_details["symbol"] = contract.symbol
    contract_details["contract_id"] = contract.conId
    contract_details["exchange"] = contract.exchange
    contract_details["currency"] = contract.currency
    contract_details["asset_type"] = contract.secType
    return contract_details

@router.get("/{contractId}/historical")
async def get_ticker_historical(contractId: str):
    contract = Contract(conId=contractId)
    await ibkr_client.qualifyContractsAsync(contract)
    data = await ibkr_client.reqHistoricalDataAsync(
        contract,
        '', 
        barSizeSetting='15 mins', 
        durationStr='5 D', 
        whatToShow='MIDPOINT', 
        useRTH=True
    )
    return data

@router.websocket("/{contractId}/price")
async def get_price_stream(
    contractId: str,
    websocket: WebSocket,
):
    await websocket.accept()
    contract = Contract(conId=contractId)
    await ibkr_client.qualifyContractsAsync(contract)
    contract_details: List[ContractDetails] = await ibkr_client.reqContractDetailsAsync(contract)
    contract_details: ContractDetails = contract_details[0]

    # Check if market is open or not
    liquid_hours = await parse_hours(contract_details.liquidHours)
    
    date_today = datetime.today().strftime("%Y%m%d")
    
    market_open = liquid_hours[date_today]['start']
    market_close = liquid_hours[date_today]['start'].replace(date_today + ":", "")
    
    while True:
        data = await request_last_price(contractId)
        await websocket.send_json(data)
        await asyncio.sleep(2)