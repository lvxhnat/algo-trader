import React, { useEffect } from "react";
import { useConnectedStore, useOrdersStore } from "store/general/general";

interface WebSocketProviderProps {
  children?: React.ReactNode;
}

function connectWebsocket(url: string, setValue: (val: any) => void) {
  let ws = new WebSocket(url);

  ws.onmessage = function (event) {
    setValue(JSON.parse(event.data));
  };

  ws.onerror = function (err: any) {
    setValue(false);
    ws.close();
    setTimeout(function () {
      connectWebsocket(url, setValue);
    }, 2000);
  };

  return ws;
}

const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const setConnected = useConnectedStore((state) => state.setConnected);
  const [initOrders] = useOrdersStore((state) => [state.initConnected]);

  useEffect(() => {
    const healthSocket: WebSocket = connectWebsocket(
      `${process.env.REACT_APP_WEBSOCKET_URL!}/health`,
      (val) => setConnected(val.connected_status)
    );
    if (!healthSocket.readyState) setConnected(false);
    const orderSocket: WebSocket = connectWebsocket(
      `${process.env.REACT_APP_WEBSOCKET_URL!}/orders`,
      (val) => {
        if (val.type === "initialise") initOrders(val.data);
      }
    );

    return () => {
      if (healthSocket) healthSocket.close();
      if (orderSocket) orderSocket.close();
      console.log("Health WebSocket Connection Closed");
    };
  }, []);

  return <>{children}</>;
};

export default WebSocketProvider;
