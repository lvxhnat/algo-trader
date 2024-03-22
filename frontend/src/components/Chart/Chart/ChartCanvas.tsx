import * as d3 from "d3";
import * as React from "react";
import { ChartCanvasProps } from "./type";
import { useChartStore } from "./store";

interface ChartCanvasContextProps {
  chartId: string;
}
export const ChartCanvasContext =
  React.createContext<null | ChartCanvasContextProps>(null);

const ChartCanvas: React.FC<ChartCanvasProps> = (props) => {
  const setChartSettings = useChartStore((state) => state.setChartSettings);
  const { children, chartId, xExtent, yExtent, ...storeValues } = props;
  const context = { chartId: chartId };

  if (!props.yExtent || !props.xExtent) return <></>;

  const xScale = d3
    .scaleBand()
    .range([props.margin.left, props.width - props.margin.right])
    .domain(xExtent)
    .padding(1);

  const yScale = d3
    .scaleLinear()
    .range([props.height - props.margin.bottom, props.margin.top])
    .domain(yExtent);

  setChartSettings({
    chartId: chartId,
    data: { ...storeValues, xScale: xScale, yScale: yScale },
  });

  return (
    <ChartCanvasContext.Provider value={context}>
      {children}
    </ChartCanvasContext.Provider>
  );
};

export default ChartCanvas;
