import asyncio
from ib_insync import Stock
from fastapi import APIRouter
from algo_trader.app.config.base_config import ibkr_client

tag = "ticker"
router = APIRouter(tags=[tag], prefix=f"/{tag}")

@router.websocket("{ticker}")
async def get_ticker(ticker: str):

    # Note: The exchanges must be open when using this request, otherwise an empty list is returned.
    ticker = Stock('TSLA', 'SMART', 'USD')
    ibkr_client.qualifyContracts(ticker)

    snapshot = ibkr_client.reqTickers(ticker)

if __name__ == '__main__':
    ibkr_client.sync_connect()

    ticker = Stock('TSLA', 'SMART', 'USD')
    ibkr_client.qualifyContracts(ticker)
    print(ibkr_client.reqContractDetails(ticker))
    
    # snapshot = ibkr_client.reqTickers(ticker)
    # print(ticker)
