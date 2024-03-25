from fastapi import APIRouter
from algo_trader.app.api.endpoints.portfolio import router as portfolio_router
from algo_trader.app.api.endpoints.health import router as health_router
from algo_trader.app.api.endpoints.contract import router as contract_router
from algo_trader.app.api.endpoints.orders import router as orders_router

api_router = APIRouter()

api_router.include_router(portfolio_router)
api_router.include_router(health_router)
api_router.include_router(orders_router)
api_router.include_router(contract_router)
