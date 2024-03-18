import math
import asyncio
from pydantic import BaseModel
from ib_insync import ContractDetails, Contract
from algo_trader.app.config.base_config import ibkr_client

async def parse_hours(hours): 
    # Splitting the string into a list of days and hours
    days_hours = hours.split(';')

    # Initializing a dictionary to hold the parsed data
    parsed_hours = {}

    # Looping through each item and parsing it into the dictionary using .partition()
    for day_hour in days_hours:
        day, _, hours = day_hour.partition(':')
        if "CLOSED" in hours:
            parsed_hours[day] = "Closed"
        else:
            start, _, end = hours.partition('-')
            parsed_hours[day] = {"start": start, "end": end.replace(day + ":", "")}

    return parsed_hours

class SerialisedContractDetails(BaseModel):
    long_name: str
    industry: str
    category: str
    sub_category: str
    time_zone: str
    trading_hours: dict
    liquid_hours: dict

async def serialise_contractdetails(contract_detail: ContractDetails) -> SerialisedContractDetails:
    return {
        "long_name": contract_detail.longName, 
        "industry": contract_detail.industry,
        "category": contract_detail.category,
        "sub_category": contract_detail.subcategory,
        "time_zone": contract_detail.timeZoneId,
        "trading_hours": await parse_hours(contract_detail.tradingHours),
        "liquid_hours": await parse_hours(contract_detail.liquidHours),
    }

async def request_last_price(contract_id: str):
    
    dividends = "456"
    high_lows = "165"
    last_prices = "233"

    contract = Contract(conId=contract_id)
    ibkr_client.reqMarketDataType(2) # Needs to be frozen data, or last will be nan
    await ibkr_client.qualifyContractsAsync(contract)

    request_types = ",".join([dividends, high_lows, last_prices])
    data = ibkr_client.reqMktData(contract, request_types)
    await asyncio.sleep(3)

    response = {
            "status": "unsubscribed",
            "last": None,
            "last_size": None,
            "last_bid": None,
            "last_bid_size": None,
            "last_ask": None,
            "last_ask_size": None,
            "dividends": None,
        }
    check_nan = lambda v: None if math.isnan(v) else v
    try:
        response["status"] = "ok"
        response["last"] = data.close if math.isnan(data.last) else data.last
        response["last_size"] = check_nan(data.lastSize)
        response["last_bid"] = check_nan(data.bid)
        response["last_bid_size"] = check_nan(data.bidSize)
        response["last_ask"] = check_nan(data.ask)
        response["last_ask_size"] = check_nan(data.askSize)
        response["dividends"] = {
            "past_12_months": data.dividends.past12Months,
            "next_12_months": data.dividends.past12Months,
            "next_date": data.dividends.nextDate.strftime("%Y-%m-%d"),
            "next_amount": data.dividends.nextAmount
        } if data.dividends else None
        return response
    except: 
        return response
    

if __name__ == '__main__':
    ibkr_client.sync_connect()
    