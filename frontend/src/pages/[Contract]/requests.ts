import { ROUTES } from "common/constant";
import request from "services";

export const getContractInfo = (contractId: string) =>
  request().get<ContractInfo>(`${ROUTES.CONTRACT}/${contractId}/info`);

export interface ContractInfo {
  category: string;
  industry: string;
  long_name: string;
  sub_category: string;
  time_zone: string;
  liquid_hours: { [date: string]: { start: string; end: string } };
  trading_hours: { [date: string]: { start: string; end: string } };
  symbol: string;
  contract_id: string;
  exchange: string;
  currency: string;
  asset_type: string;
}

export const getHistoricalData = (contractId: string) =>
  request().get(`${ROUTES.CONTRACT}/${contractId}/historical`);

export const getHistoricalNews = (contractId: string) =>
  request().get(`${ROUTES.CONTRACT}/${contractId}/news`);
