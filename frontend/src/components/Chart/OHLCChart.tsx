import * as React from "react";
import { Chart, ChartCanvas } from "./Chart";
import { OHLCVData } from "./Chart/type";
import YAxis from "./Axis/YAxis";
import XAxis from "./Axis/XAxis";
import CandleStickSeries from "./Chart/ChartTypes/CandleStickSeries";
import CrossHairCursor from "./Mouse/CrossHair";
import PriceTooltip from "./ToolTip/PriceTooltip";
import { HorizontalLineSeries, LineSeries } from "./Chart/ChartTypes";
import { useOrdersStore } from "store/general/general";
import { ColorsEnum } from "common/theme";

interface OHLCChartProps {
  chartId: number; // conId
  data: OHLCVData[];
  isOHLC?: boolean;
}

export default function OHLCChart(props: OHLCChartProps) {
  const data = props.data;
  const orders = useOrdersStore((state) => state.orders[props.chartId]);
  console.log(orders);
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
      chartId={props.chartId}
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
        {props.isOHLC ? <CandleStickSeries /> : <LineSeries />}
        {orders
          ? orders.map((d) => (
              <HorizontalLineSeries
                key={d.order_type}
                color={d.action === "SELL" ? ColorsEnum.red : ColorsEnum.green}
                text={`🔔 ${d.action} ${d.order_type} ${d.time_in_force} $${d.trailstop_price}/${d.total_quantity}`}
                d1={{ date: props.data[0].date, value: d.trailstop_price }}
                d2={{
                  date: props.data[props.data.length - 1].date,
                  value: d.trailstop_price,
                }}
              />
            ))
          : null}
        <CrossHairCursor />
      </Chart>
    </ChartCanvas>
  );
}
