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
}> = (props) => {
  const sizes = { small: "5%", medium: "10%", large: "13%" };
  return (
    <TableCell
      style={{ paddingTop: 1, paddingBottom: 1 }}
      width={props.size ? sizes[props.size] : undefined}
    >
      <Typography
        variant="subtitle1"
        color={props.color}
        fontWeight={props.fontWeight}
      >
        {props.children}
      </Typography>
    </TableCell>
  );
};

const PortfolioRow: React.FC<PortfolioRowProps> = React.memo(({ entry }) => {
  const theme = useThemeStore();
  const navigate = useNavigate();

  const unrealised_pnl: number = entry.unrealised_pnl;
  const pnlColor = unrealised_pnl > 0 ? ColorsEnum.green : ColorsEnum.red;
  const pnlString =
    unrealised_pnl > 0
      ? `$${unrealised_pnl.toFixed(2)}`
      : `$(${unrealised_pnl.toFixed(2).slice(1)})`;
  const daily_pnl: number = entry.daily_pnl;
  let dailyPnlColor,
    dailyPnlString = "$-";
  if (daily_pnl) {
    dailyPnlColor = daily_pnl > 0 ? ColorsEnum.green : ColorsEnum.red;
    dailyPnlString = daily_pnl
      ? daily_pnl > 0
        ? `$${daily_pnl.toFixed(2)}`
        : `$(${daily_pnl.toFixed(2).slice(1)})`
      : "$-";
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
    </TableRow>
  );
});

export default function PortfolioPositionsTable() {
  const [activePositions, setActivePositions] = usePortfolioStore((state) => [
    state.activePositions,
    state.setActivePositions,
  ]);
  const connected = useConnectedStore((state) => state.connected);
  const webSocketRef = React.useRef<WebSocket | null>(null); // Using ref to persist WebSocket instance

  React.useEffect(() => {
    if (!webSocketRef.current) {
      webSocketRef.current = new WebSocket(
        `${process.env.REACT_APP_WEBSOCKET_URL}/portfolio/holdings`
      );

      webSocketRef.current.addEventListener("message", (event) => {
        const portfolioData: PortfolioWebsocketData = JSON.parse(event.data);
        const data: PortfolioPositions = portfolioData.data;
        setActivePositions(data);
      });
    }

    return () => {
      webSocketRef.current?.close();
      webSocketRef.current = null;
      console.log("PortfolioPositions WebSocket Connection Closed");
    };
  }, [connected]);

  return (
    <Table
      stickyHeader
      size="small"
      sx={{ tableLayout: "fixed", width: "100%", height: "100%" }}
    >
      <TableHead>
        <TableRow>
          <StyledTableCell size="medium"> Currency </StyledTableCell>
          <StyledTableCell> Exchange </StyledTableCell>
          <StyledTableCell> Symbol </StyledTableCell>
          <StyledTableCell size="medium"> Position </StyledTableCell>
          <StyledTableCell> Avg Cost </StyledTableCell>
          <StyledTableCell> Mkt Price </StyledTableCell>
          <StyledTableCell> Mkt Value </StyledTableCell>
          <StyledTableCell size="large"> Daily PnL </StyledTableCell>
          <StyledTableCell size="large"> Unrealised PnL </StyledTableCell>
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
