import * as React from "react";

import Grid from "@mui/material/Grid";
import LivePlayer from "./LivePlayer";
import { ContainerWrapper } from "components/Wrappers/ContainerWrapper";
import PortfolioPositions from "./PortfolioPositions";

export default function Landing() {
  return (
    <ContainerWrapper>
      <Grid container spacing={1}>
        <Grid item xs={7}>
          <PortfolioPositions />
        </Grid>
        <Grid item xs={5}>
          <LivePlayer />
        </Grid>
      </Grid>
    </ContainerWrapper>
  );
}
