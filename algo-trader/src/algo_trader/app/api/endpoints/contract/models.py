from algo_trader.app.api.clients.contracts import SerialisedContractDetails


class TickerInfoDTO(SerialisedContractDetails):
    symbol: str
    contract_id: int
    exchange: str
    currency: str
    asset_type: str
