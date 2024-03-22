import * as React from "react";
import * as d3 from "d3";
import { ChartCanvasContext } from "../Chart/ChartCanvas";
import { ChartSettingsContent, useChartStore } from "../Chart/store";

const YAxis: React.FC = () => {
  const { chartId } = React.useContext(ChartCanvasContext)!;
  const { yScale, margin } = useChartStore(
    (state) =>
      state.chartSettings[
        chartId as keyof typeof state.chartSettings
      ] as ChartSettingsContent
  );

  // Ref for the group element
  const ref = React.useRef<SVGGElement>(null);

  React.useEffect(() => {
    if (!ref.current || !yScale) return;
    const yAxis = d3.axisLeft(yScale);
    d3.select(ref.current)
      .call(yAxis)
      .call((g) => g.select(".domain").remove());
  }, [yScale]);

  return (
    <g ref={ref} className="yAxis" transform={`translate(${margin.left},0)`} />
  );
};

export default YAxis;
