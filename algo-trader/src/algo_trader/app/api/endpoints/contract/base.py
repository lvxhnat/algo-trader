import asyncio
from typing import List
from starlette.websockets import WebSocketState
from ib_insync import ContractDetails, Contract
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from algo_trader.app.config.base_config import ibkr_client
from algo_trader.app.api.clients.news import request_historical_news_headlines
from algo_trader.app.api.clients.contracts import (
    serialise_contractdetails,
    SerialisedContractDetails,
    serialise_tickerdata,
    parse_hours,
)

from algo_trader.app.api.endpoints.contract.models import TickerInfoDTO
from algo_trader.app.api.endpoints.contract.params import (
    HistoricalPriceType,
    HistoricalDurationType,
    HistoricalIntervalType,
)

tag = "contract"
router = APIRouter(tags=[tag], prefix=f"/{tag}")


@router.get("/{contractId}/news")
async def get_ticker_news(contractId: str):
    return await request_historical_news_headlines(contract_id=contractId)


@router.get("/{contractId}/info")
async def get_ticker_info(contractId: str) -> TickerInfoDTO:
    contract: Contract = Contract(conId=contractId)
    await ibkr_client.qualifyContractsAsync(contract)
    contract_details: List[ContractDetails] = (
        await ibkr_client.reqContractDetailsAsync(contract)
    )
    contract_details: SerialisedContractDetails = (
        await serialise_contractdetails(contract_details[0])
    )
    contract_details["symbol"] = contract.symbol
    contract_details["contract_id"] = contract.conId
    contract_details["exchange"] = contract.exchange
    contract_details["currency"] = contract.currency
    contract_details["asset_type"] = contract.secType
    return contract_details


@router.get("/{contractId}/historical")
async def get_ticker_historical(
    contractId: str,
    duration: HistoricalDurationType = "30 D",
    interval: HistoricalIntervalType = "1 hour",
    price_type: HistoricalPriceType = "MIDPOINT",
):
    contract = Contract(conId=contractId)
    await ibkr_client.qualifyContractsAsync(contract)
    data = await ibkr_client.reqHistoricalDataAsync(
        contract,
        "",
        barSizeSetting=interval,
        durationStr=duration,
        whatToShow=price_type,
        useRTH=True,
    )
    return data


@router.websocket("/{contractId}/price")
async def get_price_stream(
    contractId: str,
    websocket: WebSocket,
):

    await websocket.accept()

    def on_tick_update(tickers):
        for ticker in tickers:
            if ticker.contract.conId == int(contractId):
                asyncio.create_task(send_data(ticker))

    async def send_data(ticker):
        if websocket.application_state == WebSocketState.CONNECTED:
            data = await serialise_tickerdata(
                ticker, status="delayed"
            )  # Ensure this function is async or adjust accordingly
            await websocket.send_json(data)

    contract = Contract(conId=contractId)
    await ibkr_client.qualifyContractsAsync(contract)

    dividends, high_lows, last_prices = "456", "165", "233"
    request_types = ",".join([dividends, high_lows, last_prices])
    ticker = ibkr_client.reqMktData(contract, request_types)
    await asyncio.sleep(2)
    ibkr_client.pendingTickersEvent += on_tick_update
    await send_data(ticker)

    try:
        while True:
            await asyncio.sleep(10)  # Keep the connection alive
    except WebSocketDisconnect:
        print(f"{contract.symbol} Price Socket Disconnected")
    except RuntimeError as e:
        print(f"RuntimeError Encountered on {contract.symbol} Price Socket.")
    finally:
        print("Cleaning up {contract.symbol} Price Socket.")
        ibkr_client.cancelMktData(contract)
        ibkr_client.pendingTickersEvent -= on_tick_update
