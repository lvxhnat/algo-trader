from typing import List
from fastapi import APIRouter
from ib_insync import ContractDetails, Stock
from algo_trader.app.config.base_config import ibkr_client
from algo_trader.app.api.clients.tickers import serialise_contractdetails, SerialisedContractDetails

tag = "ticker"
router = APIRouter(tags=[tag], prefix=f"/{tag}")

async def get_ticker_info():
    contract = ...
    ibkr_client.qualifyContractsAsync(contract)
    contract_details: List[ContractDetails] = await ibkr_client.reqContractDetailsAsync(contract)
    contract_details: SerialisedContractDetails = await serialise_contractdetails(contract_details[0])

@router.websocket("/{ticker}")
async def get_price_stream(ticker: str):

    # Note: The exchanges must be open when using this request, otherwise an empty list is returned.
    ticker = Stock('TSLA', 'SMART', 'USD')
    ibkr_client.qualifyContracts(ticker)

if __name__ == '__main__':
    ibkr_client.sync_connect()

    ticker = Stock('TSLA', 'SMART', 'USD')
    ibkr_client.qualifyContracts(ticker)
    print(ibkr_client.reqContractDetails(ticker))
    
    # snapshot = ibkr_client.reqTickers(ticker)
    # print(ticker)
