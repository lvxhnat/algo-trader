from typing import List
from fastapi import APIRouter, WebSocket

from algo_trader.app.config.base_config import ibkr_client

tag = "news"
router = APIRouter(tags=[tag], prefix=f"/{tag}")


@router.websocket("")
async def portfolio_orders(websocket: WebSocket):
    await websocket.accept()


if __name__ == "__main__":
    from ib_insync import Contract
    from datetime import datetime, timedelta
    from algo_trader.app.api.clients.news import (
        request_historical_news_headlines,
    )

    ibkr_client.sync_connect()

    news_providers = ibkr_client.reqNewsProviders()
    provider_codes = "+".join([provider.code for provider in news_providers])
    start: datetime = (datetime.today() - timedelta(days=10),)
    end: datetime = (datetime.today(),)
    headlines = ibkr_client.reqHistoricalNews(
        208813720, provider_codes, start, end, 30
    )
    print(headlines)
