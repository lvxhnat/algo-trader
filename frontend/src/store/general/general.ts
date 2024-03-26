import { create } from "zustand";

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

export interface Orders {
  contract_id: number;
  symbol: string;
  exchange: string;
  currency: string;
  orders_id: number;
  action: string;
  total_quantity: number;
  filled_quantity: number;
  order_type: string;
  time_in_force: string;
  limit_price: number;
  trailstop_price: number;
}

export interface OrdersStore {
  [conId: number]: Orders[];
}

export interface OrdersStoreTypes {
  orders: OrdersStore;
  initConnected: (orders: OrdersStore) => void;
}

export const useOrdersStore = create<OrdersStoreTypes>((set) => ({
  orders: {},
  initConnected: (orders: OrdersStore) => set({ orders: orders }),
}));
