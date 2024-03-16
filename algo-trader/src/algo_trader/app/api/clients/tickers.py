from typing import List

from ib_insync import Contract, ContractDetails

async def get_ticker_details(
    ibkr_client,
    tickers: List[Contract] | Contract,
):
    ibkr_client.qualifyContracts(tickers)
    contract_details: List[ContractDetails] = ibkr_client.reqContractDetails(tickers)

    async def _parse_hours(hours): 
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
                parsed_hours[day] = {"start": start, "end": end}

        return parsed_hours

    async def serialise_contractdetails(contract_detail):
        return {
            "asset_type": contract_detail.secType,
            "contract_id": contract_detail.conId,
            "symbol": contract_detail.symbol,
            "long_name": contract_detail.longName, 
            "exchange": contract_detail.exchange,
            "primary_exchange": contract_detail.primaryExchange,
            "currency": contract_detail.currency,
            "industry": contract_detail.industry,
            "category": contract_detail.category,
            "sub_category": contract_detail.subcategory,
            "time_zone": await _parse_hours(contract_detail.timeZoneId),
            "trading_hours": await _parse_hours(contract_detail.tradingHours),
            "liquid_hours": contract_detail.liquidHours
        }
    
    results = [await serialise_contractdetails(detail) for detail in contract_details]
    return results