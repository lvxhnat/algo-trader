from pydantic import BaseModel
from ib_insync import ContractDetails

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
        "trading_hours": await _parse_hours(contract_detail.tradingHours),
        "liquid_hours": await _parse_hours(contract_detail.liquidHours),
    }
