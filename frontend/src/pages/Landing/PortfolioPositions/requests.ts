import request from "services";
import { ENDPOINTS } from "common/endpoints";

export interface PortfolioPositionsData {
    symbol: string
    average_cost: number
    contract_id: number
    currency: string
    asset_type: string
    exchange: string
    position: number
}

export const getPortfolioPositions = () => request().get<PortfolioPositionsData[]>(ENDPOINTS.PORTFOLIO_POSITIONS)