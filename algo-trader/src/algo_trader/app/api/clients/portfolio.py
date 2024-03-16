from pydantic import BaseModel
from ib_insync import PortfolioItem
from algo_trader.app.config.base_config import ibkr_client

class SerialisedPortfolioItem(BaseModel):
    contract_id: str
    symbol: str
    exchange: str
    currency: str
    position: int
    average_cost: float
    market_price: float
    market_value: float
    unrealised_pnl: float


async def serialise_portfolioitem(portfolio_item: PortfolioItem) -> SerialisedPortfolioItem:
    contract = portfolio_item.contract
    return {
            "contract_id": contract.conId,
            "symbol": contract.symbol,
            "exchange": contract.primaryExchange,
            "currency": contract.currency,
            "position": portfolio_item.position,
            "average_cost": portfolio_item.averageCost,
            "market_price": portfolio_item.marketPrice,
            "market_value": portfolio_item.marketValue,
            "unrealised_pnl": portfolio_item.unrealizedPNL, 
        }

if __name__ == '__main__':
    ibkr_client.sync_connect()
    print(ibkr_client.accountValues())