import * as d3 from "d3";
import moment from "moment";
import * as React from "react";
import { ChartCanvasContext } from "../Chart/ChartCanvas";
import { ChartSettingsContent, useChartStore } from "../Chart/store";

const XAxis: React.FC = () => {
  const { chartId } = React.useContext(ChartCanvasContext)!;
  const { data, height, xScale, margin } = useChartStore(
    (state) =>
      state.chartSettings[
        chartId as keyof typeof state.chartSettings
      ] as ChartSettingsContent
  );

  const ref = React.useRef<SVGGElement>(null);
  React.useEffect(() => {
    if (!ref.current || !xScale) return;
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(5)
      .tickFormat((value) => moment(new Date(value)).format("DD MMM YY"))
      .tickValues(
        xScale.domain().filter(function (d, i) {
          if (i === 0 || i === data.length - 1) return true;
          else return !(i % 20);
        })
      );
    d3.select(ref.current)
      .call(xAxis)
      .call((g) => g.select(".domain").remove());
  }, [xScale]);

  return (
    <g
      ref={ref}
      className="xAxis"
      transform={`translate(0, ${height - margin.bottom})`}
    />
  );
};

export default XAxis;
