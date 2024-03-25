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
export const Intervals = [
  "1 secs",
  "5 secs",
  "10 secs",
  "15 secs",
  "30 secs",
  "1 min",
  "2 mins",
  "3 mins",
  "5 mins",
  "10 mins",
  "15 mins",
  "20 mins",
  "30 mins",
  "1 hour",
  "2 hours",
  "3 hours",
  "4 hours",
  "8 hours",
  "1 day",
  "1 week",
  "1 month",
];
export const Durations = ["60 S", "30 D", "13 W", "6 M", "10 Y"];
export type IntervalTypes =
  | "1 secs"
  | "5 secs"
  | "10 secs"
  | "15 secs"
  | "30 secs"
  | "1 min"
  | "2 mins"
  | "3 mins"
  | "5 mins"
  | "10 mins"
  | "15 mins"
  | "20 mins"
  | "30 mins"
  | "1 hour"
  | "2 hours"
  | "3 hours"
  | "4 hours"
  | "8 hours"
  | "1 day"
  | "1 week"
  | "1 month";
export type DurationTypes = "60 S" | "30 D" | "13 W" | "6 M" | "10 Y";
interface TickerHistoricalParams {
  duration?: DurationTypes;
  interval?: IntervalTypes;
  price_type?:
    | "TRADES"
    | "MIDPOINT"
    | "BID"
    | "ASK"
    | "BID_ASK"
    | "ADJUSTED_LAST"
    | "HISTORICAL_VOLATILITY"
    | "OPTION_IMPLIED_VOLATILITY"
    | "REBATE_RATE"
    | "FEE_RATE"
    | "YIELD_BID"
    | "YIELD_ASK"
    | "YIELD_BID_ASK"
    | "YIELD_LAST";
}

export const getHistoricalData = (
  contractId: string,
  params: TickerHistoricalParams
) => request().get(`${ROUTES.CONTRACT}/${contractId}/historical`, { params });

export const getHistoricalNews = (contractId: string) =>
  request().get(`${ROUTES.CONTRACT}/${contractId}/news`);
