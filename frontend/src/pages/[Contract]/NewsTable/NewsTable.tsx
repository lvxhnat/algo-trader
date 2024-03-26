import * as React from "react";
import moment from "moment";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useConnectedStore } from "store/general/general";
import { ColorsEnum } from "common/theme";
import { useThemeStore } from "store/theme";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "common/constant";
import { getHistoricalNews } from "../requests";
import { StyledTableRow } from "components/Tables/BaseTable/StyledTableRow";

const StyledTableCell: React.FC<{
  children?: React.ReactNode;
  color?: string;
  size?: "small" | "large";
}> = (props) => {
  const sizes = { small: "35%", large: "65%" };
  return (
    <TableCell
      style={{ paddingTop: 1, paddingBottom: 1 }}
      width={props.size ? sizes[props.size] : undefined}
    >
      <Typography variant="subtitle1" color={props.color} noWrap>
        {props.children}
      </Typography>
    </TableCell>
  );
};

interface NewsRowProps {
  symbol: string;
  contract_id: string;
}

interface NewsTableData {
  article_id: string;
  datetime: string;
  headline: string;
  provider_code: string;
}

function NewsRow(props: NewsRowProps) {
  const theme = useThemeStore();
  const navigate = useNavigate();
  return (
    <TableRow
      key={`${props.symbol}-outstandingPositions`}
      sx={{
        "&:hover": {
          cursor: "pointer",
          backgroundColor:
            theme.mode === "light" ? ColorsEnum.coolgray6 : ColorsEnum.darkGrey,
        },
      }}
      onClick={() => navigate(`${ROUTES.CONTRACT}/${props.contract_id}`)}
    ></TableRow>
  );
}
React.memo(NewsRow);

interface NewsTableProps {
  conId: number;
}

export default function NewsTable(props: NewsTableProps) {
  const [historicalNews, setHistoricalNews] = React.useState<NewsTableData[]>(
    []
  );
  const connected = useConnectedStore((state) => state.connected);

  React.useEffect(() => {
    // getHistoricalNews(props.conId).then((res) => setHistoricalNews(res.data));
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
            <StyledTableCell size="small"> Date </StyledTableCell>
            <StyledTableCell size="large"> Headline </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {historicalNews.map((entry) => {
            return (
              <StyledTableRow>
                <StyledTableCell size="small">
                  {" "}
                  {moment(new Date(entry.datetime)).format(
                    "DD MMM YY HH:mm"
                  )}{" "}
                </StyledTableCell>
                <StyledTableCell size="large">
                  {" "}
                  {entry.headline}{" "}
                </StyledTableCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
