import * as React from "react";
import { ContainerWrapper } from "components/Wrappers/ContainerWrapper";
import { useParams } from "react-router-dom";
import { ContractInfo, getContractInfo, getHistoricalData, getHistoricalNews } from "./requests";
import OHLCChart, { OHLCData } from "components/Chart/OHLCChart/OHLCChart";
import { Grid, Typography } from "@mui/material";
import { capitalizeString } from "common/helper/general";
import { currencyToEmoji } from "common/helper/countries";
import NewsTable from "./NewsTable";

export default function Contract() {
  const params = useParams();
  const [contractData, setContractData] = React.useState<ContractInfo>();
  const [historicalData, setHistoricalData] = React.useState<OHLCData[]>([]);
  const [historicalNews, setHistoricalNews] = React.useState<any[]>([]);

  React.useEffect(() => {
    getContractInfo(params.conId!).then((res) => setContractData(res.data));
    getHistoricalData(params.conId!).then((res) => setHistoricalData(res.data));
    getHistoricalNews(params.conId!).then((res) => {
      console.log(res.data)
      setHistoricalNews(res.data)
    });
  }, []);

  return (
    <ContainerWrapper>
      <Typography variant="h1">
        {" "}
        {contractData
          ? `${contractData.symbol} - ${capitalizeString(
              contractData.long_name
            )}`
          : null}{" "}
      </Typography>
      <Typography variant="subtitle1">
        {" "}
        {contractData
          ? `${contractData.exchange} | ${
              currencyToEmoji[
                contractData.currency as keyof typeof currencyToEmoji
              ]
            } ${contractData.currency}`
          : null}{" "}
      </Typography>
      <Grid container>
        <Grid item xs={9}>
        <OHLCChart data={historicalData} />
        </Grid>
        <Grid item xs={3}>
          <NewsTable conId={params.conId!}/>
        </Grid>
      </Grid>
    </ContainerWrapper>
  );
}
