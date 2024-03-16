from fastapi import APIRouter
from algo_trader.app.api.endpoints.portfolio import router as portfolio_router
from algo_trader.app.api.endpoints.health import router as health_router

api_router = APIRouter()

api_router.include_router(portfolio_router)
api_router.include_router(health_router)