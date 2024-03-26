import * as React from "react";
import moment from "moment-timezone";
import Chart from "./Chart";
import NewsTable from "./NewsTable";
import { ContractInfo, getContractInfo, getHistoricalData } from "./requests";
import { useParams } from "react-router-dom";
import { Chip, Grid, Skeleton, Typography } from "@mui/material";

import { ContainerWrapper } from "components/Wrappers/ContainerWrapper";
import { capitalizeString } from "common/helper/general";
import { currencyToEmoji } from "common/helper/countries";
import { ColorsEnum } from "common/theme";
import { useThemeStore } from "store/theme";
import BuySellClose from "./BuySellClose/BuySellClose";

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
  conId: number
) {
  let ws = new WebSocket(
    `${process.env.REACT_APP_WEBSOCKET_URL!}/contract/${conId}/price`
  );

  ws.onmessage = function (event) {
    setPriceInfo(JSON.parse(event.data));
  };

  ws.onerror = function (err: any) {
    ws.close();
    setTimeout(function () {
      connectPriceSocket(setPriceInfo, conId);
    }, 2000);
  };
  return ws;
}

function PriceInfoShower(props: { conId: number }) {
  const theme = useThemeStore();
  const defaultColor =
    theme.mode === "dark" ? ColorsEnum.grey : ColorsEnum.darkGrey;
  const [openPrice, setOpenPrice] = React.useState<number>();
  const [priceInfo, setPriceInfo] = React.useState<PriceInfo>({} as PriceInfo);

  React.useEffect(() => {
    const socket = connectPriceSocket(setPriceInfo, props.conId);
    getHistoricalData(props.conId, {
      duration: "5 D",
      interval: "1 day",
    }).then((res) => {
      setOpenPrice(res.data[res.data.length - 2].close);
    });
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
          color: defaultColor,
        }}
      >
        ${priceInfo.last ? priceInfo.last.toFixed(2) : "-"}
      </Typography>
      <Typography
        variant="h3"
        style={{
          color: openPrice
            ? openPrice < priceInfo.last
              ? ColorsEnum.green
              : ColorsEnum.red
            : defaultColor,
        }}
      >
        {priceInfo.last && openPrice
          ? `${(priceInfo.last - openPrice).toFixed(2)} (${(
              (100 * (priceInfo.last - openPrice)) /
              priceInfo.last
            ).toFixed(2)}%)`
          : null}
      </Typography>
      <Typography
        variant="subtitle1"
        style={{
          color: defaultColor,
        }}
      >
        Last Bid: ${priceInfo.last_bid ? priceInfo.last_bid.toFixed(2) : "-"}
      </Typography>
      <Typography
        variant="subtitle1"
        style={{
          color: defaultColor,
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

const getMarketStatus = (
  tradingHours: any,
  liquidHours: any,
  timeZone: string
) => {
  const dateToday = moment(new Date()).format("YYYYMMDD");
  const trading = tradingHours[dateToday];
  const liquid = liquidHours[dateToday];

  if (liquid == "Hours") return "Market Closed";

  const localTime = moment.tz(moment(), timeZone).format("HHmm");
  if (localTime > trading.end || localTime < trading.start)
    return "Market Closed";
  if (localTime > liquid.start && localTime < liquid.end) return "Market Open";
  if (localTime > trading.start) return "Pre-Market";
  if (localTime < trading.end) return "Post-Market";
};

interface MarketStatusPillProps {
  tradingHours: any;
  liquidHours: any;
  timeZone: any;
}

const MarketStatusPill = (props: MarketStatusPillProps) => {
  const [marketStatus, setMarketStatus] = React.useState<string>();
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setMarketStatus(
        getMarketStatus(props.tradingHours, props.liquidHours, props.timeZone)
      );
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Chip
      label={marketStatus}
      size="small"
      style={{
        backgroundColor:
          marketStatus === "Market Closed"
            ? ColorsEnum.red
            : marketStatus === " Market Open"
            ? ColorsEnum.green
            : ColorsEnum.oldschoolOrange,
        fontSize: `calc(0.25rem + 0.3vw)`,
        height: 15,
        color: ColorsEnum.white,
      }}
      sx={{
        "& .MuiChip-label": {
          paddingTop: 0, // Adjust label padding as needed
          paddingBottom: 0, // Adjust label padding as needed
        },
      }}
    />
  );
};

export default function Contract() {
  const params = useParams();
  const theme = useThemeStore();
  const [contractData, setContractData] = React.useState<ContractInfo>();
  React.useEffect(() => {
    getContractInfo(params.conId!)
      .then((res) => setContractData(res.data))
      .catch(() => null);
  }, []);

  const formatDate = (dateItem: any) =>
    dateItem[moment(new Date()).format("YYYYMMDD")];

  return (
    <ContainerWrapper>
      <Grid container>
        <Grid item xs={9}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 5 }}>
            <Typography variant="h3">
              {" "}
              {contractData
                ? `${contractData.symbol} - ${capitalizeString(
                    contractData.long_name
                  )}`
                : null}{" "}
            </Typography>
            {contractData ? (
              <MarketStatusPill
                timeZone={contractData.time_zone}
                tradingHours={contractData.trading_hours}
                liquidHours={contractData.liquid_hours}
              />
            ) : null}
          </div>
          <PriceInfoShower conId={Number(params.conId)} />
          <div>
            <Typography variant="subtitle2">
              {contractData
                ? `${contractData.exchange} | ${
                    currencyToEmoji[
                      contractData.currency as keyof typeof currencyToEmoji
                    ]
                  }${contractData.currency} 
            | Liquid Hours: ${
              formatDate(contractData.liquid_hours) == "Closed"
                ? "Closed"
                : formatDate(contractData.liquid_hours).start
                ? `${formatDate(contractData.liquid_hours).start} - ${
                    formatDate(contractData.liquid_hours).end
                  } (${contractData.time_zone})`
                : "NA"
            }`
                : null}
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
          <Chart conId={Number(params.conId)} />
        </Grid>
        <Grid item xs={3}>
          <BuySellClose />
          <NewsTable conId={Number(params.conId)} />
        </Grid>
      </Grid>
    </ContainerWrapper>
  );
}
