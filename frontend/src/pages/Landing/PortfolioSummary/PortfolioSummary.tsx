import * as React from "react";
import { numberWithCommas } from "common/helper/general";
import { useConnectedStore } from "store/general/general";
import {
  CurrencyType,
  PortfolioInitDTO,
  PortfolioUpdateDTO,
  PortfolioValues,
  PortfolioValuesDTO,
} from "./type";
import { Grid, Typography } from "@mui/material";
import { ColorsEnum } from "common/theme";
import { usePortfolioStore } from "store/portfolio/base";

function connectPriceSocket(
  values: PortfolioValues,
  setValues: (value: PortfolioValues) => void
) {
  let ws = new WebSocket(
    `${process.env.REACT_APP_WEBSOCKET_URL}/portfolio/summary`
  );

  ws.onmessage = function (event) {
    const response: PortfolioValuesDTO = JSON.parse(event.data);
    if (response.type == "initialise")
      setValues(response.data as PortfolioInitDTO);
    else {
      const newValue: any = { ...values };
      const data = response.data as PortfolioUpdateDTO;
      const tag = data.tag as keyof typeof newValue;
      if (!Object.keys(newValue).includes(tag as string)) newValue[tag] = {};
      if (data.value) newValue[tag][data.currency] = data.value;
      setValues(newValue);
    }
  };

  ws.onerror = function (err: any) {
    ws.close();
    setTimeout(function () {
      connectPriceSocket(values, setValues);
    }, 2000);
  };

  return ws;
}

interface PortfolioCardProps {
  title: string;
  value: CurrencyType;
}
function PortfolioCard(props: PortfolioCardProps) {
  let value = "-";
  let color;
  if (props.value) {
    let rawValue = props.value.BASE ?? props.value.SGD;
    value = numberWithCommas(Math.abs(rawValue).toFixed(2));
    if (props.title.toLowerCase().includes("pnl")) color = ColorsEnum.green;
    if (rawValue < 0) {
      value = `(${value})`;
      color = ColorsEnum.red;
    }
  }

  return props.title ? (
    <Grid container style={{ padding: 5, paddingLeft: 10 }}>
      <Grid container>
        <Typography variant="subtitle2" component="div">
          {props.title}
        </Typography>
      </Grid>
      <Grid container>
        <Typography variant="h3" style={{ color: color }}>
          ${value}
        </Typography>
      </Grid>
    </Grid>
  ) : null;
}

const DailyPnLCard = () => {
  const activePositions = usePortfolioStore((state) => state.activePositions);
  return (
    <PortfolioCard
      title={"Daily PnL"}
      value={{
        BASE: Object.values(activePositions).reduce(
          (acc, obj) => acc + (obj.daily_pnl ?? 0),
          0
        ),
      }}
    />
  );
};

export default function PortfolioSummary() {
  const [values, setValues] = React.useState<PortfolioValues>(
    {} as PortfolioValues
  );
  const connected = useConnectedStore((state) => state.connected);

  React.useEffect(() => {
    const websocket = connectPriceSocket(values, setValues);
    return () => {
      if (websocket) websocket.close();
      console.log("PortfolioSummary WebSocket Connection Closed");
    };
  }, [connected]);

  return values ? (
    <div style={{ display: "flex", gap: 10, paddingBottom: 10 }}>
      <PortfolioCard
        title={"Net Liq Value (SGD)"}
        value={values.NetLiquidationByCurrency}
      />
      <PortfolioCard title={"Cash Balance"} value={values.CashBalance} />
      <DailyPnLCard />
      <PortfolioCard title={"Unrealised PnL"} value={values.UnrealizedPnL} />
      <PortfolioCard title={"Buying Power"} value={values.BuyingPower} />
      <PortfolioCard
        title={"Accrued Dividend"}
        value={values.AccruedDividend}
      />
    </div>
  ) : null;
}
