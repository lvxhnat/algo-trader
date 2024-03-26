import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { PortfolioPositions, PortfolioWebsocketData } from "./requests";
import { useConnectedStore } from "store/general/general";
import { ColorsEnum } from "common/theme";
import { numberWithCommas } from "common/helper/general";
import { currencyToEmoji } from "common/helper/countries";
import { useThemeStore } from "store/theme";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "common/constant";
import { usePortfolioStore } from "store/portfolio/base";

interface PortfolioRowProps {
  entry: PortfolioPositions;
}

const StyledTableCell: React.FC<{
  children?: React.ReactNode;
  color?: string;
  size?: "small" | "medium" | "large";
  fontWeight?: string;
  align?: "left" | "center" | "right" | "justify" | "inherit" | undefined;
}> = (props) => {
  const sizes = { small: "5%", medium: "10%", large: "12%" };
  return (
    <TableCell
      style={{ paddingTop: 1, paddingBottom: 1 }}
      width={props.size ? sizes[props.size] : undefined}
    >
      <Typography
        align={props.align}
        variant="subtitle1"
        color={props.color}
        fontWeight={props.fontWeight}
        style={{ width: "100%" }}
      >
        {props.children}
      </Typography>
    </TableCell>
  );
};

const PortfolioRow: React.FC<PortfolioRowProps> = React.memo(({ entry }) => {
  const theme = useThemeStore();
  const navigate = useNavigate();

  const formatPnl = (val: number) =>
    val
      ? val > 0
        ? `$${val.toFixed(2)}`
        : `$(${val.toFixed(2).slice(1)})`
      : "$-";

  const unrealised_pnl: number = entry.unrealised_pnl;
  const unrealised_pct: number =
    (entry.market_price - entry.average_cost) / entry.average_cost;
  const pnlColor = unrealised_pnl > 0 ? ColorsEnum.green : ColorsEnum.red;
  const pnlString = formatPnl(unrealised_pnl);
  const daily_pnl: number = entry.daily_pnl;
  let dailyPnlColor,
    dailyPnlString = "$-";
  if (daily_pnl) {
    dailyPnlColor = daily_pnl > 0 ? ColorsEnum.green : ColorsEnum.red;
    dailyPnlString = formatPnl(daily_pnl);
  }
  return (
    <TableRow
      key={`${entry.symbol}-outstandingPositions`}
      sx={{
        "&:hover": {
          cursor: "pointer",
          backgroundColor:
            theme.mode === "light" ? ColorsEnum.coolgray6 : ColorsEnum.darkGrey,
        },
      }}
      onClick={() => navigate(`${ROUTES.CONTRACT}/${entry.contract_id}`)}
    >
      <StyledTableCell>
        {`${currencyToEmoji[entry.currency as keyof typeof currencyToEmoji]} ${
          entry.currency
        }`}
      </StyledTableCell>
      <StyledTableCell>{entry.exchange}</StyledTableCell>
      <StyledTableCell fontWeight="bold">{entry.symbol}</StyledTableCell>
      <StyledTableCell>{entry.position}</StyledTableCell>
      <StyledTableCell>
        ${numberWithCommas(entry.average_cost.toFixed(2))}
      </StyledTableCell>
      <StyledTableCell>
        ${numberWithCommas(entry.market_price.toFixed(2))}
      </StyledTableCell>
      <StyledTableCell>
        ${numberWithCommas(entry.market_value.toFixed(2))}
      </StyledTableCell>
      <StyledTableCell color={dailyPnlColor}>{dailyPnlString}</StyledTableCell>
      <StyledTableCell color={pnlColor}>{pnlString}</StyledTableCell>
      <StyledTableCell align="right" color={pnlColor}>
        {unrealised_pct ? `${(100 * unrealised_pct).toFixed(2)}%` : "-%"}
      </StyledTableCell>
    </TableRow>
  );
});

function connectPriceSocket(setActivePositions: (value: any) => void) {
  let ws = new WebSocket(
    `${process.env.REACT_APP_WEBSOCKET_URL}/portfolio/holdings`
  );

  ws.onmessage = function (event) {
    const portfolioData: PortfolioWebsocketData = JSON.parse(event.data);
    const data: PortfolioPositions = portfolioData.data;
    setActivePositions(data);
  };

  ws.onerror = function (err: any) {
    ws.close();
    setTimeout(function () {
      connectPriceSocket(setActivePositions);
    }, 2000);
  };

  return ws;
}

export default function PortfolioPositionsTable() {
  const [activePositions, setActivePositions] = usePortfolioStore((state) => [
    state.activePositions,
    state.setActivePositions,
  ]);
  const connected = useConnectedStore((state) => state.connected);

  React.useEffect(() => {
    const socket = connectPriceSocket(setActivePositions);

    return () => {
      if (socket) socket.close();
      console.log("PortfolioPositions WebSocket Connection Closed");
    };
  }, [connected]);

  return (
    <Table
      stickyHeader
      size="small"
      sx={{
        tableLayout: "fixed",
        width: "100%",
        height: "100%",
        maxHeight: 300,
      }}
    >
      <TableHead>
        <TableRow>
          <StyledTableCell size="medium"> Currency </StyledTableCell>
          <StyledTableCell> Exchange </StyledTableCell>
          <StyledTableCell size="medium"> Symbol </StyledTableCell>
          <StyledTableCell size="small"> Pos </StyledTableCell>
          <StyledTableCell> Avg Cost </StyledTableCell>
          <StyledTableCell size="medium"> Mkt Price </StyledTableCell>
          <StyledTableCell size="medium"> Mkt Value </StyledTableCell>
          <StyledTableCell size="medium"> Daily PnL </StyledTableCell>
          <StyledTableCell size="medium"> Unrl PnL </StyledTableCell>
          <StyledTableCell size="large" align="right">
            {" "}
            Unrl PnL (%){" "}
          </StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.keys(activePositions).map((symbol) => {
          const entry = activePositions[symbol];
          return <PortfolioRow key={entry.symbol} entry={entry} />;
        })}
      </TableBody>
    </Table>
  );
}
