import * as React from "react";
import { Chart, ChartCanvas } from "./Chart";
import { OHLCVData } from "./Chart/type";
import YAxis from "./Axis/YAxis";
import XAxis from "./Axis/XAxis";
import CandleStickSeries from "./Chart/ChartTypes/CandleStickSeries";
import CrossHairCursor from "./Mouse/CrossHair";
import PriceTooltip from "./ToolTip/PriceTooltip";
import { LineSeries } from "./Chart/ChartTypes";

interface OHLCChartProps {
  data: OHLCVData[];
}

export default function OHLCChart(props: OHLCChartProps) {
  const data = props.data.slice(props.data.length - 200, props.data.length);
  const getExtentY = (arr: OHLCVData[]): [number, number] | undefined => {
    if (arr.length === 0) return undefined;

    let min = arr[0].low;
    let max = arr[0].high;

    for (let i = 1; i < arr.length; i++) {
      if (arr[i].low < min) min = arr[i].low;
      if (arr[i].high > max) max = arr[i].high;
    }

    const highest = max + (max - min) * 0.1;
    const minBoundary = (max - min) * 0.3;
    const lowest = min - minBoundary;

    return [lowest, highest];
  };

  const getExtentX = (arr: OHLCVData[]): string[] | undefined =>
    arr.map((value) => value.date);

  return (
    <ChartCanvas
      chartId="1"
      width={1200}
      height={500}
      margin={{ top: 5, right: 20, bottom: 30, left: 40 }}
      data={data}
      yExtent={getExtentY(data)!}
      xExtent={getExtentX(data)!}
    >
      <PriceTooltip />
      <Chart>
        <YAxis />
        <XAxis />
        <CandleStickSeries />
        <LineSeries />
        <CrossHairCursor />
      </Chart>
    </ChartCanvas>
  );
}
