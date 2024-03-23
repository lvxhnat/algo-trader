import { THEME_MODE_KEY } from "common/constant";
import { getCookie } from "common/helper/cookies";
import ThemeProvider from "providers/ThemeProvider";
import ReactDOM from "react-dom/client";
import App from "./App";
import WebSocketProvider from "providers/WebsocketProvider/WebsocketProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

function ThemedApp() {
  const modeTheme = getCookie(THEME_MODE_KEY);

  return (
    <WebSocketProvider>
      <ThemeProvider modeTheme={modeTheme}>
        <App />
      </ThemeProvider>
    </WebSocketProvider>
  );
}

root.render(<ThemedApp />);
