import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { PortfolioPositionsData, getPortfolioPositions } from "./requests";
import { useConnectedStore } from "store/general/general";

const StyledTableCell = (props: { children?: React.ReactNode }) => {
  return (
    <TableCell style={{ paddingTop: 1, paddingBottom: 1 }}>
      <Typography variant="subtitle1">{props.children}</Typography>
    </TableCell>
  );
};
export default function PortfolioPositions() {
  const [activePositions, setActivePositions] = React.useState<
    PortfolioPositionsData[]
  >([]);
  const connected = useConnectedStore(state => state.connected)
  React.useEffect(() => {
    getPortfolioPositions().then((res) => setActivePositions(res.data));
  }, [connected]);

  return (
    <div>
      <Table
        stickyHeader
        size="small"
        sx={{ tableLayout: "fixed", width: "100%", height: "100%" }}
      >
        <TableHead>
          <TableRow></TableRow>
        </TableHead>
        <TableBody>
          {activePositions.map((position) => (
            <TableRow key={`${position.symbol}-outstandingPositions`}>
              <StyledTableCell key={`${position.symbol}-cell1`}>
                {position.symbol}
              </StyledTableCell>
              <StyledTableCell key={`${position.symbol}-cell2`}>
                {position.position}
              </StyledTableCell>
              <StyledTableCell key={`${position.symbol}-cell3`}>
                ${position.average_cost.toFixed(2)}
              </StyledTableCell>
              <StyledTableCell key={`${position.symbol}-cell4`}>
                {position.exchange}
              </StyledTableCell>
              <StyledTableCell key={`${position.symbol}-cell5`}>
                {position.currency}
              </StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
