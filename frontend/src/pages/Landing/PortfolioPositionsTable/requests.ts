import PortfolioPositions from "./PortfolioPositionsTable";

export interface PortfolioWebsocketData {
  data: PortfolioPositions;
}

export interface PortfolioPositions {
  symbol: string;
  average_cost: number;
  contract_id: number;
  currency: string;
  asset_type: string;
  exchange: string;
  position: number;
  market_price: number;
  market_value: number;
  unrealised_pnl: number;
  daily_pnl: number;
}
