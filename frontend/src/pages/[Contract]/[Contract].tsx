import * as React from "react";
import { ContainerWrapper } from "components/Wrappers/ContainerWrapper";
import { useParams } from "react-router-dom";
import {
  ContractInfo,
  getContractInfo,
  getHistoricalData,
  getHistoricalNews,
} from "./requests";
import OHLCChart, { OHLCData } from "components/Chart/OHLCChart/OHLCChart";
import { Grid, Typography } from "@mui/material";
import { capitalizeString } from "common/helper/general";
import { currencyToEmoji } from "common/helper/countries";
import NewsTable from "./NewsTable";
import { ColorsEnum } from "common/theme";
import { useThemeStore } from "store/theme";

interface PriceInfo {
  last: number
  last_size: number
  last_bid: number
  last_bid_size: number
  last_ask: number 
  last_ask_size: number
  dividends: number
}

function connectPriceSocket(
  setPriceInfo: (value: PriceInfo) => void,
  contractId: string
) {
  let ws = new WebSocket(
    `${process.env.REACT_APP_WEBSOCKET_URL!}/contract/${contractId}/price`
  );

  ws.onmessage = function(event) {
    setPriceInfo(JSON.parse(event.data));
  };

  ws.onerror = function(err: any) {
    ws.close()
    setTimeout(function() {
      connectPriceSocket(setPriceInfo, contractId);
    }, 2000);
  };
  return ws
}

function PriceInfoShower(props: { contractId: string }) {

  const theme = useThemeStore();
  const [priceInfo, setPriceInfo] = React.useState<PriceInfo>({} as PriceInfo);

  React.useEffect(() => {
    connectPriceSocket(setPriceInfo, props.contractId)
  }, [])

  return ( priceInfo.last ?
    (
      <div style={{ display: "flex", gap: 10, alignItems: "flex-end", paddingTop: 10, paddingBottom: 5 }}>
        <Typography variant="h1" style={{ color: theme.mode === 'dark' ? ColorsEnum.grey : ColorsEnum.darkGrey }}>
          ${priceInfo.last.toFixed(2)}
        </Typography>
        <Typography variant="subtitle1" style={{ color: theme.mode === 'dark' ? ColorsEnum.grey : ColorsEnum.darkGrey }}>
          Last Bid: ${priceInfo.last_bid.toFixed(2)}
        </Typography>
        <Typography variant="subtitle1" style={{ color: theme.mode === 'dark' ? ColorsEnum.grey : ColorsEnum.darkGrey }}>
          Last Ask: ${priceInfo.last_ask.toFixed(2)}
        </Typography>
      </div>
    )
     : null
  )
}

export default function Contract() {
  const params = useParams();

  const [contractData, setContractData] = React.useState<ContractInfo>();
  const [historicalData, setHistoricalData] = React.useState<OHLCData[]>([]);
  const [historicalNews, setHistoricalNews] = React.useState<any[]>([]);

  React.useEffect(() => {
    getContractInfo(params.conId!).then((res) => setContractData(res.data));
    getHistoricalData(params.conId!).then((res) => setHistoricalData(res.data));
    
  }, []);

  return (
    <ContainerWrapper>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10}}>
      <Typography variant="h2">
        {" "}
        {contractData
          ? `${contractData.symbol} - ${capitalizeString(
              contractData.long_name
            )}`
          : null}{" "}
      </Typography>
      <Typography variant="subtitle2">
        {" "}
        {contractData
          ? `${contractData.exchange} | ${
              currencyToEmoji[
                contractData.currency as keyof typeof currencyToEmoji
              ]
            } ${contractData.currency}`
          : null}{" "}
      </Typography>
      </div>
      
      <PriceInfoShower contractId={params.conId!}/>
      <Grid container>
        <Grid item xs={9}>
          <OHLCChart data={historicalData} />
        </Grid>
        <Grid item xs={3}>
          <NewsTable conId={params.conId!} />
        </Grid>
      </Grid>
    </ContainerWrapper>
  );
}
