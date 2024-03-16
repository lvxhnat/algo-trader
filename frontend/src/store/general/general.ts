import { create } from "zustand";

/**
 * Stores the ticker data that is shown on the grid (i.e. The ticker time series)
 */
export interface ConnectedStoreTypes {
  connected: boolean;
  setConnected: (connected: boolean) => void;
}

export const useConnectedStore = create<ConnectedStoreTypes>((set) => ({
  connected: false,
  setConnected: (connected: boolean) => {
    set({ connected: connected });
  },
}));
