import React, { useEffect } from "react";
import { useConnectedStore } from "store/general/general";

interface WebSocketProviderProps {
  children?: React.ReactNode;
}

function connectWebsocket(setConnect: (type: boolean) => void) {
  let ws = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_URL!}/health`);

  ws.onmessage = function (event) {
    setConnect(JSON.parse(event.data).connected_status);
  };

  ws.onerror = function (err: any) {
    setConnect(false);
    ws.close();
    setTimeout(function () {
      connectWebsocket(setConnect);
    }, 2000);
  };

  return ws;
}

const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const setConnected = useConnectedStore((state) => state.setConnected);
  useEffect(() => {
    const healthSocket: WebSocket = connectWebsocket(setConnected);
    if (!healthSocket.readyState) setConnected(false);
    

    return () => {
      if (healthSocket) healthSocket.close();
      console.log("Health WebSocket Connection Closed");
    };
  }, []);

  return <>{children}</>;
};

export default WebSocketProvider;
