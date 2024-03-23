import * as React from "react";
import * as d3 from "d3";
import { ChartCanvasContext } from "../ChartCanvas";
import { ChartSettingsContent, useChartStore } from "../store";
import { ColorsEnum } from "common/theme";
import { useThemeStore } from "store/theme";

export default function CandleStickSeries() {
  const theme = useThemeStore();
  const ref = React.useRef<SVGGElement>(null);
  const { chartId } = React.useContext(ChartCanvasContext)!;
  const { data, xScale, yScale } = useChartStore(
    (state) =>
      state.chartSettings[
        chartId as keyof typeof state.chartSettings
      ] as ChartSettingsContent
  );

  React.useEffect(() => {
    if (!data) return;

    const svg = d3.select(ref.current);

    const g = svg
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("transform", (d) => `translate(${xScale(d.date)},0)`);

    g.append("line")
      .attr("y1", (d) => yScale(d.low))
      .attr("y2", (d) => yScale(d.high))
      .attr("stroke-width", 1)
      .attr(
        "stroke",
        theme.mode === "dark" ? ColorsEnum.white : ColorsEnum.black
      );

    g.append("line")
      .attr("y1", (d) => yScale(d.open))
      .attr("y2", (d) => yScale(d.close))
      .attr("stroke-width", 3)
      .attr("stroke", (d) =>
        d.close > d.open ? ColorsEnum.green : ColorsEnum.red
      );
  }, [data, xScale, yScale]);

  return <g className="CandleStickSeries" ref={ref} />;
}
