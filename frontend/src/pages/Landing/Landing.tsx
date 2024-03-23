import * as React from "react";

import Grid from "@mui/material/Grid";
import LivePlayer from "./LivePlayer";
import { ContainerWrapper } from "components/Wrappers/ContainerWrapper";
import PortfolioPositionsTable from "./PortfolioPositionsTable";
import PortfolioSummary from "./PortfolioSummary";
import PortfolioPieChart from "./PortfolioPieChart";

export default function Landing() {
  return (
    <ContainerWrapper>
      <Grid container spacing={2} columns={15}>
        <Grid item xs={10}>
          <PortfolioSummary />
          <PortfolioPositionsTable />
        </Grid>
        <Grid item xs={5}>
          <LivePlayer />
          <PortfolioPieChart
            size={300}
            margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
          />
        </Grid>
      </Grid>
    </ContainerWrapper>
  );
}
