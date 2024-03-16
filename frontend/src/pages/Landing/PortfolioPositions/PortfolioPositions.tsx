import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { PortfolioWebsocketData, PositionTableData } from "./requests";
import { useConnectedStore } from "store/general/general";
import { ColorsEnum } from "common/theme";
import { numberWithCommas } from "common/helper/general";

interface Position {
  symbol: string;
  position: number;
  average_cost: number;
  market_price: number;
  market_value: number;
  unrealised_pnl: number;
  exchange: string;
  currency: string;
}

interface PortfolioRowProps {
  entry: Position;
}

const StyledTableCell: React.FC<{
  children?: React.ReactNode;
  color?: string;
  size?: "small" | "medium" | "large";
}> = (props) => {
  const sizes = { small: "5%", medium: "10%", large: "15%" };
  return (
    <TableCell
      style={{ paddingTop: 1, paddingBottom: 1 }}
      width={props.size ? sizes[props.size] : undefined}
    >
      <Typography variant="subtitle1" color={props.color}>
        {props.children}
      </Typography>
    </TableCell>
  );
};

const PortfolioRow: React.FC<PortfolioRowProps> = React.memo(({ entry }) => {
  const unrealised_pnl = entry.unrealised_pnl;
  const pnlColor = unrealised_pnl > 0 ? ColorsEnum.green : ColorsEnum.red;
  const pnlString =
    unrealised_pnl > 0
      ? `$${unrealised_pnl}`
      : `$ -(${unrealised_pnl.toFixed(2).slice(1)})`;

  return (
    <TableRow key={`${entry.symbol}-outstandingPositions`}>
      <StyledTableCell>{entry.symbol}</StyledTableCell>
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
      <StyledTableCell color={pnlColor}>{pnlString}</StyledTableCell>
      <StyledTableCell>{entry.exchange}</StyledTableCell>
      <StyledTableCell>{entry.currency}</StyledTableCell>
    </TableRow>
  );
});

export default function PortfolioPositions() {
  const [activePositions, setActivePositions] =
    React.useState<PositionTableData>({});

  const connected = useConnectedStore((state) => state.connected);

  React.useEffect(() => {
    const socket = new WebSocket(
      `${process.env.REACT_APP_WEBSOCKET_URL!}/portfolio/holdings`
    );
    socket.addEventListener("open", (event) => {
      socket.send("Connection established");
    });
    socket.addEventListener("message", (event) => {
      const portfolioData: PortfolioWebsocketData = JSON.parse(event.data);
      if (portfolioData.status === "initialise") {
        const d: PositionTableData = {};
        portfolioData.data.map((entry) => {
          d[entry.symbol] = entry;
        });
        return setActivePositions(d);
      }
    });
  }, [connected]);

  return (
    <div>
      <Table
        stickyHeader
        size="small"
        sx={{ tableLayout: "fixed", width: "100%", height: "100%" }}
      >
        <TableHead>
          <TableRow>
            <StyledTableCell> Symbol </StyledTableCell>
            <StyledTableCell size="medium"> Position </StyledTableCell>
            <StyledTableCell> Avg Cost </StyledTableCell>
            <StyledTableCell> Mkt Price </StyledTableCell>
            <StyledTableCell> Mkt Value </StyledTableCell>
            <StyledTableCell size="large"> Unrealised PnL </StyledTableCell>
            <StyledTableCell> Exchange </StyledTableCell>
            <StyledTableCell> Currency </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(activePositions).map((symbol) => {
            const entry = activePositions[symbol];
            return <PortfolioRow key={entry.symbol} entry={entry} />;
          })}
        </TableBody>
      </Table>
    </div>
  );
}
