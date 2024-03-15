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

const StyledTableCell = (props: { children?: React.ReactNode }) => {
  return (
    <TableCell>
      <Typography variant="subtitle1">{props.children}</Typography>
    </TableCell>
  );
};
export default function PortfolioPositions() {
  const [activePositions, setActivePositions] = React.useState<PortfolioPositionsData[]>([]);
  React.useEffect(() => {
    getPortfolioPositions().then((res) => setActivePositions(res.data))
  }, []);

  return (
    <div>
      <Table
        stickyHeader
        size="small"
        sx={{ tableLayout: "fixed", width: "100%", height: "100%" }}
      >
        <TableHead>
          <TableRow>
          </TableRow>
        </TableHead>
        <TableBody>
          {activePositions.map((position) => (
            <TableRow key={`${position.symbol}-outstandingPositions`}>
              <StyledTableCell key={`${position.symbol}-cell2`}>
                {position.symbol}
              </StyledTableCell>
              <StyledTableCell key={`${position.symbol}-cell3`}>
                {position.position}
              </StyledTableCell>
              <StyledTableCell key={`${position.symbol}-cell3`}>
                ${position.average_cost.toFixed(2)}
              </StyledTableCell>
              <StyledTableCell key={`${position.symbol}-cell3`}>
                {position.exchange}
              </StyledTableCell>
              <StyledTableCell key={`${position.symbol}-cell3`}>
                {position.currency}
              </StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
