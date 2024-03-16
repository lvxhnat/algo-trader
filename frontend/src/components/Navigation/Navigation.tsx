import * as S from "./style";
import * as React from "react";

import Logo from "../../assets/logo.png";

import { useNavigate } from "react-router-dom";
import { ROUTES } from "common/constant";
import AnalyticsButton from "./AnalyticsButton";
import ProfileButton from "./ProfileButton";
import { Grid } from "@mui/material";

interface NavigationProps {
  hideNavigate?: boolean;
}

export default function Navigation(props: NavigationProps) {
  const navigate = useNavigate();

  return (
    <Grid container style={{ paddingTop: 10, paddingBottom: 10 }}>
      <Grid item xs={2}>
        <S.IconButtonWrapper
          disableRipple
          onClick={() => navigate(ROUTES.LANDING)}
        >
          <img
            src={Logo}
            alt="home"
            style={{ width: props.hideNavigate ? 150 : 100 }}
          />
        </S.IconButtonWrapper>
      </Grid>
      <Grid
        item
        xs={8}
        style={{ display: "flex", gap: 25 }}
        justifyContent="center"
      >
        {props.hideNavigate ? (
          <></>
        ) : (
          <React.Fragment>
          </React.Fragment>
        )}
      </Grid>
      <Grid item xs={2} display="flex" justifyContent="flex-end"><ProfileButton/></Grid>
    </Grid>
  );
}
