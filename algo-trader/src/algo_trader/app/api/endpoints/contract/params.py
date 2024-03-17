from pydantic import BaseModel
from typing import Literal

class GetTickerParams(BaseModel):
    duration: Literal["60 S", "30 D", "13 W", "6 M", "10 Y"]
    interval: Literal["1 secs", "5 secs", "10 secs", "15 secs", "30 secs", "1 min", "2 mins", "3 mins", "5 mins", "10 mins", "15 mins", "20 mins", "30 mins", "1 hour", "2 hours", "3 hours", "4 hours", "8 hours", "1 day", "1 week", "1 month"]
    price_type: Literal["TRADES", "MIDPOINT", "BID", "ASK", "BID_ASK", "ADJUSTED_LAST", "HISTORICAL_VOLATILITY", "OPTION_IMPLIED_VOLATILITY", "REBATE_RATE", "FEE_RATE", "YIELD_BID", "YIELD_ASK", "YIELD_BID_ASK", "YIELD_LAST"]