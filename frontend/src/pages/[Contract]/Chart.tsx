import * as React from "react";
import * as S from "./style";
import CandlestickChartIcon from "@mui/icons-material/CandlestickChart";
import StackedLineChartIcon from "@mui/icons-material/StackedLineChart";
import { Button, Skeleton, Tooltip, Typography } from "@mui/material";
import { OHLCVData } from "components/Chart/Chart/type";
import {
  DurationTypes,
  Durations,
  IntervalTypes,
  Intervals,
  getHistoricalData,
} from "./requests";
import OHLCChart from "components/Chart/OHLCChart";
import { useConnectedStore } from "store/general/general";
import ButtonGroup from "@mui/material/ButtonGroup";
import { ColorsEnum } from "common/theme";

interface ChartProps {
  conId: string;
}

interface HistoricalParams {
  interval: IntervalTypes;
  duration: DurationTypes;
}

const DurationIntervalButton = (props: {
  historicalParams: HistoricalParams;
  setHistoricalParams: (val: HistoricalParams) => void;
}) => {
  const durationInterval: { [symbol: string]: IntervalTypes } = {
    "60 S": "1 secs", // 60 ticks
    "30 D": "1 hour", // 600 ticks
    "13 W": "1 hour",
    "6 M": "1 hour",
    "10 Y": "1 week",
  };
  return (
    <ButtonGroup variant="outlined">
      {Durations.map((val) => (
        <Button
          size="small"
          onClick={() =>
            props.setHistoricalParams({
              interval: durationInterval[val],
              duration: val as DurationTypes,
            })
          }
          variant={
            props.historicalParams.duration === val ? "contained" : "outlined"
          }
        >
          <Typography variant="subtitle2">{val.replace(/\s/g, "")}</Typography>
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default function Chart(props: ChartProps) {
  const [isLine, setIsLine] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [historicalParams, setHistoricalParams] = React.useState<{
    interval: IntervalTypes;
    duration: DurationTypes;
  }>({ interval: "1 day" as IntervalTypes, duration: "6 M" as DurationTypes });
  const [historicalData, setHistoricalData] = React.useState<OHLCVData[]>([]);
  const setConnected = useConnectedStore((state) => state.setConnected);

  React.useEffect(() => {
    setLoading(true);
    getHistoricalData(props.conId!, historicalParams)
      .then((res) => {
        setLoading(false);
        setHistoricalData(res.data);
      })
      .catch((error) => {
        if (error.code === "ECONNABORTED") setConnected(false);
      });
  }, [historicalParams]);

  return (
    <div>
      <S.MainWrapper>
        <S.LeftWrapper>
          <DurationIntervalButton
            historicalParams={historicalParams}
            setHistoricalParams={setHistoricalParams}
          />
        </S.LeftWrapper>
        <S.RightWrapper>
          <Button
            disableFocusRipple
            onClick={() => setIsLine(!isLine)}
            style={{ padding: 0 }}
          >
            {isLine ? (
              <CandlestickChartIcon fontSize="small" />
            ) : (
              <StackedLineChartIcon fontSize="small" />
            )}
          </Button>
        </S.RightWrapper>
      </S.MainWrapper>
      {loading ? (
        <Skeleton height="500px" width="100%" />
      ) : (
        <OHLCChart data={historicalData} isLine={isLine} />
      )}
    </div>
  );
}
