from fastapi import APIRouter
from algo_trader.app.api.endpoints.portfolio import router as portfolio_router

api_router = APIRouter()

api_router.include_router(portfolio_router)
