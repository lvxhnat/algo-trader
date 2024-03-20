import { create } from "zustand";
import { PortfolioPositions } from "pages/Landing/PortfolioPositionsTable/requests";

export interface PositionTableData {
  [symbol: string]: PortfolioPositions;
}

/**
 * Stores the ticker data that is shown on the grid (i.e. The ticker time series)
 */
export interface PortfolioStoreTypes {
  activePositions: PositionTableData;
  setActivePositions: (data: PortfolioPositions) => void;
}

export const usePortfolioStore = create<PortfolioStoreTypes>((set) => ({
  activePositions: {},
  setActivePositions: (data: PortfolioPositions) =>
    set((state) => {
      const currentPositions = state.activePositions;
      // Check if the symbol exists and if daily_pnl is null
      const keyExists = Object.keys(currentPositions).includes(data.symbol);
      if (keyExists && !data.daily_pnl) {
        data.daily_pnl = currentPositions[data.symbol].daily_pnl;
      }
      return {
        activePositions: {
          ...currentPositions,
          [data.symbol]: data,
        },
      };
    }),
}));
