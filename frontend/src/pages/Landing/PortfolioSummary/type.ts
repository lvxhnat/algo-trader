export interface CurrencyType {
  BASE: number;
  USD: number;
  SGD: number;
}

export interface PortfolioValuesDTO {
  type: "initialise" | "update";
  data: PortfolioUpdateDTO | PortfolioInitDTO;
}
export interface PortfolioInitDTO extends PortfolioValues {}

export interface PortfolioUpdateDTO {
  tag: string;
  currency: "BASE" | "USD" | "SGD";
  value: number;
}

export interface PortfolioValues {
  AccruedDividend: CurrencyType;
  AvailableFunds: CurrencyType;
  BuyingPower: CurrencyType;
  CashBalance: CurrencyType;
  EquityWithLoanValue: CurrencyType;
  ExcessLiquidity: CurrencyType;
  GrossPositionValue: CurrencyType;
  NetLiquidationByCurrency: CurrencyType;
  TotalCashBalance: CurrencyType;
  UnrealizedPnL: CurrencyType;
}
