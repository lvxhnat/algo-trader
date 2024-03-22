import * as React from "react";
import moment from "moment";
import { ContainerWrapper } from "components/Wrappers/ContainerWrapper";
import { useParams } from "react-router-dom";
import { ContractInfo, getContractInfo } from "./requests";
import { Grid, Skeleton, Typography } from "@mui/material";
import { capitalizeString } from "common/helper/general";
import { currencyToEmoji } from "common/helper/countries";
import NewsTable from "./NewsTable";
import { ColorsEnum } from "common/theme";
import { useThemeStore } from "store/theme";
import Chart from "./Chart";

interface PriceInfo {
  status: "live" | "frozen" | "delayed" | "delayed frozen" | "error";
  last: number;
  last_size: number;
  last_bid: number;
  last_bid_size: number;
  last_ask: number;
  last_ask_size: number;
  dividends: number;
}

function connectPriceSocket(
  setPriceInfo: (value: PriceInfo) => void,
  contractId: string
) {
  let ws = new WebSocket(
    `${process.env.REACT_APP_WEBSOCKET_URL!}/contract/${contractId}/price`
  );

  ws.onmessage = function (event) {
    setPriceInfo(JSON.parse(event.data));
  };

  ws.onerror = function (err: any) {
    ws.close();
    setTimeout(function () {
      connectPriceSocket(setPriceInfo, contractId);
    }, 2000);
  };
  return ws;
}

function PriceInfoShower(props: { contractId: string }) {
  const theme = useThemeStore();
  const [priceInfo, setPriceInfo] = React.useState<PriceInfo>({} as PriceInfo);

  React.useEffect(() => {
    const socket = connectPriceSocket(setPriceInfo, props.contractId);
    return () => {
      socket.close();
      console.log("PriceInfoShower WebSocket Connection Closed");
    };
  }, []);

  return priceInfo.status !== "error" && priceInfo.status ? (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "flex-end",
        paddingTop: 5,
        paddingBottom: 5,
      }}
    >
      <Typography
        variant="h2"
        style={{
          color: theme.mode === "dark" ? ColorsEnum.grey : ColorsEnum.darkGrey,
        }}
      >
        ${priceInfo.last ? priceInfo.last.toFixed(2) : "-"}
      </Typography>
      <Typography
        variant="subtitle1"
        style={{
          color: theme.mode === "dark" ? ColorsEnum.grey : ColorsEnum.darkGrey,
        }}
      >
        Last Bid: ${priceInfo.last_bid ? priceInfo.last_bid.toFixed(2) : "-"}
      </Typography>
      <Typography
        variant="subtitle1"
        style={{
          color: theme.mode === "dark" ? ColorsEnum.grey : ColorsEnum.darkGrey,
        }}
      >
        Last Ask: ${priceInfo.last_ask ? priceInfo.last_ask.toFixed(2) : "-"}
      </Typography>
    </div>
  ) : (
    <Skeleton
      animation="wave"
      height={60}
      width={"50%"}
      sx={{ opacity: "50%" }}
    />
  );
}

export default function Contract() {
  const params = useParams();
  const theme = useThemeStore();
  const [contractData, setContractData] = React.useState<ContractInfo>();

  React.useEffect(() => {
    getContractInfo(params.conId!).then((res) => setContractData(res.data));
  }, []);

  return (
    <ContainerWrapper>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 5 }}>
        <Typography variant="h3">
          {" "}
          {contractData
            ? `${contractData.symbol} - ${capitalizeString(
                contractData.long_name
              )}`
            : null}{" "}
        </Typography>
      </div>
      <PriceInfoShower contractId={params.conId!} />
      <div>
        <Typography variant="subtitle2">
          {contractData
            ? `${contractData.exchange} | ${
                currencyToEmoji[
                  contractData.currency as keyof typeof currencyToEmoji
                ]
              }${contractData.currency} 
            | Liquid Hours: ${
              contractData.liquid_hours[moment(new Date()).format("YYYYMMDD")]
                .start
            } - ${
                contractData.liquid_hours[moment(new Date()).format("YYYYMMDD")]
                  .end
              } (${contractData.time_zone})`
            : null}{" "}
        </Typography>
        <Typography
          variant="subtitle2"
          style={{
            color:
              theme.mode === "dark"
                ? ColorsEnum.warmgray5
                : ColorsEnum.coolgray2,
          }}
        >
          {" "}
          {contractData
            ? [
                contractData.industry,
                contractData.category,
                contractData.sub_category,
              ]
                .filter((item) => item)
                .join(" | ")
            : null}{" "}
        </Typography>
      </div>
      <Grid container>
        <Grid item xs={9}>
          <Chart conId={params.conId!}/>
        </Grid>
        <Grid item xs={3}>
          <NewsTable conId={params.conId!} />
        </Grid>
      </Grid>
    </ContainerWrapper>
  );
}
